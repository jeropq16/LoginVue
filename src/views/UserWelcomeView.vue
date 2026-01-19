<script setup lang="ts">
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import GalleryComponent from '../components/GalleryComponent.vue';
import UserManagementModal from '../components/UserManagementModal.vue';
import UserProfile from '../components/UserProfile.vue';
import { logout as doLogout } from '../services/authService';

const router = useRouter();
const showUserModal = ref(false);

const userEmail = localStorage.getItem('user_email') || '';
const userRole = localStorage.getItem('user_role') || 'User';

function logout() {
  doLogout();
  localStorage.removeItem('user_email');
  localStorage.removeItem('user_role');
  router.push('/');
}
</script>

<template>
  <div class="dashboard-page">
    <nav class="navbar">
      <div class="nav-brand">
        <UserProfile :email="userEmail" :role="userRole" />
      </div>
      <div class="nav-actions">
        <button @click="showUserModal = true" class="nav-btn secondary">
           Usuarios
        </button>
        <button @click="logout" class="nav-btn primary">
           Cerrar Sesión
        </button>
      </div>
    </nav>

    <main class="main-content">
      <GalleryComponent :is-admin="false" />
    </main>

    <UserManagementModal :is-open="showUserModal" :read-only="true" @close="showUserModal = false" />
  </div>
</template>
