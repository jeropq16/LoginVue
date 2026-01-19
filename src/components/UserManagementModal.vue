<script setup lang="ts">
import { ref, onMounted, watch } from 'vue';
import { getUsers, deleteUser, updateUser } from '../services/userService';
import { register } from '../services/registerService';

const props = defineProps<{
  isOpen: boolean;
  readOnly?: boolean;
}>();

const emit = defineEmits(['close']);

const users = ref<any[]>([]);
const editId = ref<number | null>(null);
const editEmail = ref('');
const editPassword = ref('');
const editRole = ref(1);

const regEmail = ref('');
const regPassword = ref('');
const regRole = ref(1);
const regMessage = ref('');
const regMessageColor = ref('#dc2626');

watch(() => props.isOpen, (newVal) => {
  if (newVal) {
    refreshUsers();
  }
});

onMounted(async () => {
  if (props.isOpen) {
    await refreshUsers();
  }
});

async function refreshUsers() {
  users.value = await getUsers();
}

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

async function handleDelete(id: number) {
  if (confirm('¿Seguro que desea eliminar este usuario?')) {
    await deleteUser(id);
    await refreshUsers();
  }
}

function startEdit(user: any) {
  editId.value = user.id;
  editEmail.value = user.email;
  editPassword.value = '';
  editRole.value = user.role === 'Admin' ? 0 : 1;
}

function cancelEdit() {
  editId.value = null;
  editEmail.value = '';
  editPassword.value = '';
  editRole.value = 1;
}

async function handleUpdate() {
  if (editId.value !== null) {
    await updateUser(editId.value, { email: editEmail.value, password: editPassword.value, role: editRole.value });
    await refreshUsers();
    cancelEdit();
  }
}

function close() {
  emit('close');
}
</script>

<template>
  <div v-if="isOpen" class="modal-overlay" @click.self="close">
    <div class="modal-content">
      <div class="modal-header">
        <h3>Gestión de Usuarios</h3>
        <button class="close-btn" @click="close">×</button>
      </div>

      <div class="modal-body">
        <div v-if="!readOnly" class="section-box">
          <h4>Registrar Nuevo Usuario</h4>
          <div class="register-form">
            <input v-model="regEmail" placeholder="Email" class="input-field" />
            <input v-model="regPassword" type="password" placeholder="Password" class="input-field" />
            <select v-model="regRole" class="input-field">
              <option :value="0">Admin</option>
              <option :value="1">User</option>
            </select>
            <button @click="handleRegister" class="action-btn">Registrar</button>
          </div>
          <p v-if="regMessage" :style="{ color: regMessageColor }" class="msg-text">{{ regMessage }}</p>
        </div>

        <div class="section-box">
          <h4>Usuarios Existentes</h4>
          <div v-if="users.length" class="user-list">
            <div v-for="user in users" :key="user.id" class="user-item">
              <div class="user-info">
                <span class="user-email">{{ user.email }}</span>
                <span class="user-role badge" :class="user.role">{{ user.role }}</span>
              </div>
              <div v-if="!readOnly" class="user-actions">
                <button @click="startEdit(user)" class="icon-btn edit" title="Editar">✏️</button>
                <button @click="handleDelete(user.id)" class="icon-btn delete" title="Eliminar">🗑️</button>
              </div>
            </div>
          </div>
          <p v-else>No hay usuarios registrados.</p>
        </div>

        <div v-if="editId !== null && !readOnly" class="edit-modal-overlay">
          <div class="edit-box">
            <h4>Editar Usuario</h4>
            <input v-model="editEmail" placeholder="Email" class="input-field" />
            <input v-model="editPassword" type="password" placeholder="Nueva Contraseña" class="input-field" />
            <select v-model="editRole" class="input-field">
              <option :value="0">Admin</option>
              <option :value="1">User</option>
            </select>
            <div class="edit-actions">
              <button @click="handleUpdate" class="save-btn">Guardar</button>
              <button @click="cancelEdit" class="cancel-btn">Cancelar</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  backdrop-filter: blur(4px);
}

.modal-content {
  background: white;
  width: 90%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  animation: slideIn 0.3s ease-out;
}

@keyframes slideIn {
  from {
    transform: translateY(20px);
    opacity: 0;
  }

  to {
    transform: translateY(0);
    opacity: 1;
  }
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 20px 24px;
  border-bottom: 1px solid #e2e8f0;
}

.modal-header h3 {
  margin: 0;
  color: #1e293b;
  font-size: 1.25rem;
}

.close-btn {
  background: none;
  border: none;
  font-size: 2rem;
  line-height: 1;
  color: #64748b;
  cursor: pointer;
}

.modal-body {
  padding: 24px;
}

.section-box {
  margin-bottom: 24px;
  background: #f8fafc;
  padding: 16px;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
}

.section-box h4 {
  margin-top: 0;
  margin-bottom: 16px;
  color: #334155;
  font-size: 1rem;
}

.register-form {
  display: grid;
  gap: 12px;
}

.input-field {
  padding: 10px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 8px;
  font-size: 0.95rem;
  width: 100%;
  box-sizing: border-box;
}

.action-btn {
  background: #3b82f6;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  font-weight: 600;
  cursor: pointer;
  transition: background 0.2s;
}

.action-btn:hover {
  background: #2563eb;
}

.user-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.user-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: white;
  padding: 10px 14px;
  border-radius: 8px;
  border: 1px solid #e2e8f0;
}

.user-info {
  display: flex;
  align-items: center;
  gap: 12px;
}

.user-email {
  font-weight: 500;
  color: #334155;
}

.badge {
  font-size: 0.75rem;
  padding: 2px 8px;
  border-radius: 12px;
  text-transform: uppercase;
  font-weight: 700;
}

.badge.Admin {
  background: #dbeafe;
  color: #1e40af;
}

.badge.User {
  background: #f1f5f9;
  color: #475569;
}

.icon-btn {
  background: none;
  border: none;
  cursor: pointer;
  font-size: 1.1rem;
  padding: 4px;
  transition: transform 0.1s;
}

.icon-btn:hover {
  transform: scale(1.1);
}

.edit-modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.2);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1100;
}

.edit-box {
  background: white;
  padding: 24px;
  border-radius: 12px;
  width: 90%;
  max-width: 400px;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
}

.edit-actions {
  display: flex;
  gap: 10px;
  margin-top: 16px;
}

.save-btn {
  flex: 1;
  background: #16a34a;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.cancel-btn {
  flex: 1;
  background: #ef4444;
  color: white;
  border: none;
  padding: 10px;
  border-radius: 8px;
  cursor: pointer;
}

.msg-text {
  text-align: center;
  margin-top: 12px;
  font-size: 0.9rem;
  font-weight: 600;
}
</style>
