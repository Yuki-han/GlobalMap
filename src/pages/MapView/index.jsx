import React, { useEffect } from 'react';
import styles from './index.less';
import { connect } from 'umi';

import OlMapView from './components/OlMapView';
import CesiumMapView from './components/CesiumMapView';

const MapView = (props) => {
  const { dispatch, basicMapStore } = props;
  const { mapModel } = basicMapStore;

  const currentView = (
    <>
      <OlMapView style={{ display: mapModel === '2D' ? '' : 'none' }} />
      <CesiumMapView style={{ display: mapModel === '3D' ? '' : 'none' }} />
    </>
  );
  return (
    <div className={styles.mapViewBox}>
      <div className={styles.background}>请耐心等待 or 刷新页面 ...</div>
      {currentView}
    </div>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapView);
