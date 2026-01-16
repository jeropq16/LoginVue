
<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getToken } from '../services/authService';
import { useRouter } from 'vue-router';
import { getUsers, deleteUser, updateUser } from '../services/userService';
import { register } from '../services/registerService';

const token = getToken();
const email = localStorage.getItem('user_email') || '';
const router = useRouter();
const users = ref<any[]>([]);
const editId = ref<number|null>(null);
const editEmail = ref('');
const editPassword = ref('');
const editRole = ref(1);

const regEmail = ref('');
const regPassword = ref('');
const regRole = ref(1);
const regMessage = ref('');
const regMessageColor = ref('#dc2626');

async function handleRegister() {
  if (!regEmail.value || !regPassword.value) {
    regMessage.value = 'Por favor complete todos los campos';
    regMessageColor.value = '#dc2626';
    return;
  }
  
  const success = await register(regEmail.value, regPassword.value, regRole.value);
  if (success) {
    regMessage.value = 'Usuario registrado exitosamente.';
    regMessageColor.value = '#16a34a'; 
    regEmail.value = '';
    regPassword.value = '';
    regRole.value = 1;
    await refreshUsers();
  } else {
    regMessage.value = 'Error al registrar usuario.';
    regMessageColor.value = '#dc2626'; 
  }
  
  setTimeout(() => {
    regMessage.value = '';
  }, 3000);
}

onMounted(async () => {
  users.value = await getUsers();
});

async function handleDelete(id: number) {
  await deleteUser(id);
  users.value = await getUsers();
}

function startEdit(user: any) {
  editId.value = user.id;
  editEmail.value = user.email;
  editPassword.value = '';
  editRole.value = user.role === 'Admin' ? 0 : 1;
}

async function handleUpdate() {
  if (editId.value !== null) {
    await updateUser(editId.value, { email: editEmail.value, password: editPassword.value, role: editRole.value });
    users.value = await getUsers();
    editId.value = null;
    editEmail.value = '';
    editPassword.value = '';
    editRole.value = 1;
  }
}

async function refreshUsers() {
  users.value = await getUsers();
}

function logout() {
  localStorage.removeItem('user_email');
  localStorage.removeItem('token');
  localStorage.removeItem('user_role');
  router.push('/');
}
</script>

<template>
  <div class="form-container">
    <h2>Bienvenido Admin</h2>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Token:</strong></p>
    <pre class="token-box">{{ token }}</pre>
    
    
    <div class="register-section">
      <h3 style="color:#2563eb;margin-bottom:16px;text-align:center;">Registrar Nuevo Usuario</h3>
      <input v-model="regEmail" placeholder="Email" class="input-field" />
      <input v-model="regPassword" type="password" placeholder="Password" class="input-field" />
      <select v-model="regRole" class="input-field">
        <option :value="0">Admin</option>
        <option :value="1">User</option>
      </select>
      <button @click="handleRegister" class="action-btn">Registrar</button>
      <p v-if="regMessage" :style="{ color: regMessageColor, textAlign: 'center', marginTop: '12px', fontWeight: 'bold' }">{{ regMessage }}</p>
    </div>
    <div v-if="users.length">
      <h3 style="text-align:center;color:#2563eb;margin-top:24px;">Gestión de usuarios</h3>
      <ul style="list-style:none;padding:0;">
        <li v-for="user in users" :key="user.id" style="background:#e5e7eb;margin:8px 0;padding:10px;border-radius:8px;">
          <strong>Email:</strong> {{ user.email }}<br>
          <strong>Rol:</strong> {{ user.role }}<br>
          <button @click="startEdit(user)" style="margin-right:8px;background:#2563eb;">Editar</button>
          <button @click="handleDelete(user.id)" style="background:#dc2626;">Eliminar</button>
        </li>
        <button @click="logout">Logout</button>
      </ul>
      <div v-if="editId !== null" style="margin-top:24px;background:#f1f5f9;padding:16px;border-radius:8px;">
        <h4 style="color:#2563eb;">Editar usuario</h4>
        <input v-model="editEmail" placeholder="email" style="width:100%;margin-bottom:8px;padding:10px 14px;border-radius:8px;border:1px solid #d1d5db;font-size:16px;">
        <input v-model="editPassword" type="password" placeholder="password (nuevo)" style="width:100%;margin-bottom:8px;padding:10px 14px;border-radius:8px;border:1px solid #d1d5db;font-size:16px;">
        <select v-model="editRole" style="width:100%;margin-bottom:8px;padding:10px 14px;border-radius:8px;border:1px solid #d1d5db;font-size:16px;">
          <option :value="0">Admin</option>
          <option :value="1">User</option>
        </select>
        <button @click="handleUpdate" style="background:#2563eb;width:100%;">Guardar</button>
      </div>
    </div>
    <div v-else>
      <p>No hay usuarios registrados.</p>
    </div>
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

<style scoped>
.register-section {
  background: #eff6ff;
  padding: 24px;
  border-radius: 12px;
  margin-bottom: 24px;
  border: 1px solid #bfdbfe;
}
.input-field {
  width: 100%;
  padding: 10px 14px;
  border: 1px solid #d1d5db;
  border-radius: 8px;
  font-size: 16px;
  margin-bottom: 12px;
  box-sizing: border-box;
  font-family: inherit;
}
.input-field:focus {
  border-color: #2563eb;
  outline: none;
}
.action-btn {
  background: #2563eb;
  color: #fff;
  border: none;
  border-radius: 8px;
  padding: 10px 20px;
  width: 100%;
  font-size: 16px;
  cursor: pointer;
  transition: background 0.2s;
  font-family: inherit;
}
.action-btn:hover {
  background: #1d4ed8;
}
</style>
