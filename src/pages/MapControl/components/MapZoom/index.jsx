import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { PlusOutlined, MinusOutlined } from '@ant-design/icons';
// import * as Cesium from 'cesium';

const MapZoom = (props) => {
  const { basicMapStore, dispatch } = props;
  const { basicMap, body } = basicMapStore;
  // const { viewer } = cesiumLayers;

  // const zoom3D = (opt) => {
  //   // 获取当前镜头位置的笛卡尔坐标
  //   const cameraPos = viewer.camera.position;
  //   // 获取当前坐标系标准
  //   const { ellipsoid } = viewer.scene.globe;
  //   // 根据坐标系标准，将笛卡尔坐标转换为地理坐标
  //   const cartographic = ellipsoid.cartesianToCartographic(cameraPos);
  //   // 获取镜头的高度
  //   const { height } = cartographic;
  //   // 根据上面当前镜头的位置，获取该中心位置的经纬度坐标
  //   const centerLon = parseFloat(Cesium.Math.toDegrees(cartographic.longitude).toFixed(8));
  //   const centerLat = parseFloat(Cesium.Math.toDegrees(cartographic.latitude).toFixed(8));

  //   if (opt === 'plus' || opt === undefined) {
  //     viewer.camera.flyTo({
  //       destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height / 1.8),
  //       duration: 1.0,
  //     });
  //   }
  //   if (opt === 'minus') {
  //     viewer.camera.flyTo({
  //       destination: Cesium.Cartesian3.fromDegrees(centerLon, centerLat, height * 1.8),
  //       duration: 1.0,
  //     });
  //   }
  // };

  return (
    <div className={styles.zoomBox}>
      <div
        className={styles.zoomBtn}
        onClick={() => {
          // if (body === 'Map2D') {
          basicMap.zoomPlus();
          // }
          // if (body === 'Map3D') {
          //   zoom3D('plus');
          // }
        }}
      >
        <PlusOutlined style={{ color: '#fff', fontSize: '22px' }} />
      </div>
      <div
        className={styles.zoomBtn}
        onClick={() => {
          // if (body === 'Map2D') {
          basicMap.zoomMinus();
          // }
          // if (body === 'Map3D') {
          //   zoom3D('minus');
          // }
        }}
      >
        <MinusOutlined style={{ color: '#fff', fontSize: '22px' }} />
      </div>
    </div>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapZoom);
