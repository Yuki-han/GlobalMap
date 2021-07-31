/**
 * 根据相对路径拼接真是http请求
 */
export default (path) => {
  const res =
    path.replace(/\\/g, '/')[0] === '/' ? path.replace(/\\/g, '/') : `/${path.replace(/\\/g, '/')}`;
  return `${window.location.origin}/mv/res${res}`;
};
