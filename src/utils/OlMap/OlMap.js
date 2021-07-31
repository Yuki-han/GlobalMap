/* eslint-disable */
import 'ol/ol.css';
import { Feature, Map, View } from 'ol';
import { defaults } from 'ol/control';
import { transform, transformExtent } from 'ol/proj';
import OSM from 'ol/source/OSM';
import Draw from 'ol/interaction/Draw';
import { Point, Polygon, LineString } from 'ol/geom';

import Select from 'ol/interaction/Select';
import Overlay from 'ol/Overlay';
import { click } from 'ol/events/condition';

import { Style, Icon, Circle, Text, Fill, Stroke } from 'ol/style';

import { GeoJSON } from 'ol/format';
import {
  DragPan,
  KeyboardPan,
  DragRotate,
  PinchRotate,
  DragZoom,
  DoubleClickZoom,
  KeyboardZoom,
  MouseWheelZoom,
  DragRotateAndZoom,
  PinchZoom,
} from 'ol/interaction';

import {
  Tile as TileLayer,
  Vector as VectorLayer,
  Image as ImageLayer,
  VectorTile as VectorTileLayer,
} from 'ol/layer';
import {
  XYZ,
  BingMaps,
  Vector as VectorSource,
  VectorTile as VectorTileSource,
  ImageStatic as ImageStaticSource,
  ImageWMS as ImageWMSSource,
  TileWMS as TileWMSSource,
  WMTS as WMTSSource,
} from 'ol/source';
import { bool } from 'prop-types';

class OlMap {
  /**
   * -------------------------------------------------------------
   * 构造函数 定义初始变量 运行 初始化函数等等
   *
   * customInitMapLayers 自定义底图
   *   mapLayers里面放置所有地图layer
   *   mapLayersKey里面则代表默认要渲染的地图的key
   *
   * customInitMapLayers = {
   *   mapLayers: {
   *     OSM: new TileLayer({ source: new OSM() }),
   *     BingMaps: new TileLayer({ source: new BingMaps() }),
   *   },
   *   mapLayersKey: 'OSM'
   * }
   */
  constructor(target, center, zoom, customInitMapLayers, LinkageOlMap) {
    // 地图div的id，用于渲染地图canvas
    this.target = target;
    // 地图默认中心点
    this.center = center || [116.41667, 39.91667];
    // 地图默认缩放等级
    this.zoom = zoom || 16;
    // 总地图对象
    this.map = null;
    // 总地图对象 里面的 视图对象
    // LinkageOlMap 指 地图对比联动的 参考地图对象
    this.mapView = (LinkageOlMap && LinkageOlMap.mapView) || null;
    // 坐标系编码
    this.EPSG = 'EPSG:4326';

    // 地图底图合集，标准底图 卫星云图 bing地图 天地图 等提供的接口
    this.mapLayers = {};
    // 地图底图的指针
    this.mapLayersKey = 'Bing';

    // 地图 资源合集 资源和图层一一对应key一致即对应
    this.source = {};
    // 地图 图层合集 资源和图层一一对应key一致即对应
    this.layer = {};
    // addLayer的图层的key会变成true 方便判断该Layer是否被加入了地图
    this.layerAddGather = {};
    // draw对象存放地 跟地图资源图层 有对应关系
    this.draw = {};
    // feature对象存放地
    this.feature = {};
    // overlay对象存放地
    this.overlay = {};

    /**
     * 有四种图层可选 Tile Image Vector VectorTile
     */
    this.LayerE = {
      VectorLayer,
      TileLayer,
      ImageLayer,
      VectorTileLayer,
    };

    /**
     * 有多种资源可选
     * ol.source.BingMaps ，必应地图的切片数据，继承自ol.source.TileImage；
     * ol.source.Cluster，聚簇矢量数据，继承自ol.source.Vector；
     * ol.source.ImageCanvas，数据来源是一个 canvas 元素，其中的数据是图片，继承自 ol.source.Image；
     * ol.source.ImageMapGuide，Mapguide 服务器提供的图片地图数据，继承自 ol.source.Image，触发ol.source.ImageEvent；
     * ol.source.ImageStatic，提供单一的静态图片地图，继承自ol.source.Image；
     * ol.source.ImageVector，数据来源是一个 canvas 元素，但是其中的数据是矢量来源
     * ol.source.Vector，继承自 ol.source.ImageCanvas；
     * ol.source.ImageWMS，WMS 服务提供的单一的图片数据，继承自 ol.source.Image，触发
     * ol.source.ImageEvent；
     * ol.source.MapQuest，MapQuest 提供的切片数据，继承自 ol.source.XYZ；
     * ol.source.OSM，OpenStreetMap 提供的切片数据，继承自 ol.source.XYZ；
     * ol.source.Stamen，Stamen 提供的地图切片数据，继承自 ol.source.XYZ；
     * ol.source.TileVector，被切分为网格的矢量数据，继承自 ol.source.Vector；
     * ol.source.TileDebug，并不从服务器获取数据，而是为切片渲染一个网格，继承自 ol.source.Tile；
     * ol.source.TileImage，提供切分成切片的图片数据，继承自 ol.source.Tile，触发
     * ol.source.TileEvent；
     * ol.source.TileUTFGrid，TileJSON 格式 的 UTFGrid 交互数据，继承自 ol.source.Tile；
     * ol.source.TileJSON，TileJSON 格式的切片数据，继承自 ol.source.TileImage；
     * ol.source.TileArcGISRest，ArcGIS Rest 服务提供的切片数据，继承自 ol.source.TileImage；
     * ol.source.WMTS，WMTS 服务提供的切片数据。继承自 ol.source.TileImage；
     * ol.source.XYZ，XYZ 格式的切片数据，继承自 ol.source.TileImage；
     * ol.source.Zoomify，Zoomify 格式的切片数据，继承自 ol.source.TileImage。
     * ol.source.Image，提供单一图片数据的类型，直接继承自 ol.source.Source；
     * ol.source.Tile，提供被切分为网格切片的图片数据，继承自 ol.source.Source；
     * ol.source.Vector，提供矢量图层数据，继承自 ol.source.Source；
     * 目前只提供其中的一部分 按需增加吧
     */
    this.sourceE = {
      OSM,
      XYZ,
      BingMaps,
      VectorSource,
      VectorTileSource,
      ImageStaticSource,
      ImageWMSSource,
      TileWMSSource,
      WMTSSource,
    };

    // 初始化函数执行 初始化底图数组列表
    if (customInitMapLayers) {
      this.mapLayers = customInitMapLayers.mapLayers;
      this.mapLayersKey = customInitMapLayers.mapLayersKey;
    } else {
      this.initMapLayers();
    }
    // 初始化函数执行 初始化地图
    this.initMap();
  }

  /**
   * -------------------------------------------------------------
   * 初始化函数 包括但不限于 地图底图 draw 图层 等初始化
   */
  initMapLayers() {
    // 初始化 地图底图
    // 地图 底图 图层 的 数组；可以用 changeMapLayer 方法 切换底图

    const tiandituToken = 'b59f9bce7dbf26905ce1e81669d049ee';

    const MapBoxToken =
      'pk.eyJ1IjoidHh4dyIsImEiOiJja292N3poZGowNTA0Mm9xczludjg3NnV2In0.e8C5X6IFKruJ3z4k3dynDw';

    this.mapLayers = {
      // 空地图
      Empty: new TileLayer(),

      // 天地图 卫星地图
      TianDiTu: new TileLayer({
        source: new XYZ({
          maxZoom: 18,
          url: `http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`,
        }),
      }),

      // 天地图 路网地图
      TianDiTuRoad: new TileLayer({
        source: new XYZ({
          // maxZoom: 18,
          url: `http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`,
        }),
      }),

      // 天地图 文字标注地图
      TianDiTuAnnotation: new TileLayer({
        source: new XYZ({
          // maxZoom: 18,
          url: `http://t0.tianditu.com/DataServer?T=cva_w&x={x}&y={y}&l={z}&tk=${tiandituToken}`,
        }),
      }),

      // bing地图 卫星地图
      Bing: new TileLayer({
        source: new BingMaps({
          key: 'AufUNVVfVL_qsKYkVoctJBZTMDhMGl7T_XzIYDgt7XkVJprTOvu04D6sRyx-EFft',
          imagerySet: 'Aerial',
        }),
      }),

      // OSM 路网地图
      OSMRoad: new TileLayer({ source: new OSM() }),

      // mapbox 卫星地图
      MapBox: new TileLayer({
        source: new XYZ({
          url: `https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=${MapBoxToken}`,
        }),
      }),

      // mapbox 街道地图
      MapBoxRoad: new TileLayer({
        source: new XYZ({
          url: `https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=${MapBoxToken}`,
        }),
      }),
    };

    return this;
  }

  initMap() {
    // 初始化地图对象
    this.map = new Map({
      controls: defaults({ attribution: false, zoom: false, rotate: false }),
      logo: 'false',
      target: this.target,
      layers: [this.mapLayers[this.mapLayersKey]],
      view: this.mapView || new View({ projection: this.EPSG }),
    });
    this.mapView = this.map.getView();
    this.setCenter();
    this.setZoom();
    return this;
  }

  initLayers(layerKey, layerOpt = { zIndex: 0 }, type = 'VectorLayer') {
    // 实例化一个矢量图层VectorLayers作为图层
    this.layer[layerKey] = new this.LayerE[type]({ ...layerOpt });
    return this;
  }

  initLayersBySelf(layerKey, layer) {
    // 实例化一个矢量图层VectorLayers作为图层
    this.layer[layerKey] = layer;
    return this;
  }

  addLayer(layerKey) {
    // 将layerKey图层的Layer 加入地图
    if (this.layer[layerKey] && !this.layerAddGather[layerKey]) {
      this.map.addLayer(this.layer[layerKey]);
      this.layerAddGather[layerKey] = true;
    }
    return this;
  }

  removeLayer(layerKey) {
    // 将Layer图层 移除地图
    this.map.removeLayer(this.layer[layerKey]);
    this.layerAddGather[layerKey] = false;
    return this;
  }

  destroyLayer(layerKey) {
    // 将Layer图层 移除地图 并摧毁消失
    this.removeLayer(layerKey);
    this.layer[layerKey] = undefined;
    return this;
  }

  initSource(sourceKey, VectorSourceOpt = {}, type = 'VectorSource') {
    // 实例化一个矢量图层VectorSource作为资源层
    this.source[sourceKey] = new this.sourceE[type]({ ...VectorSourceOpt });
    return this;
  }

  setSource(layerKey, sourceKey) {
    // 将sourceKey资源 加入 layerKey图层 由于一个图层只能由一个资源 并且资源也是必须要的 所以只提供set方法 remove不需要
    // 如果需要替换source直接重新set即可
    this.layer[layerKey].setSource(this.source[sourceKey]);
    return this;
  }

  destroySource(sourceKey) {
    // 同上 destroy并不会在某个图层中移除该source 因为其必要性 要么就连同图层一起摧毁即可
    this.layer[sourceKey] = undefined;
    return this;
  }

  /**
   * -------------------------------------------------------------
   * 控制函数 包括 绘制图层等
   * key是图层、资源、对象存储的关键 一切访问以key为准
   * 资源 在 图层 里面 清理资源不会清理图层 清理图层那么资源就没了
   * 图层相当于楼层 资源相当于楼层里面的展示物品
   */
  changeMapLayer(key) {
    // 改变地图底图
    if (key === this.mapLayersKey) {
      return;
    }
    this.mapLayersKey = key;
    Object.keys(this.mapLayers).map((key) => {
      this.map.removeLayer(this.mapLayers[key]);
    });
    this.map.addLayer(this.mapLayers[this.mapLayersKey]);
    return this;
  }

  clearSource(key) {
    // 根据key清理该资源 但没有清理对象 只是把加载的图像清理了
    this.source[key].clear();
    return this;
  }

  clearLayer(key) {
    // 根据key清理该图层 包括对象资源 之后就必须重新initLayers
    this.removeLayer(key);
    this.layer[key] = undefined;
    this.source[key] = undefined;
    return this;
  }
  /**
   * -------------------------------------------------------------
   * 一些工具函数
   */
  getRandomKey() {
    return 'key_' + Math.random() + 'time_' + new Date().getTime();
  }
  /**
   * -------------------------------------------------------------
   * 一些实用的直接加载封装
   */
  addGeoJSON(key = 'geoJSON', geojsonObject, layersOpt) {
    // 插入geoJSON渲染，key指定图层key 需要重新渲染图层 无法加入现有的key图层 如果key存在 那么geoJSON会覆盖该key的图层
    this.initSource(key, {
      features: new GeoJSON().readFeatures(geojsonObject),
    });
    this.initLayers(key, layersOpt);
    this.addLayer(key);
    this.setSource(key, key);
    return this;
  }

  addHttpGeoJSON(key = 'geoJSON', GeoJSONOpt, SourceOpt = { url: '' }, layersOpt) {
    // 插入geoJSON渲染，key指定图层key 需要重新渲染图层 无法加入现有的key图层 如果key存在 那么geoJSON会覆盖该key的图层
    // url 写在SourceOpt里面
    this.initSource(key, { format: new GeoJSON(GeoJSONOpt), ...SourceOpt });

    this.initLayers(key, layersOpt);
    this.addLayer(key);
    this.setSource(key, key);
    return this;
  }

  addImg(key = 'img', url, extent, zIndex, sourceOpt = {}) {
    // 插入一张图片
    // extent 左下角 右上角[113, 30.2, 115, 32.2]
    if (this.layer[key]) {
      this.destroyLayer(key);
    }
    if (this.source[key]) {
      this.destroySource(key);
    }
    this.initSource(
      key,
      {
        url, // 地址
        projection: this.EPSG,
        imageExtent: transformExtent(extent, this.EPSG, this.EPSG),
        ...sourceOpt,
      },
      'ImageStaticSource',
    );
    this.initLayers(key, { zIndex }, 'ImageLayer');
    this.addLayer(key);
    this.setSource(key, key);
    return this;
  }

  removeImg(key = 'img') {
    if (this.layer[key]) {
      this.destroyLayer(key);
    }
    if (this.source[key]) {
      this.destroySource(key);
    }
  }

  addWMS(key, WMSOpt, zIndex, type = 'Image') {
    // type可选 Image Tile
    // tiff 地图服务切片加载
    // url: HOST+'/geoserver/wzf/wms'
    this.initSource(key, WMSOpt, type + 'WMSSource');
    this.initLayers(key, { zIndex }, type + 'Layer');
    this.addLayer(key);
    this.setSource(key, key);
    return this;
  }

  addWMTS(key, WMTSOpt, zIndex = 0) {
    // tiff 地图服务切片加载
    this.initLayers(key, { zIndex }, 'TileLayer');
    this.initSource(key, WMTSOpt, 'WMTSSource');
    this.setSource(key, key);
    this.addLayer(key);
    return this;
  }

  addOverlay(target, callback, type = 'click', defaultSelectStyle = true) {
    const key = target;
    this.overlay[key] = new Overlay({
      element: document.getElementById(target),
    });
    this.map.addOverlay(this.overlay[key]);
    this.overlay[key].setPosition(undefined); // 移动到未知未知 相当于隐藏

    const move = (coordinate) => {
      this.overlay[key].setPosition(coordinate); // 移动到对应位置 相当于显示出overlay
    };

    if (type === 'select') {
      let select = new Select({ condition: click });
      select.on('select', (evt) => {
        if (evt.selected[0] !== null && !defaultSelectStyle) {
          // 取消选中要素高亮 defaultSelectStyle 默认显示默认的样式 设为false就在选中后不改变样式
          select.getFeatures().clear();
        }
        callback(evt, (coordinate = evt.mapBrowserEvent.coordinate) => move(coordinate));
      });
      this.map.addInteraction(select);
    } else if (type) {
      // 这里可以自定义 map 的 on 事件
      this.map.on(type, (evt) => {
        callback(evt, (coordinate = evt.coordinate) => move(coordinate));
      });
    } else {
      // 如果点击事件需要自定义 那就用这个 返回的move来控制overlay显示的位置 和触发事件
      // callback 和 type 都传入空 即可
      return move;
    }
    return move;
  }

  // 快速初始化
  addFast(key, zIndex = 0) {
    this.initLayers(key, { zIndex });
    this.initSource(key);
    this.setSource(key, key);
    this.addLayer(key);
  }
  /**
   * -------------------------------------------------------------
   * 绘制图形方法
   * key代表该图形键值 可以用key获取到已经创建好的图形
   */
  initFeature(key, type, style, geometryOpt, featureOpt = {}) {
    if (key === '') {
      key = this.getRandomKey();
    }
    const GeometryE = { Point, Polygon, LineString };
    this.feature[key] = new Feature({
      geometry: new GeometryE[type](geometryOpt),
      ...featureOpt,
    });
    if (style) {
      this.feature[key].setStyle(style);
    }
    return this.feature[key];
  }

  addFeature(sourceKey, featureKey) {
    try {
      if (typeof featureKey === 'string') {
        this.source[sourceKey].addFeature(this.feature[featureKey]);
      } else {
        this.source[sourceKey].addFeature(featureKey);
      }
    } catch (e) {}
    return this;
  }

  removeFeature(sourceKey, featureKey) {
    try {
      if (typeof featureKey === 'string') {
        this.source[sourceKey].removeFeature(this.feature[featureKey]);
      } else {
        this.source[sourceKey].removeFeature(featureKey);
      }
    } catch (e) {}
    return this;
  }

  destroyFeature(featureKey) {
    this.feature[featureKey] = undefined;
    return this;
  }

  /**
   * -------------------------------------------------------------
   * draw方法
   */
  initDraw(key = 'draw', type = 'Polygon', drawOpt = {}, layerOpt = { zIndex: 99 }) {
    // 如果没有初始化图层就来initDraw 那么主动建立一个图层 z=100 但没法自定义图层的一些样式之类的东西了
    // 如果有样式之类的需求 必须先主动 this.initLayers('key') 或者 在获得对应的layer上主动setStyle
    // type可选项： Point LineString LinearRing Polygon MultiPoint MultiLineString MultiPolygon GeometryCollection Circle
    //             https://openlayers.org/en/latest/apidoc/module-ol_geom_GeometryType.html
    // 监听draw：   initDraw().on('drawend', (e) => console.log(e) )
    if (this.source[key] === undefined) {
      // 检测key的图层是否存在 如果不存在就新建一个图层
      this.initLayers(key, layerOpt);
      this.initSource(key, {});
      this.addLayer(key);
      this.setSource(key, key);
    }
    // draw对象初始化
    this.draw[key] = new Draw({ source: this.source[key], type, ...drawOpt });
    return this.draw[key];
  }

  checkDrawKey(key = 'draw') {
    // 判断draw是否初始化了
    return this.draw[key] !== undefined;
  }

  startDraw(key = 'draw') {
    // 开始绘图  必须先initDraw
    if (this.checkDrawKey(key)) {
      this.map.addInteraction(this.draw[key]);
    }
    return this;
  }

  stopDraw(key = 'draw') {
    // 结束绘图
    if (this.checkDrawKey(key)) {
      this.map.removeInteraction(this.draw[key]);
    }
    return this;
  }

  clearDraw(key = 'draw') {
    // 清理绘图的图形
    if (this.checkDrawKey(key)) this.clearSource(key);
    return this;
  }

  destroyDraw(key = 'draw') {
    // 摧毁draw
    if (this.checkDrawKey(key)) {
      this.stopDraw(key);
      this.clearDraw(key);
      this.draw[key] = undefined;
      this.clearLayer(key);
    }
    return this;
  }

  /**
   * -------------------------------------------------------------
   * 地图控制 设置中心点 设置缩放等级等等
   */
  setCenter(longLat, animate = true) {
    // animate 显示移动的动画   false就是直接移动过去
    if (!longLat || longLat.length === 0) {
      longLat = this.center;
    }
    let center = [];
    if (longLat.length === 4) {
      center.push((longLat[0] + longLat[2]) / 2);
      center.push((longLat[1] + longLat[3]) / 2);
    } else {
      center = longLat;
    }
    if (animate) {
      this.mapView.animate({ center });
    } else {
      this.mapView.setCenter(transform(center, this.EPSG, this.EPSG));
    }
    return this;
  }

  fitTo(coordinate, zoom, animate = true) {
    // animate 显示移动的动画   false就是直接移动过去
    let center = [];

    if (!coordinate) {
      center = this.center;
    } else {
      center.push(coordinate.lng);
      center.push(coordinate.lat);
    }

    if (animate) {
      this.mapView.animate({ center });
    } else {
      this.mapView.setCenter(transform(center, this.EPSG, this.EPSG));
    }

    this.setZoom(zoom);
    return this;
  }

  fit(extent, opt = {}) {
    this.map.getView().fit(extent, { duration: 1000, ...opt });
    return this;
  }

  setZoom(zoom, animate = true) {
    if (!zoom || zoom.length === 0) {
      zoom = this.zoom;
    }
    if (animate) {
      this.mapView.animate({ zoom });
    } else {
      this.mapView.setZoom(zoom);
    }
    return this;
  }

  zoomPlus(animate = true) {
    this.setZoom(this.mapView.getZoom() + 1, animate);
    return this;
  }

  zoomMinus(animate = true) {
    this.setZoom(this.mapView.getZoom() - 1, animate);
    return this;
  }

  setInteractionsActive(opt) {
    // 设置地图是否可拖动，可以禁用 拖动 旋转 缩放
    // opt = { pan:true, rotate:false, zoom:true }  可选填依次为： 拖动 旋转 缩放
    this.map.getInteractions().forEach((element) => {
      if ((element instanceof DragPan || element instanceof KeyboardPan) && opt.pan !== undefined) {
        element.setActive(opt.pan);
      }
      if (
        (element instanceof DragRotate || element instanceof PinchRotate) &&
        opt.rotate !== undefined
      ) {
        element.setActive(opt.rotate);
      }
      if (
        (element instanceof DragZoom ||
          element instanceof PinchZoom ||
          element instanceof DoubleClickZoom ||
          element instanceof KeyboardZoom ||
          element instanceof MouseWheelZoom ||
          element instanceof DragRotateAndZoom) &&
        opt.zoom !== undefined
      ) {
        element.setActive(opt.zoom);
      }
    });
    return this;
  }

  setAllInteractionsActive(active) {
    this.map.getInteractions().forEach((element) => {
      element.setActive(active);
      // if (element instanceof DragPan) {
      //   element.setActive(active);
      // }
    });
    return this;
  }
}

export default OlMap;
