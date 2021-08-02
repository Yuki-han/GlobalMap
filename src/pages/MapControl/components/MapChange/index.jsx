import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { GlobalOutlined } from '@ant-design/icons';
import { Popover } from 'antd';

import layerMap from './assets/layerMap.png';
import layerBing from './assets/layerBing.png';

const MapChange = (props) => {
  const { basicMapStore, dispatch } = props;
  const { basicMap, mapLayerMenu, MapLayer } = basicMapStore;
  const [hide, setHide] = useState(true);
  const [select, setSelect] = useState(undefined);

  useEffect(() => {
    setSelect('GIS');
  }, []);

  const selectBaseMap = (key) => {
    dispatch({
      type: 'basicMapStore/setState',
      payload: { MapLayer: key },
    });
    if (basicMap) {
      basicMap.changeMapLayer('Empty');
      basicMap.changeMapLayer(key);
      dispatch({
        type: 'cesiumLayers/setState',
        payload: { clickInfo: undefined, hoverInfo: undefined },
      });
    }
  };

  const mapList = [
    { name: 'GIS地图', img: layerMap, key: 'GIS', menu: mapLayerMenu[0] },
    { name: '卫星影像', img: layerBing, key: 'MAP', menu: mapLayerMenu[1] },
  ];

  const mapMenuContent = (list) => {
    return (
      <div className={styles.mapBase}>
        {list?.children.map((item) => (
          <p
            onClick={() => selectBaseMap(item.layerKey)}
            key={item.layerKey}
            style={item.layerKey === MapLayer ? { color: '#4fafe3' } : { color: '#fff' }}
          >
            {item.title}
          </p>
        ))}
      </div>
    );
  };

  return (
    <div className={styles.switchBox}>
      <div
        className={styles.switchBtn}
        onClick={() => {
          setHide(!hide);
        }}
      >
        <GlobalOutlined style={{ color: '#fff', fontSize: '22px' }} />
      </div>
      <div className={styles.mapOptions} style={{ display: hide ? 'none' : 'flex' }}>
        {mapList.map((item) => (
          <>
            {select === item.key ? mapMenuContent(item.menu) : undefined}
            <div
              key={item.name}
              className={styles.optItem}
              onClick={() => setSelect(item.key)}
              // style={{ border: select === item.key ? '1px solid #4fafe3' : '1px solid #474a4f' }}
            >
              <img src={item.img} alt={item.name} />
              <p>{item.name}</p>
            </div>
          </>
        ))}
        {}
      </div>
    </div>
  );
};

export default connect(({ basicMapStore }) => ({
  basicMapStore,
}))(MapChange);
