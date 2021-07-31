import { getMapLayerMenu } from '@/services/mapApi';
import forEachTree from '@/utils/forEachTree';

const Model = {
  namespace: 'basicMapStore',
  state: {
    basicMap: undefined, // 地图对象
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
  },
  reducers: {
    setState(state, { payload }) {
      return { ...state, ...payload };
    },
  },
};
export default Model;