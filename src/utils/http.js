// src/utils/http.js
import axios from 'axios';

const HTTP_METHOD = {
  GET: 'GET',
  POST: 'POST',
  POST_JSON: 'POST_JSON',
  POST_FORMDATA: 'POST_FORMDATA',
  DELETE: 'DELETE',
  PUT: 'PUT',
};

// 默认配置
const DEFAULT_HTTP_CONFIG = {
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
  timeout: 600000,
};

class Http {
  constructor(config) {
    const opt = config || DEFAULT_HTTP_CONFIG;
    this.client = axios.create(opt);

    // 请求拦截器：如果本地有 token，就带上（可选）
    this.client.interceptors.request.use(
      (config) => {
        const token = window.localStorage.getItem('token');
        if (token) {
          config.headers = config.headers || {};
          config.headers['token'] = token;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    // 响应拦截器：统一返回 data，错误直接抛出去
    this.client.interceptors.response.use(
      (response) => response,
      (error) => {
        // 这里不做跳转处理，直接把 error.response 或 error 往外抛
        return Promise.reject(error.response || error);
      }
    );
  }

  // 格式化请求配置
  _formatOptions(method, options = {}) {
    const opt = { ...options };
    // 清理 data 里为 undefined 的字段
    if (typeof opt.data === 'object' && !(opt.data instanceof FormData)) {
      const newData = {};
      Object.keys(opt.data).forEach((key) => {
        if (opt.data[key] !== undefined) {
          newData[key] = opt.data[key];
        }
      });
      opt.data = newData;
    }

    if (typeof opt.headers !== 'object') {
      opt.headers = {};
    }

    switch (method) {
      case HTTP_METHOD.GET:
        opt.method = 'GET';
        if (opt.data) {
          opt.params = opt.data;
          opt.paramsSerializer = {
            serialize: (params) =>
              Object.keys(params)
                .map((k) => `${k}=${encodeURIComponent(params[k])}`)
                .join('&'),
          };
          delete opt.data;
        }
        break;

      case HTTP_METHOD.POST:
        opt.method = 'POST';
        opt.headers['content-type'] = 'application/x-www-form-urlencoded';
        opt.data = Object.keys(opt.data || {})
          .map((key) => `${key}=${encodeURIComponent(opt.data[key])}`)
          .join('&');
        break;

      case HTTP_METHOD.POST_JSON:
        opt.method = 'POST';
        opt.headers['content-type'] = 'application/json';
        opt.data = typeof opt.data === 'string' ? opt.data : JSON.stringify(opt.data || {});
        break;

      case HTTP_METHOD.POST_FORMDATA:
        opt.method = 'POST';
        opt.headers['content-type'] = 'multipart/form-data';
        break;

      case HTTP_METHOD.DELETE:
      case HTTP_METHOD.PUT:
        opt.method = method.toLowerCase();
        opt.headers['content-type'] = 'application/json';
        if (opt.data && typeof opt.data !== 'string') {
          opt.data = JSON.stringify(opt.data);
        }
        break;

      default:
        throw new Error('Invalid HTTP method');
    }

    return opt;
  }

  // 统一处理响应：拿到 data，同时挂上 __status
  _handler(response) {
    const data = response?.data ?? {};
    data.__status = response?.status;
    return data;
  }

  get(options) {
    const opt = this._formatOptions(HTTP_METHOD.GET, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }

  post(options) {
    const opt = this._formatOptions(HTTP_METHOD.POST, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }

  postJSON(options) {
    const opt = this._formatOptions(HTTP_METHOD.POST_JSON, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }

  postFormData(options) {
    const opt = this._formatOptions(HTTP_METHOD.POST_FORMDATA, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }

  delete(options) {
    const opt = this._formatOptions(HTTP_METHOD.DELETE, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }

  put(options) {
    const opt = this._formatOptions(HTTP_METHOD.PUT, options);
    return this.client.request(opt).then((res) => this._handler(res));
  }
}

// 默认导出一个全局单例
const http = new Http();
export default http;
