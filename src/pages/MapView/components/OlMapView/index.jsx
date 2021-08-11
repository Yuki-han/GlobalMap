import React, { useEffect } from 'react';
import { connect } from 'umi';

import OlMap from '@/utils/OlMap/OlMap';
import OlMapUtil from '@/utils/OlMap/OlMapUtil';

const MapOpenLayer = (props) => {
  const { dispatch, basicMapStore, style } = props;
  const { basicMap, mapLayerMenu } = basicMapStore;

  useEffect(() => {
    if (dispatch && !basicMap) {
      // 动态获取底图
      dispatch({ type: 'basicMapStore/getMapLayerMenu' });
    }
  }, []);

  useEffect(() => {
    if (mapLayerMenu.length > 0 && !basicMap) {
      const Layers = [];
      mapLayerMenu.map((item) => {
        Layers.push(...item.children);
      });

      const initMapLayers = OlMapUtil.FixCustomInitMapLayers(Layers, 'OSMRoad');
      // 实例化地图对象,采用自定义地图底图的方式
      const temp = new OlMap('MapFrame', undefined, undefined, initMapLayers);

      // 地图定位
      temp.fit([73, 15, 135, 54]);
      // 保存地图对象
      dispatch({
        type: 'basicMapStore/setState',
        payload: { basicMap: temp, MapLayer: initMapLayers.mapLayersKey },
      });

      // 地图点击事件，打印坐标
      // temp.addFast('clickPoint');
      // temp.map.on('click', (e) => {
      //   temp.addFeature('clickPoint', temp.initFeature('','Point','',e.coordinate))
      //   console.log(e.coordinate);
      // });
    }
  }, [mapLayerMenu]);

  return <div id="MapFrame" style={{ ...style, width: '100%', height: '100%' }} />;
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapOpenLayer);
