/**
 * 获取
 */
export const getDetail = (params: { linkCode: string }) =>
  JOJO.request(params, {
    url: '/product/queryDetail'
  });
