/// <reference types="vite/client" />

import axios from 'axios';
import type { AuthToken } from '../models/AuthToken';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});


const TOKEN_NAME = 'auth_token';

export async function login(email: string, password: string): Promise<string | null> {
  try {
    const res = await api.post<AuthToken>('/api/auth/login', null, {
      params: { email, password }
    });
    if (res.status === 200 && res.data.token) {
      localStorage.setItem(TOKEN_NAME, res.data.token);
      return res.data.token;
    }
    return null;
  } catch (error: any) {
    if (error.response && error.response.data) {
      console.error('Login error:', error.response.data);
    } else {
      console.error('Login error:', error);
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
      console.error('Register error:', error.response.data);
    } else {
      console.error('Register error:', error);
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
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});
