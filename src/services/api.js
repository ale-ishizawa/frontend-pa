import axios from 'axios';
import { isTokenExpired, getToken } from './auth';

const defaultTimeout = 15000;
const BACK_END_URL = process.env.BACK_END_URL ?? 'http://localhost:3333';

const api = axios.create({
  baseURL: BACK_END_URL,
  timeout: defaultTimeout
});

api.interceptors.request.use(async (config) => {
  const token = getToken();
  if (token && config.url !== 'login') {
    if (isTokenExpired(token)) {
      document.location.href = '/';
    }
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;

export { api };
