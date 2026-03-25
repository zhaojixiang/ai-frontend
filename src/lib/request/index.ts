import axios, { type AxiosInstance, type AxiosRequestConfig, type AxiosResponse } from 'axios';

import { toast } from '../index';

const TIMEOUT = 10000;

const apiBaseURL = import.meta.env.VITE_API_BASE_URL ?? '';

const instance: AxiosInstance = axios.create({
  baseURL: apiBaseURL,
  timeout: TIMEOUT,
  method: 'get'
  // withCredentials: true
});

// 请求拦截器
instance.interceptors.request.use(
  (config) => {
    return config;
  },
  (error) => {
    toast.show({ icon: 'fail', content: '请求发送失败' });
    return Promise.reject(error);
  }
);

// 响应拦截器
instance.interceptors.response.use(
  async (response: AxiosResponse) => {
    const { code } = response.data;

    // 当接口需求单独处理结果时，我们需要根据配置来判断后续的处理。
    if (response.config?.handleResultCode && code !== 200) {
      return response.data;
    }
    return response.data;
  },
  (error) => {
    toast.show({ icon: 'fail', content: error.message || '网络错误' });

    return Promise.reject(error);
  }
);

const request = <T = any>(
  url: string,
  dataOrParams?: any, // 第一个参数：接口所需的参数
  config: AxiosRequestConfig = {} // 第二个参数：其他配置
): Promise<T> => {
  // 根据请求方法决定将参数放在 data 还是 params
  const method = config.method?.toLowerCase() || 'get';
  const finalConfig: AxiosRequestConfig = {
    ...config,
    url,
    baseURL: config.baseURL ?? apiBaseURL,
    [method === 'get' ? 'params' : 'data']: dataOrParams
  };

  return instance(finalConfig) as Promise<T>;
};

export default request;
