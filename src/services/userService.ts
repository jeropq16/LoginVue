
import axios from 'axios';
import { getToken } from './authService';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || ''
});

api.interceptors.request.use(config => {
  const token = getToken();
  if (token) {
    (config.headers as any)['Authorization'] = `Bearer ${token}`;
  }
  return config;
});

export async function getUsers() {
  const res = await api.get('/api/users');
  return res.data;
}

export async function getUser(id: number) {
  const res = await api.get(`/api/users/${id}`);
  return res.data;
}

export async function updateUser(id: number, data: { email: string; password: string; role: number }) {
  // El backend espera Email, Password, Role
  const payload = {
    Email: data.email,
    Password: data.password,
    Role: data.role
  };
  const res = await api.put(`/api/users/${id}`, payload);
  return res.data;
}

export async function deleteUser(id: number) {
  const res = await api.delete(`/api/users/${id}`);
  return res.data;
}
