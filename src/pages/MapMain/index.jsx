import React, { useEffect } from 'react';
import { connect } from 'umi';

// cesium配置 - 入口文件中配置
// 导入必须的样式表
import 'cesium/Source/Widgets/widgets.css';
// 我们刚才所说的如何让Cesium知道静态资源在哪里的API
import buildModuleUrl from 'cesium/Source/Core/buildModuleUrl';

import MapHeader from '@/pages/MapHeader';
import MapView from '@/pages/MapView';
import MapTool from '@/pages/MapTool';
import MapControl from '@/pages/MapControl';
import MapSearch from '@/pages/MapSearch';

// cesium配置 - 入口文件中配置
// 设置静态资源目录
buildModuleUrl.setBaseUrl('../cesium');

const MapMain = (props) => {
  const { basicMapStore } = props;
  const { mapModel } = basicMapStore;

  return (
    <>
      <MapHeader />
      <MapView />
      <MapTool />
      <MapControl />
      {mapModel === '2D' ? <MapSearch /> : <></>}
    </>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapMain);
