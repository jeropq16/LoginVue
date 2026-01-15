<script setup lang="ts">
import { ref } from 'vue';
import { login, register } from './services/authService';
import { useRouter } from 'vue-router';


const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

async function Login() {
  try {
    const token = await login(email.value, password.value);
    if (token) {
      message.value = 'Login exitoso. Token guardado.';
      localStorage.setItem('user_email', email.value);
      router.push('/dashboard');
    } else {
      message.value = 'Login falló';
    }
  } catch {
    message.value = 'Error en login';
  }
}

async function Register() {
  try {
    const ok = await register(email.value, password.value);
    message.value = ok ? 'Registro exitoso.' : 'Registro falló';
  } catch {
    message.value = 'Error en register';
  }
}
</script>

<template>
<router-view />
</template>

<style scoped>
div {
  background: #f8fafc;
  border-radius: 16px;
  box-shadow: 0 4px 24px rgba(0,0,0,0.08);
  padding: 40px;
  max-width: 400px;
  margin: 40px auto;
  font-family: 'Segoe UI', Arial, sans-serif;
}
h2 {
  text-align: center;
  color: #2563eb;
  margin-bottom: 32px;
}
input {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 12px;
  box-sizing: border-box;
  transition: border-color 0.2s;
}
input:focus {
  border-color: #2563eb;
  outline: none;
}
button {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
}
button:hover {
  background: #1d4ed8;
}
p {
  text-align: center;
  color: #dc2626;
  font-weight: 500;
  margin-top: 24px;
}
</style>
