import React, { useEffect } from 'react';
import { connect } from 'umi';

import MapView from '@/pages/MapView';
import MapControl from '@/pages/MapControl';

const MapMain = () => {
  return (
    <>
      <MapView />
      <MapControl />
    </>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapMain);
