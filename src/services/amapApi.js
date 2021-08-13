import request from '@/utils/request';

export async function getLocation(params) {
  return request('/amap/geocode/geo?key=e9f322f280b8a7135d43f02c4c315250', {
    method: 'GET',
    params,
  });
}

export async function getQueryData(params) {
  return request('/amap/assistant/inputtips?key=e9f322f280b8a7135d43f02c4c315250', {
    method: 'GET',
    params,
  });
}
