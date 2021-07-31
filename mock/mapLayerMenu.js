// 获取地图 图层菜单
const mapMenuGroup = [
  {
    title: 'GIS地图',
    children: [
      {
        layerKey: 'TianDiTuRoad',
        // title: '天地图 GIS地图',
        title: '天地图',
        type: 'XYZ',
        option:
          '{"url":"http://t0.tianditu.com/DataServer?T=vec_w&x={x}&y={y}&l={z}&tk=b59f9bce7dbf26905ce1e81669d049ee"}',
      },
      {
        layerKey: 'OSMRoad',
        // title: 'OSM GIS地图',
        title: 'OSM',
        type: 'OSM',
        option: '{}',
      },
      {
        layerKey: 'MapBoxRoad',
        // title: 'MapBox GIS地图',
        title: 'MapBox',
        type: 'XYZ',
        option:
          '{"url":"https://api.mapbox.com/styles/v1/mapbox/streets-v11/tiles/256/{z}/{x}/{y}?access_token=pk.eyJ1IjoidHh4dyIsImEiOiJja292N3poZGowNTA0Mm9xczludjg3NnV2In0.e8C5X6IFKruJ3z4k3dynDw"}',
      },
    ],
  },
  {
    title: '卫星地图',
    children: [
      {
        layerKey: 'TianDiTu',
        // title: '天地图 卫星地图',
        title: '天地图',
        type: 'XYZ',
        option:
          '{"maxZoom":18,"url":"http://t0.tianditu.com/DataServer?T=img_w&x={x}&y={y}&l={z}&tk=b59f9bce7dbf26905ce1e81669d049ee"}',
      },
      {
        layerKey: 'Bing',
        // title: 'Bing 卫星地图',
        title: 'Bing',
        type: 'BingMaps',
        option:
          '{"key":"AufUNVVfVL_qsKYkVoctJBZTMDhMGl7T_XzIYDgt7XkVJprTOvu04D6sRyx-EFft","imagerySet":"Aerial"}',
      },
      {
        layerKey: 'MapBox',
        // title: 'MapBox 卫星地图',
        title: 'MapBox',
        type: 'XYZ',
        option:
          '{"url":"https://api.mapbox.com/v4/mapbox.satellite/{z}/{x}/{y}.jpg?access_token=pk.eyJ1IjoidHh4dyIsImEiOiJja292N3poZGowNTA0Mm9xczludjg3NnV2In0.e8C5X6IFKruJ3z4k3dynDw"}',
      },
    ],
  },
];

export default {
  'GET /api/mapLayerMenu': {
    retCode: 200,
    mapLayerMenu: mapMenuGroup,
  },
};
