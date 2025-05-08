import axios, { AxiosRequestConfig, AxiosResponse } from 'axios';
import { Toast } from 'antd-mobile';
import { whiteList } from './config';
import { isLogin } from '../auth';

const BASE_URL = '/api';
const TIMEOUT = 10000;

const instance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    // 未登录拦截
    if (!isLogin() && !whiteList.includes(config.url || '')) {
      Toast.show({ icon: 'fail', content: '请先登录' });
      return Promise.reject(new Error('未登录或登录已过期'));
    }

    return config;
  },
  (error) => {
    Toast.show({ icon: 'fail', content: '请求发送失败' });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  (response: AxiosResponse) => {
    const { code, data, message } = response.data;

    if (code === 0) {
      return data;
    }
    // 未登录
    if ([1001, 1005].includes(code)) {
      const currentPath = encodeURIComponent(window.location.pathname + window.location.search);
      Toast.show({ icon: 'fail', content: '请先登录' });
      setTimeout(() => {
        if (JOJO?.os?.app) {
          JOJO.Utils.jojoAppDirectLogin('');
          return data;
        }
        window.location.href = `/login?redirect=${currentPath}`;
      }, 800);
      return Promise.reject(new Error('未登录或登录已过期'));
    }

    Toast.show({ icon: 'fail', content: message || '请求出错' });
    return Promise.reject(new Error(message || '请求失败'));
  },
  (error) => {
    Toast.show({ icon: 'fail', content: error.message || '网络错误' });
    return Promise.reject(error);
  }
);

const request = <T = any>(config: AxiosRequestConfig): Promise<T> => {
  return instance(config);
};

export default request;
