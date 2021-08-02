import React from 'react';
import { Row, Col } from 'antd';
import styles from './index.less';
import logo from '@/assets/geography.png';

const MapHeader = () => {
  return (
    <Row className={styles.headerBox}>
      <Col span={10} className={styles.logoCol}>
        <div className={styles.logo}>
          <img src={logo} alt="Global_Map" />
        </div>
        <div className={styles.title}>
          <span>Global Map</span>
        </div>
      </Col>
    </Row>
  );
};
export default MapHeader;
