import React, { useEffect } from 'react';
import { connect } from 'umi';
import img from '@/assets/geography.png';
import CesiumMap from '@/utils/CesiumMap/CesiumMap';

const MapCesium = (props) => {
  const { basicMapStore, dispatch, style } = props;
  const { viewerMap } = basicMapStore;
  useEffect(() => {
    const viewer = new CesiumMap(
      'MapBox',
      {},
      {
        geocoder: true, // 是否显示地名查找控件
        baseLayerPicker: true, // 是否显示图层选择控件
        navigationHelpButton: true, // 是否显示帮助信息控件
        creditContainer: 'credit',
      },
    );

    dispatch({ type: 'basicMapStore/setState', payload: { viewerMap: viewer } });
  }, []);
  return (
    <div id="MapBox" style={{ ...style, width: '100%', height: '100%' }}>
      {/* 下面的div 可以将版权注释掉 */}
      <div id="credit"></div>
    </div>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapCesium);
