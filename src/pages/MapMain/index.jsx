import React, { useEffect } from 'react';
import { connect } from 'umi';

import MapHeader from '@/pages/MapHeader';
import MapView from '@/pages/MapView';
import MapControl from '@/pages/MapControl';

const MapMain = () => {
  return (
    <>
      <MapHeader />
      <MapView />
      <MapControl />
    </>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapMain);
