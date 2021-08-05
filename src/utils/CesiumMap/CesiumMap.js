import * as Cesium from 'cesium';
// 导入Cesium源码中的Viewer组件，注意这里是用的Viewer组件的方式加载，而不是加载整个Cesium
import Viewer from 'cesium/Source/Widgets/Viewer/Viewer';

const arcGisProvider = new Cesium.ArcGISTiledElevationTerrainProvider({
  url: 'https://elevation3d.arcgis.com/arcgis/rest/services/WorldElevation3D/Terrain3D/ImageServer',
});

const widgetListSimple = {
  geocoder: false, // 是否显示地名查找控件
  homeButton: false, // 是否显示Home按钮
  sceneModePicker: false, // 是否显示3D/2D选择器
  baseLayerPicker: false, // 是否显示图层选择控件
  navigationHelpButton: false, // 是否显示帮助信息控件
  animation: false, // 是否显示动画控件
  creditContainer: null, // 底部的版权信息等（dom节点的id）
  timeline: false, // 是否显示时间线控件
  fullscreenButton: false, // 是否显示全屏按钮
  vrButton: false,
  terrainProvider: arcGisProvider,
  infoBox: false, // 是否显示点击要素之后显示的信息
  selectionIndicator: false, // 绿色选中框
};

class CesiumMap {
  /**
   * -------------------------------------------------------------
   * 构造函数 定义初始变量 运行 初始化函数等
   *
   * @param {string} target 地图盒子div的id
   * @param {object} viewPosition 地图的 经纬度 和 视角
   * @param {object} widgetSetting 地图控件的设置
   */
  constructor(target, viewPosition = {}, widgetSetting = {}, customLayer) {
    // 地图盒子div的id
    this.target = target;
    // 地图 默认经度
    this.lon = viewPosition.lon || 104.06003544;
    // 地图 默认纬度
    this.lat = viewPosition.lat || 13.49921328;
    // 地图 默认缩放等级
    this.height = viewPosition.height || 19000000;
    // 地图 角度
    this.angle = viewPosition.angle || -90;
    // 地图控件设置
    this.widgetSetting = { ...widgetListSimple, ...widgetSetting };
    // 地图对象
    this.viewer = {};
    // 地图坐标系标准
    this.ellipsoid = {};
    // 底图集合
    this.baseLayersList = {};
    // 当前底图
    this.currentLayer = customLayer || 'Bing Maps Aerial';

    // 用户自定义添加的图层集合
    this.customLayerAddList = {};

    // 初始化地图 默认图层列表
    this.initBaseLayer();
    // 初始化地图
    this.initMap();
  }

  /**
   * -------------------------------------------------------------
   * 初始化函数
   */
  initBaseLayer() {
    this.baseLayersList = {
      'Bing Maps Aerial':
        this.viewer?.imageryLayers?.get(0) ||
        new Cesium.BingMapsImageryProvider({
          url: 'https://dev.virtualearth.net',
          key: 'AufUNVVfVL_qsKYkVoctJBZTMDhMGl7T_XzIYDgt7XkVJprTOvu04D6sRyx-EFft',
          mapStyle: Cesium.BingMapsStyle.AERIAL,
        }), // the default base layer
      'Bing Maps Road': Cesium.createWorldImagery({
        style: Cesium.IonWorldImageryStyle.ROAD,
      }),
      'World Street Maps': new Cesium.ArcGisMapServerImageryProvider({
        url: 'https://services.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer',
      }),
      OpenStreetMaps: new Cesium.OpenStreetMapImageryProvider(),
      'Stamen Maps': new Cesium.OpenStreetMapImageryProvider({
        url: 'https://stamen-tiles.a.ssl.fastly.net/watercolor/',
        fileExtension: 'jpg',
        credit:
          'Map tiles by Stamen Design, under CC BY 3.0. Data by OpenStreetMap, under CC BY SA.',
      }),
      'Natural Earth II': new Cesium.TileMapServiceImageryProvider({
        url: Cesium.buildModuleUrl('Assets/Textures/NaturalEarthII'),
      }),
      'USGS Shaded Relief': new Cesium.WebMapTileServiceImageryProvider({
        url: 'https://basemap.nationalmap.gov/arcgis/rest/services/USGSShadedReliefOnly/MapServer/WMTS',
        layer: 'USGSShadedReliefOnly',
        style: 'default',
        format: 'image/jpeg',
        tileMatrixSetID: 'default028mm',
        maximumLevel: 19,
        credit: 'U. S. Geological Survey',
      }),
    };
  }

  initMap() {
    this.viewer = new Viewer(this.target, {
      ...this.widgetSetting,
    });
    // 获取当前坐标系标准
    this.ellipsoid = this.viewer.scene.globe.ellipsoid;
    // 默认移动到固定位置和视角
    this.flyTo();
  }

  /**
   * -------------------------------------------------------------
   * 获取地图参数
   */
  getBaseInfo() {
    // 获取当前镜头位置的笛卡尔坐标
    const cameraPos = this.viewer.camera.position;
    // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
    const cartographic = this.ellipsoid.cartesianToCartographic(cameraPos);
    return { cameraPos, cartographic };
  }

  getHeight() {
    const { cartographic } = this.getBaseInfo();
    // 获取镜头的高度
    const { height } = cartographic;
    return { height };
  }

  getCoordinates() {
    const { cartographic } = this.getBaseInfo();
    // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
    const lon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
    const lat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));
    return { lon, lat };
  }

  /**
   * -------------------------------------------------------------
   * 地图控制方法
   */
  // 添加地图 底图图层
  addBaseLayerOption(name, imageryProvider) {
    let layer;
    if (typeof imageryProvider === 'undefined') {
      layer = this.viewer.imageryLayers.get(0);
    } else {
      layer = new Cesium.ImageryLayer(imageryProvider);
    }
    layer.name = name;
    this.baseLayersList[name] = layer;
  }

  // 更改map底图
  changeMapLayer(key) {
    // key = Bing Maps Aerial; Bing Maps Road; World Street Maps; OpenStreetMaps; Stamen Maps;Natural Earth II;
    if (this.currentLayer !== key) {
      Object.keys(this.baseLayersList).map((item) => {
        this.viewer.imageryLayers.remove(this.baseLayersList[item], false);
      });

      this.viewer.imageryLayers.add(this.baseLayersList[key]);
      this.currentLayer = key;
    }
  }

  // 有动画的移动
  flyTo(viewPosition = {}) {
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(
        viewPosition.lon || this.lon,
        viewPosition.lat || this.lat,
        viewPosition.height || this.height,
      ), // 设置位置
      orientation: {
        heading: Cesium.Math.toRadians(0),
        pitch: Cesium.Math.toRadians(viewPosition.angle || this.angle), // 倾斜角度
      },
    });
  }

  // 无动画的移动
  lookAt(viewPosition = {}) {
    const center = Cesium.Cartesian3.fromDegrees(
      viewPosition.lon || this.lon,
      viewPosition.lat || this.lat,
    );
    const heading = Cesium.Math.toRadians(0);
    const pitch = Cesium.Math.toRadians(viewPosition.angle || this.angle);
    const range = viewPosition.height || this.height;
    this.viewer.camera.lookAt(center, new Cesium.HeadingPitchRange(heading, pitch, range));
  }

  // 改变到地球的高度，即相机的高度
  setHeight(hei) {
    const { lon, lat } = this.getCoordinates();
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, hei),
      duration: 1.0,
    });
  }

  // 放大
  zoomPlus(level = 1.8) {
    const { height } = this.getHeight();
    const { lon, lat } = this.getCoordinates();
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height / level),
      duration: 1.0,
    });
  }

  // 缩小
  zoomMinus(level = 1.8) {
    const { height } = this.getHeight();
    const { lon, lat } = this.getCoordinates();
    this.viewer.camera.flyTo({
      destination: Cesium.Cartesian3.fromDegrees(lon, lat, height * level),
      duration: 1.0,
    });
  }

  /**
   * -------------------------------------------------------------
   * 图层相关方法
   */
  // 添加图层
  addInMap(layer) {
    if (layer.type === 'ImageryLayer') {
      this.viewer.imageryLayers.add(layer.data);
      this.customLayerAddList[layer.key] = { state: true, ...layer };
    }
    if (layer.type === 'GeoJsonDataSource') {
      this.viewer.dataSources.add(layer.data);
      this.customLayerAddList[layer.key] = { state: true, ...layer };
    }
  }

  // 是否包含图层
  containsInMap(key) {
    const layer = this.customLayerAddList[key];
    if (layer.type === 'ImageryLayer') {
      return this.viewer.imageryLayers.contains(layer.data);
    }
    if (layer.type === 'GeoJsonDataSource') {
      return this.viewer.dataSources.contains(layer.data);
    }
    return false;
  }

  /**
   * WMS 图层
   * @param {string} layKey 图层唯一id
   * @param {string} url 数据源的链接
   * @param {string} layers WMS层的名称
   * @param {object} otherOpt 其他配置项
   */
  addWMS(layKey, url, layers, otherOpt = {}) {
    const provider = new Cesium.WebMapServiceImageryProvider({
      url,
      layers,
      parameters: {
        service: 'WMS',
        format: 'image/png',
        transparent: true,
      },
      ...otherOpt,
    });
    const Layer = new Cesium.ImageryLayer(provider);
    this.addInMap({ key: layKey, type: 'ImageryLayer', data: Layer });
  }

  /**
   * GeoJson 图层
   * @param {string} layKey 图层唯一id
   * @param {JSON} jsonSource json数据源
   * @param {object} styleOpt 默认样式
   * @param {function} customOpt 自定义样式
   */
  addGeoJson(layKey, jsonSource, styleOpt = {}, customOpt = () => {}) {
    const provider = Cesium.GeoJsonDataSource.load(jsonSource, styleOpt);
    provider.then((res) => {
      // 修改图层唯一名称
      res.name = layKey;
      this.addInMap({ key: layKey, type: 'GeoJsonDataSource', data: res });
      // 自定义样式
      const entities = res.entities.values;
      customOpt(entities);
    });
  }

  /**
   *
   * @param {string} layKey 图层唯一id
   * @param {string} url 数据源的链接
   * @param {object} otherOpt 其他配置项
   */
  addUrlXYZ(layKey, url, otherOpt = {}) {
    const provider = new Cesium.UrlTemplateImageryProvider({
      url,
      ...otherOpt,
    });
    const Layer = new Cesium.ImageryLayer(provider);
    this.addInMap({ key: layKey, type: 'ImageryLayer', data: Layer });
  }

  // 删除图层
  removeLayer(layKey, destroy = false) {
    if (this.customLayerAddList[layKey]?.state) {
      if (this.customLayerAddList[layKey]?.type === 'ImageryLayer') {
        this.viewer.imageryLayers.remove(this.customLayerAddList[layKey].data, destroy);
        delete this.customLayerAddList[layKey];
      }
      if (this.customLayerAddList[layKey]?.type === 'GeoJsonDataSource') {
        this.viewer.dataSources.remove(this.customLayerAddList[layKey].data, destroy);
        delete this.customLayerAddList[layKey];
      }
    }
  }

  // 删除所有 DataSource 实例
  removeSourcesAll(destroy = false) {
    this.viewer.dataSources.removeAll(destroy);
  }

  // 删除所有 图像图层 示例
  removeImageryAll(destroy = false) {
    this.viewer.imageryLayers.removeAll(destroy);
  }
}

export default CesiumMap;
