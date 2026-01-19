/// <reference types="vite/client" />

import axios from 'axios';

export const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

const TOKEN_NAME = 'auth_token';

export async function login(email: string, password: string): Promise<any> {
  try {
    const res = await api.post('/api/auth/login', null, {
      params: { email, password }
    });
    if (res.status === 200 && res.data.token) {
      localStorage.setItem(TOKEN_NAME, res.data.token);
      return { token: res.data.token, role: res.data.role };
    }
    return null;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }
    return null;
  }
}

export function getToken(): string | null {
  return localStorage.getItem(TOKEN_NAME);
}

export async function register(email: string, password: string): Promise<boolean> {
  try {
    const res = await api.post('/api/auth/register', { email, password });
    return res.status === 200;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error(error.response.data);
    } else {
      console.error(error);
    }
    return false;
  }
}

export function logout() {
  localStorage.removeItem(TOKEN_NAME);
}

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    config.headers = Object.assign({}, config.headers);
    config.headers['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
