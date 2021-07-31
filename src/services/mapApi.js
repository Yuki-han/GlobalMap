import request from '@/utils/request';

export async function getMapLayerMenu() {
  return request('/api/mapLayerMenu', { method: 'GET' });
}
