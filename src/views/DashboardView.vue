<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GalleryComponent from '../components/GalleryComponent.vue';
import UserManagementModal from '../components/UserManagementModal.vue';

const router = useRouter();
const showUserModal = ref(false);

function logout() {
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  localStorage.removeItem('auth_token');
  router.push('/');
}
</script>

<template>
  <div class="dashboard-page">
    <nav class="navbar">
      <div class="nav-brand">
        <h1>Dashboard</h1>
      </div>
      <div class="nav-actions">
        <button @click="showUserModal = true" class="nav-btn secondary">
          👥 Usuarios
        </button>
        <button @click="logout" class="nav-btn primary">
          ↪ Cerrar Sesión
        </button>
      </div>
    </nav>

    <main class="main-content">
      <GalleryComponent :is-admin="true" />
    </main>

    <UserManagementModal :is-open="showUserModal" @close="showUserModal = false" />
  </div>
</template>
