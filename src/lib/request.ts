import axios from 'axios';
import { Sentry } from '@woulsl/sentry-config';

import base, { DEBUG_HEADER_INFO } from '../config/base';
import { toAuthrize } from './auth/index';

const { MALL_BASE_URL } = base;

class CustomError extends Error {
	constructor({ name = '', message = '' }) {
		super();
		this.name = name || 'customError';
		this.message = message || 'customErrorMessage';
	}
}

// 创建 axios 实例
const axiosInstance = axios.create({
	baseURL: MALL_BASE_URL,
	timeout: 30000, // 超时时间
	headers: {},
	withCredentials: true, // 携带 cookie
	responseType: 'json' // 响应数据类型
});

// 鉴权状态
let jumpAuthStatus = false;

/**
 * 处理请求错误
 * @param {Error} error - 错误对象
 * @param {string} api - 请求的 API
 * @param {Object} params - 请求参数
 */
const handleRequestError = (error: Error, api: string, params: any) => {
	console.error('请求错误:', error);
	Sentry.captureException(error, {
		level: 'error',
		extra: {
			fetch: api,
			params,
			error: error
		}
	});
	throw error; // 抛出错误，由调用方处理
};

/**
 * 处理响应数据
 * @param {Object} response - 响应数据
 * @param {string} api - 请求的 API
 * @param {Object} params - 请求参数
 */
const handleResponse = (response: any) => {
	const { data } = response;
	const { status } = data || {};
	// 未登录
	if ([1001, 1005].includes(status) && !jumpAuthStatus) {
		jumpAuthStatus = true;
		const isCorssTenant =
			(JOJO.os.jojoReadApp && JOJO.os.jojoupH5) || (JOJO.os.jojoupApp && JOJO.os.jojoH5);
		// app中 && 非跨租户售卖：跳转原生页
		if (JOJO?.os?.app && !isCorssTenant) {
			JOJO.Utils.jojoAppDirectLogin('', () => {
				jumpAuthStatus = false;
			});
			return data;
		}
		const authUrl = toAuthrize({
			appId: data.authWechatAppId,
			mode: 1,
			authBizType: 3
		});
		jumpAuthStatus = false;
		window.location.replace(authUrl);
		return data;
	}

	// 需要重新获取openId
	if ([1002].includes(status)) {
		const authUrl = toAuthrize({
			appId: data.authWechatAppId,
			mode: 3,
			wechatAuthType: 2
		});
		window.location.replace(authUrl);
	}

	if (response.status === 200) {
		return data;
	}

	return {};
};

/**
 * 发起请求
 * @param {string} api - 请求的 API
 * @param {Object} params - 请求参数
 * @param {Object} options - 请求配置
 */
export default async function request(api: string, params: any = {}, options: any = {}) {
	const headers = {
		...(JOJO.os.jojoupH5 ? { 'TM-UserAgent-appAlias': 'flawless' } : {}),
		...(DEBUG_HEADER_INFO || {}),
		...options.headers
	};

	const config = {
		...options,
		headers
	};

	try {
		const response = await axiosInstance({
			method: options.method || 'get',
			url: api,
			data: params,
			...config
		});
		return handleResponse(response);
	} catch (error) {
		handleRequestError(error as Error, api, params);
	}
}
