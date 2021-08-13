import { getMapLayerMenu } from '@/services/mapApi';
import { getLocation, getQueryData } from '@/services/amapApi';
import forEachTree from '@/utils/forEachTree';

const Model = {
  namespace: 'basicMapStore',
  state: {
    basicMap: undefined, // 2D地图对象
    viewerMap: undefined, // 3D地图对象
    mapModel: '2D',
    mapLayerMenu: [], // 渲染地图图层
    MapLayer: 'Bing', // 当前地图图层
  },
  effects: {
    *getMapLayerMenu(_, { call, put }) {
      const respone = yield call(getMapLayerMenu);
      if (respone.retCode === 200) {
        yield put({
          type: 'setState',
          payload: {
            mapLayerMenu: forEachTree(respone.mapLayerMenu, (item) => ({
              ...item,
            })),
          },
        });
      }
    },
    // 高德数据
    *getLocation({ payload }, { call, select }) {
      const basicMap = yield select((state) => state.basicMapStore.basicMap);
      const response = yield call(getLocation, payload);
      if (response.status === '1') {
        const location = response.geocodes[0].location.split(',');
        if (basicMap) {
          basicMap.setCenter(location);
          basicMap.setZoom(16);
        }
      }
    },
    // 高德数据
    *getQueryData({ payload }, { call, put }) {
      const response = yield call(getQueryData, payload);
      if (response.status === '1') {
        const tips = response.tips.map((item) => {
          return {
            name: item.name,
            district: item.district,
            location: item.location,
          };
        });
        yield put({
          type: 'setState',
          payload: { queryData: tips },
        });
      }
    },
  },
  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;
