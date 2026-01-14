import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL
});

export async function register(email: string, password: string): Promise<boolean> {
  try {
    const res = await api.post('/api/auth/register', { email, password });
    return res.status === 200;
  } catch (error) {
    console.error('Register error:', error);
    return false;
  }
}
