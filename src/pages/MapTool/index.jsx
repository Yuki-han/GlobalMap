import React, { useEffect, useState } from 'react';
import styles from './index.less';
import { connect } from 'umi';
import { Popover } from 'antd';
import { ClearOutlined, ColumnWidthOutlined, EditOutlined, AimOutlined } from '@ant-design/icons';
import OlMapUtil from '@/utils/OlMap/OlMapUtil';
import { Style, Circle, Text, Fill, Stroke } from 'ol/style';

const MapTool = (props) => {
  const { basicMapStore } = props;
  const { basicMap } = basicMapStore;
  const [active, setActive] = useState(undefined);

  useEffect(() => {
    if (basicMap) {
      // 初始化 pointLayer 图层及其上面的资源
      basicMap.initDraw(
        'pointDraw',
        'Point',
        {
          style: new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#6495ED',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          }),
        },
        {
          style: new Style({
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#6495ED',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          }),
          zIndex: 99,
        },
      );
      basicMap.initDraw(
        'lineDraw',
        'LineString',
        {
          style: new Style({
            stroke: new Stroke({
              color: '#6495ED',
              width: 4,
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#6495ED',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          }),
        },
        {
          style: new Style({
            stroke: new Stroke({
              color: '#6495ED',
              width: 2,
            }),
          }),
          zIndex: 99,
        },
      );
      basicMap.initDraw(
        'polygon',
        'Polygon',
        {
          style: new Style({
            fill: new Fill({
              color: 'rgba(100, 149, 237, 0.4)',
            }),
            stroke: new Stroke({
              color: '#6495ED',
              width: 4,
            }),
            image: new Circle({
              radius: 7,
              fill: new Fill({
                color: '#6495ED',
              }),
              stroke: new Stroke({
                color: '#fff',
                width: 2,
              }),
            }),
          }),
        },
        {
          style: new Style({
            fill: new Fill({
              color: 'rgba(100, 149, 237, 0.4)',
            }),
            stroke: new Stroke({
              color: '#6495ED',
              width: 2,
            }),
          }),
          zIndex: 99,
        },
      );
      basicMap
        .initDraw(
          'lineDistance',
          'LineString',
          {
            style: new Style({
              fill: new Fill({
                color: 'rgba(255, 255, 255, 0.2)',
              }),
              stroke: new Stroke({
                color: '#FFA500',
                width: 4,
              }),
              image: new Circle({
                radius: 7,
                fill: new Fill({
                  color: '#FFA500',
                }),
                stroke: new Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
            }),
          },
          {
            style: new Style({
              stroke: new Stroke({
                color: '#FFA500',
                width: 2,
              }),
            }),
            zIndex: 99,
          },
        )
        .on('drawend', (e) => {
          const distance = OlMapUtil.formatLength(e.feature.getGeometry());
          const coordinate = e.feature.getGeometry().getCoordinates();
          const initVal = basicMap.initFeature(
            '',
            'Point',
            new Style({
              image: new Circle({
                fill: new Fill({ color: 'rgba(255, 206, 0,0.5)' }),
                // 圆形半径
                radius: 4,
              }),
              text: new Text({
                // 文字样式
                font: 'bold 14px 微软雅黑',
                // 文本内容
                text: `${distance}`,
                // 文字颜色
                fill: new Fill({ color: '#FFA500' }),
                stroke: new Stroke({ color: '#fff', width: 4 }),
              }),
            }),
            coordinate[coordinate.length - 1],
          );
          basicMap.addFeature('lineDistance', initVal);
        });
      basicMap
        .initDraw(
          'polygonArea',
          'Polygon',
          {
            style: new Style({
              fill: new Fill({
                color: 'rgba(255,165,0, 0.2)',
              }),
              stroke: new Stroke({
                color: '#FFA500',
                width: 4,
              }),
              image: new Circle({
                radius: 7,
                fill: new Fill({
                  color: '#FFA500',
                }),
                stroke: new Stroke({
                  color: '#fff',
                  width: 2,
                }),
              }),
            }),
          },
          {
            style: new Style({
              fill: new Fill({
                color: 'rgba(255,165,0, 0.2)',
              }),
              stroke: new Stroke({
                color: '#FFA500',
                width: 2,
              }),
            }),
            zIndex: 99,
          },
        )
        .on('drawend', (e) => {
          const area = OlMapUtil.formatArea(e.feature.getGeometry());
          // eslint-disable-next-line no-underscore-dangle
          const coordinate = e.feature.getGeometry().extent_;
          const centerPoint = [
            (coordinate[0] + coordinate[2]) / 2,
            (coordinate[1] + coordinate[3]) / 2,
          ];
          const initVal = basicMap.initFeature(
            '',
            'Point',
            new Style({
              text: new Text({
                font: 'bold 14px 微软雅黑',
                text: `${area}`,
                fill: new Fill({ color: '#FFA500' }),
                stroke: new Stroke({ color: '#fff', width: 4 }),
              }),
            }),
            centerPoint,
          );
          basicMap.addFeature('polygonArea', initVal);
        });
    }
  }, [basicMap]);

  const ActionE = {
    0: 'pointDraw', // 标点
    1: 'lineDraw', // 标线
    2: 'polygon', // 表面
    3: 'lineDistance', // 测距离
    4: 'polygonArea', // 测面积
  };
  const ClickToolFunc = {
    // 定位
    0: () => {
      basicMap.fit([73, 15, 135, 54]);
    },
    // 清理
    3: () => {
      Object.keys(ActionE).map((key) => {
        basicMap.clearDraw(ActionE[key]);
      });
    },
  };

  // 点击工具栏
  const handleClickTool = (toolId) => {
    if (basicMap) {
      basicMap.stopDraw(ActionE[active]);
    }
    setActive(undefined);
    if (ClickToolFunc[toolId]) {
      ClickToolFunc[toolId]();
    }
  };

  // 标注工具
  const handleUseTool = (markId) => {
    if (basicMap) {
      basicMap.stopDraw(ActionE[active]);
      // setActive(markId === active ? undefined : markId);
      // if (markId !== active) basicMap.startDraw(ActionE[markId]);
      setActive(markId);
      basicMap.startDraw(ActionE[markId]);
    }
  };

  const markTool = () => (
    <div className={styles.markTool}>
      <p onClick={() => handleUseTool(0)} style={{ color: '#fff' }}>
        标点
      </p>
      <p onClick={() => handleUseTool(1)} style={{ color: '#fff' }}>
        标线
      </p>
      <p onClick={() => handleUseTool(2)} style={{ color: '#fff' }}>
        标面
      </p>
    </div>
  );

  const measureTool = () => (
    <div className={styles.markTool}>
      <p onClick={() => handleUseTool(3)} style={{ color: '#fff' }}>
        测距离
      </p>
      <p onClick={() => handleUseTool(4)} style={{ color: '#fff' }}>
        测面积
      </p>
    </div>
  );

  const renderToolList = [
    {
      id: '0',
      icon: <AimOutlined style={{ fontSize: '20px' }} />,
      name: '定位',
    },
    {
      id: '1',
      icon: <EditOutlined style={{ fontSize: '20px' }} />,
      content: markTool(active),
      name: '标注',
    },
    {
      id: '2',
      icon: <ColumnWidthOutlined style={{ fontSize: '20px' }} />,
      content: measureTool(active),
      name: '测量',
    },
    {
      id: '3',
      icon: <ClearOutlined style={{ color: '#fff', fontSize: '20px' }} />,
      name: '清理',
    },
  ];

  return (
    <>
      <div className={styles.toolBar}>
        {renderToolList.map((item) =>
          item.content ? (
            <Popover
              trigger="click"
              placement="right"
              key={item.name}
              className={styles.toolList}
              content={item.content}
            >
              <div onClick={() => handleClickTool(item.id)} className={styles.toolItem}>
                {item.icon}
                <p>{item.name}</p>
              </div>
            </Popover>
          ) : (
            <div
              onClick={() => handleClickTool(item.id)}
              className={styles.toolItem}
              key={item.name}
            >
              {item.icon}
              <p>{item.name}</p>
            </div>
          ),
        )}
      </div>
    </>
  );
};

export default connect(({ basicMapStore }) => ({ basicMapStore }))(MapTool);
