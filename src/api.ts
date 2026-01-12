import axios from 'axios'

export const api = axios.create({
  baseURL: 'https://coursesplatform-backend.onrender.com'
})

export async function login(email: string, password: string) {
  const res = await api.post('/api/auth/login', null, {
    params: { email, password }
  })
  return res.status === 200
}

export async function register(email: string, password: string) {
  const res = await api.post('/api/auth/register', {
    email,
    password
  })
  return res.status === 200
}
