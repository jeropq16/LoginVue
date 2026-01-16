<script setup lang="ts">
import { ref, onMounted } from 'vue';

import { getUsers } from '../services/userService';
import { logout as doLogout } from '../services/authService';
import { useRouter } from 'vue-router';

const users = ref<any[]>([]);
const router = useRouter();

onMounted(async () => {
  users.value = await getUsers();
});

function logout() {
  doLogout();
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  router.push('/');
}
</script>

<template>
  <div class="form-container">
    <h2>Bienvenido Usuario</h2>
    <p>Sesion de usuario</p>
    <div v-if="users.length">
      <h3 style="text-align:center;color:#2563eb;margin-top:24px;">Usuarios registrados</h3>
      <ul style="list-style:none;padding:0;">
        <li v-for="user in users" :key="user.Id" style="background:#e5e7eb;margin:8px 0;padding:10px;border-radius:8px;">
          <strong>Email:</strong> {{ user.email }}<br>
          <strong>Rol:</strong> {{ user.role }}
        </li>
      </ul>
    </div>
    <div v-else>
      <p>No hay usuarios registrados.</p>
    </div>
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
p {
  text-align: center;
  color: #2563eb;
  font-weight: 500;
  margin-top: 24px;
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
</style>
