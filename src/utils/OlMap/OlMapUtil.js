import { Tile as TileLayer } from 'ol/layer';
import { BingMaps, XYZ } from 'ol/source';
import { getArea, getLength } from 'ol/sphere';
import OSM from 'ol/source/OSM';

function extentCenter(extent) {
  return [(extent[0] + extent[2]) / 2, (extent[1] + extent[3]) / 2];
}

function langlatIsInExtent(langlat, extent) {
  // 判断 坐标 是否在 范围 内
  return (
    langlat[0] > extent[0] &&
    langlat[0] < extent[2] &&
    langlat[1] > extent[1] &&
    langlat[1] < extent[3]
  );
}

function langlatIsInExtents(langlat, extents) {
  // 判断 坐标 是否在 一堆范围 内 如果在 返回index数组
  const res = [];
  for (let i = 0; i < extents.length; i += 1) {
    if (langlatIsInExtent(langlat, extents[i])) {
      res.push(i);
    }
  }
  return res;
}

function extentAndExtentIsIntersect(extent1, extent2) {
  // 判断 范围 和 范围 是否相交或者包含
  return !(
    extent1[0] > extent2[2] ||
    extent1[2] < extent2[0] ||
    extent1[1] > extent2[3] ||
    extent1[3] < extent2[1]
  );
}

function expandExtent(extent, times = 0.5) {
  // 扩大范围
  const x = extent[2] - extent[0];
  const y = extent[3] - extent[1];

  return [
    extent[0] - x * times,
    extent[1] - y * times,
    extent[2] + x * times,
    extent[3] + y * times,
  ];
}

function PointsInExtent(points) {
  // 计算一堆点坐标的最小包含矩形
  // 返回一个extent （左下角 和 右上角 点坐标集合）
  // points = [ [1,3] , [2,4] ]
  const extent = [points[0][0], points[0][1], points[0][0], points[0][1]];
  for (let i = 1; i < points.length; i += 1) {
    const [x, y] = points[i];
    if (x < extent[0]) extent[0] = x;
    if (y < extent[1]) extent[1] = y;
    if (x > extent[2]) extent[2] = x;
    if (y > extent[3]) extent[3] = y;
  }
  return extent;
}

/**
 * imageLoadFunction 函数 重构渲染图片
 * | 传入一个处理颜色的函数 该函数将得到图片的每一个点的颜色，返回的颜色将会替换掉原来的颜色
 * | rgba是数组 一共4个值 最后一个值是透明度 0-255 0为完全透明 255表示不透明
 */
function getImageLoadFunction(fixColor = (rgba) => rgba) {
  return (imageTile, src) => {
    const img = new Image();
    img.crossOrigin = '';
    img.onload = () => {
      const canvas = document.createElement('canvas');
      const w = img.width;
      const h = img.height;
      canvas.width = w;
      canvas.height = h;
      const context = canvas.getContext('2d');
      context.drawImage(img, 0, 0, w, h, 0, 0, w, h);
      const imageData = context.getImageData(0, 0, w, h);
      for (let i = 0; i < imageData.height; i += 1) {
        for (let j = 0; j < imageData.width; j += 1) {
          const x = i * 4 * imageData.width + j * 4;
          [
            imageData.data[x],
            imageData.data[x + 1],
            imageData.data[x + 2],
            imageData.data[x + 3],
          ] = fixColor([
            imageData.data[x],
            imageData.data[x + 1],
            imageData.data[x + 2],
            255,
          ]);
        }
      }
      context.putImageData(imageData, 0, 0);
      const image = imageTile.getImage();
      image.src = canvas.toDataURL('image/png');
    };
    img.src = src;
  };
}

const sourceE = { OSM, XYZ, BingMaps };
function FixCustomInitMapLayers(layers, defaultKey) {
  // 自定义默认底图
  // layers = [
  //   {
  //     layerKey: 'tianditu',
  //     type: 'XYZ',
  //     option: `{"url":"123","maxZoom": 18}`,
  //   },
  //   {
  //     layerKey: 'OSM',
  //     type: 'OSM',
  //   },
  // ];
  // defaultKey = 'tianditu';
  const mapLayers = {
    Empty: new TileLayer(),
  };
  layers.map((item) => {
    let opt = {};
    try {
      opt = JSON.parse(item.option);
      // eslint-disable-next-line no-empty
    } catch (e) {}
    mapLayers[item.layerKey] = new TileLayer({
      source: new sourceE[item.type](opt),
    });
  });
  return { mapLayers, mapLayersKey: defaultKey || layers[0].layerKey };
}

const extentToPolygon = (extent) => {
  return [
    [
      [extent[0], extent[1]],
      [extent[2], extent[1]],
      [extent[2], extent[3]],
      [extent[0], extent[3]],
      [extent[0], extent[1]],
    ],
  ];
};

/**
 * 测量线段的距离
 * @param {LineString} line The line.
 * @return {string} The formatted length.
 */
const formatLength = (line) => {
  // 计算平面距离
  const length = getLength(line, { projection: 'EPSG:4326' });
  // 定义输出变量
  let output;
  // 如果长度大于100，则使用km单位，否则使用m单位
  if (length > 100) {
    output = `${Math.round((length / 1000) * 100) / 100} km`;
  } else {
    output = `${Math.round(length * 100) / 100} m`;
  }
  return output;
};

/**
 * 测量框选出来的面积
 * @param {Polygon} polygon The polygon.
 * @return {string} Formatted area.
 */
const formatArea = (polygon) => {
  // 获取平面面积
  const area = getArea(polygon, { projection: 'EPSG:4326' });
  // 定义输出变量
  let output;
  // 当面积大于10000时，转换为平方千米，否则为平方米
  if (area > 10000) {
    output = `${Math.round((area / 1000000) * 100) / 100} km²`;
  } else {
    output = `${Math.round(area * 100) / 100} m²`;
  }
  return output;
};

export default {
  getImageLoadFunction,
  extentToPolygon,
  expandExtent,
  langlatIsInExtent,
  langlatIsInExtents,
  extentAndExtentIsIntersect,
  extentCenter,
  FixCustomInitMapLayers,
  PointsInExtent,
  formatLength,
  formatArea,
};
