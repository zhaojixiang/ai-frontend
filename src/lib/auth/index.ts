import Cookies from 'js-cookie';
import qs from 'query-string';

import { getClassIdsByLinkCode } from '@/services/api';
import { AUTH_SIGN_URL } from '@/services/config';

import type { AuthorizeType } from './index.d';

const IS_NEW_ACCOUNT_AUTH = 'dubbleAccountLogin';

/**
 * 获取授权页面地址
 * @param {AuthorizeType} param0 - 授权参数
 * @returns {string} - 授权页面地址
 */
export async function toAuthrize({
  appId,
  mode,
  wechatAuthType,
  authBizType,
  requestUrl
}: AuthorizeType) {
  const url = requestUrl || window.location.href;
  const classIds = await _getClassIdsByLinkCode();

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
 * 是否普通登录
 */
export const isLogin = (): boolean => {
  return !!Cookies.get('authToken') || JOJO.Os.debug;
};

/**
 * 检测是否是双账号登录
 * @returns {boolean}
 */
export function isDoubleAccountLogin() {
  // 普通登录token
  const authToken = isLogin();
  // 双账号登录标识
  const isNewAccountAuth = Cookies.get(IS_NEW_ACCOUNT_AUTH);
  // 在微信浏览器环境内，已登录非新授权，唤起新授权
  if (JOJO.Os.wechatBrowser && authToken && isNewAccountAuth === 'yes') {
    return true;
  }
  return false;
}

/**
 * 是否需要唤起新授权
 * @returns {boolean}
 */
export function needNewAuth() {
  if (JOJO.Os.wechatBrowser) {
    if (isDoubleAccountLogin()) {
      setTimeout(async () => {
        const redirectUrl = await toAuthrize({
          mode: 1,
          authBizType: 3
        });
        window.location.replace(redirectUrl);
      }, 100);
      return true;
    }
    return false;
  }
  return false;
}

/**
 * 根据linkCode获取班期id
 * @param linkCode
 * @returns
 */
export const _getClassIdsByLinkCode = async () => {
  const params = new URLSearchParams(window.location.search);
  const linkCode = params.get('linkCode'); // 获取参数 linkCode 的值
  const activityId = params.get('activityId'); // 获取参数 activityId 的值

  let classIdStr = '';
  // 仅微信浏览器环境，促销链路需要获取班期id
  if (JOJO.Os.wechatBrowser && (linkCode?.startsWith('NL') || activityId?.startsWith('B'))) {
    try {
      const res = await getClassIdsByLinkCode({ linkCode: linkCode || activityId || '' });
      const classIds = res?.data?.map((item: any) => item?.id) || [];

      classIdStr = classIds?.length ? String(classIds) : '';
    } catch (error) {
      console.error(error);
    }
  }
  return classIdStr;
};
