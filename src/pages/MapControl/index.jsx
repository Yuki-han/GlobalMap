import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import MapChange from './components/MapChange';
import MapZoom from './components/MapZoom';

const MapControl = (props) => {
  const { basicMapStore, dispatch } = props;
  const { basicMap, body, down = false } = basicMapStore;
  const [mapModal, setMapModal] = useState('2D');

  const changeMapModal = () => {
    if (mapModal === '2D') {
      setMapModal('3D');
      dispatch({
        type: 'basicMapStore/setState',
        payload: { body: 'Map3D' },
      });
    } else {
      setMapModal('2D');
      dispatch({
        type: 'basicMapStore/setState',
        payload: { body: 'Map2D' },
      });
    }
  };

  return (
    <div className={styles.mapControl} style={down ? { bottom: '240px' } : { bottom: '60px' }}>
      <div className={styles.conBtn} onClick={() => changeMapModal()}>
        {mapModal}
      </div>
      <MapChange />
      <MapZoom />
    </div>
  );
};

export default connect(({ basicMapStore, cesiumLayers }) => ({ basicMapStore, cesiumLayers }))(
  MapControl,
);
