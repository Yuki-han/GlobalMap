import React, { useEffect } from 'react';
import styles from './index.less';
import { connect } from 'umi';

import OlMap from '@/utils/OlMap/OlMap';
import OlMapUtil from '@/utils/OlMap/OlMapUtil';

const MapView = (props) => {
  const { dispatch, basicMapStore } = props;
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

      const initMapLayers = OlMapUtil.FixCustomInitMapLayers(Layers, 'Bing');
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

  return (
    <div className={styles.mapViewBox}>
      <div className={styles.background}>请耐心等待 or 刷新页面 ...</div>
      <div id="MapFrame" className={styles.mapFrame} />
    </div>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapView);
