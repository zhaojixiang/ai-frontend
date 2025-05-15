import type { AuthorizeType } from './index.d';
import { AUTH_SIGN_URL } from '@/services/config';
import Cookies from 'js-cookie';
import qs from 'query-string';

/**
 * 获取授权页面地址
 * @param {AuthorizeType} param0 - 授权参数
 * @returns {string} - 授权页面地址
 */
export function toAuthrize({
  appId,
  mode,
  wechatAuthType,
  authBizType,
  requestUrl
}: AuthorizeType) {
  const url = requestUrl || window.location.href;
  const classIds = localStorage.getItem('classIdStr') || '';

  const queryParams = qs.stringify({
    mode,
    authWechatAppId: appId,
    wechatAuthType,
    authBizType,
    dubbleAccountLoginClassIds: classIds,
    requestUrl: encodeURIComponent(url)
  });

  return `${AUTH_SIGN_URL}?${queryParams}`;
}

/**
 * 是否登录
 */
export const isLogin = (): boolean => {
  return !!Cookies.get('authToken');
};
