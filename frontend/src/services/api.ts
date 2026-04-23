import axios, { type AxiosRequestConfig } from 'axios';
console.log( import.meta.env.VITE_API_URL)
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const get = async (route: string, headers?: AxiosRequestConfig['headers']) => {
  const config: AxiosRequestConfig = {};
  if (headers) config.headers = headers;
  const response = await api.get(route, config);
  return response.data;
};

export const post = async (
  route: string,
  payload: unknown,
  headers?: AxiosRequestConfig['headers']
) => {
  const config: AxiosRequestConfig = {};
  if (headers) config.headers = headers;
  const response = await api.post(route, payload, config);
  return response.data;
};

export const put = async (
  route: string,
  payload: unknown,
  headers?: AxiosRequestConfig['headers']
) => {
  const config: AxiosRequestConfig = {};
  if (headers) config.headers = headers;
  const response = await api.put(route, payload, config);
  return response.data;
};

export const patch = async (
  route: string,
  payload: unknown,
  headers?: AxiosRequestConfig['headers']
) => {
  const config: AxiosRequestConfig = {};
  if (headers) config.headers = headers;
  const response = await api.patch(route, payload, config);
  return response.data;
};

export const del = async (
  route: string,
  payload: unknown,
  headers?: AxiosRequestConfig['headers']
) => {
  const config: AxiosRequestConfig = {};
  if (headers) config.headers = headers;
  const response = await api.delete(route, { ...config, data: payload });
  return response.data;
};