
<script setup lang="ts">
import { getToken } from '../services/authService';
import { useRouter } from 'vue-router';

const token = getToken();
const email = localStorage.getItem('user_email') || '';
const router = useRouter();

function logout() {
  localStorage.removeItem('user_email');
  localStorage.removeItem('token');
  router.push('/');
}
</script>

<template>
  <div class="form-container">
    <h2>Bienvenido</h2>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Token:</strong></p>
    <pre class="token-box">{{ token }}</pre>
    <button @click="logout">Logout</button>
  </div>
</template>

<style scoped>
.form-container {
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
button {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  margin-top: 24px;
  display: block;
  width: 100%;
}
button:hover {
  background: #1d4ed8;
}
.token-box {
  background: #e5e7eb;
  border-radius: 8px;
  padding: 12px;
  font-size: 14px;
  word-break: break-all;
  white-space: pre-wrap;
  margin-bottom: 16px;
}
p {
  text-align: left;
  color: #2563eb;
  font-weight: 500;
  margin-top: 12px;
}
</style>
