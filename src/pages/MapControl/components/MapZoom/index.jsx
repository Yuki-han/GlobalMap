import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';

const MapZoom = (props) => {
  const { basicMapStore, dispatch } = props;
  const { basicMap, viewerMap, mapModel } = basicMapStore;

  return (
    <div className={styles.zoomBox}>
      <div
        className={styles.zoomBtn}
        onClick={() => {
          if (mapModel === '2D') {
            basicMap.zoomPlus();
          }
          if (mapModel === '3D') {
            viewerMap.zoomPlus();
          }
        }}
      >
        <PlusOutlined style={{ color: '#fff', fontSize: '22px' }} />
      </div>
      <div
        className={styles.zoomBtn}
        onClick={() => {
          if (mapModel === '2D') {
            basicMap.zoomMinus();
          }
          if (mapModel === '3D') {
            viewerMap.zoomMinus();
          }
        }}
      >
        <MinusOutlined style={{ color: '#fff', fontSize: '22px' }} />
      </div>
    </div>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapZoom);
