import axios from 'axios';

const defaultTimeout = 10000;
const BACK_END_URL = process.env.BACK_END_URL ?? 'http://localhost:3333';

const api = axios.create({
  baseURL: BACK_END_URL,
  timeout: defaultTimeout
});

// api.interceptors.request.use(async config => {

// })

export default api;
