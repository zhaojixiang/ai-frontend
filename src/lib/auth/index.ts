import type { AuthorizeType } from '.';
import { AUTH_SIGN_URL } from '../../services/config';
export function toAuthrize({
	appId,
	mode,
	wechatAuthType,
	authBizType,
	requestUrl
}: AuthorizeType) {
	// 跳转参数拼接
	const url = requestUrl || window.location.href;
	// 重定向地址添加type类型
	const authWechatAppId = appId ? `authWechatAppId=${appId}&` : '';
	const modeStr = mode ? `mode=${mode}&` : '';
	const wechatAuthTypeStr = wechatAuthType ? `wechatAuthType=${wechatAuthType}&` : '';
	const authBizTypeStr = authBizType ? `authBizType=${authBizType}&` : '';
	// 获取班期id
	const classIds = localStorage.getItem('classIdStr') || '';
	const classIdStr = classIds ? `dubbleAccountLoginClassIds=${classIds}&` : '';

	const redirectUrl = [
		AUTH_SIGN_URL,
		'?',
		modeStr,
		authWechatAppId,
		wechatAuthTypeStr,
		authBizTypeStr,
		classIdStr,
		'requestUrl=',
		encodeURIComponent(url)
	].join('');
	return redirectUrl;
}
