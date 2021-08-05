import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import MapChange from './components/MapChange';
import MapZoom from './components/MapZoom';

const MapControl = (props) => {
  const { basicMapStore, dispatch } = props;
  const { mapModel } = basicMapStore;

  // const changeMapModal = () => {
  //   if (mapModel === '2D') {
  //     dispatch({
  //       type: 'basicMapStore/setState',
  //       payload: { mapModel: '3D' },
  //     });
  //   } else {
  //     dispatch({
  //       type: 'basicMapStore/setState',
  //       payload: { mapModel: '2D' },
  //     });
  //   }
  // };

  return (
    <div className={styles.mapControl}>
      <MapZoom />
      {/* <div className={styles.conBtn} onClick={() => changeMapModal()}>
        {mapModel}
      </div> */}
      <MapChange />
    </div>
  );
};

export default connect(({ basicMapStore, cesiumLayers }) => ({ basicMapStore, cesiumLayers }))(
  MapControl,
);
