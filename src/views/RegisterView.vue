<script setup lang="ts">
import { ref } from 'vue';
import { register } from '../services/registerService';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');

const message = ref('');
const isLoading = ref(false);
const showPassword = ref(false);
const router = useRouter();
const role = ref(1);

async function Register() {
  if (!email.value || !password.value) {
    message.value = 'Por favor completa todos los campos';
    return;
  }

  isLoading.value = true;
  message.value = '';

  const ok = await register(email.value, password.value, role.value);
  isLoading.value = false;

  if (ok) {
    message.value = 'Registro exitoso. Redirigiendo...';
    setTimeout(() => {
      router.push('/');
    }, 1500);
  } else {
    message.value = 'Registro falló.';
  }
}

function goBack() {
  router.push('/');
}
</script>

<template>
  <div class="login-page">
    <div class="header-section">
      <img src="../assets/img/Logo.png" alt="Logo" class="logo-img" />
      <h1 class="main-title">Crear Cuenta</h1>
    </div>

    <div class="card-container">
      <div class="input-group">
        <label>Usuario</label>
        <div class="input-wrapper">
          <input v-model="email" placeholder="Ingresa tu email" />
        </div>
      </div>

      <div class="input-group">
        <label>Contraseña</label>
        <div class="input-wrapper">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Crea una contraseña" />
          <button class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
            {{ showPassword ? 'Ocultar' : 'Ver' }}
          </button>
        </div>
      </div>

      <div class="input-group">
        <label>Rol</label>
        <div class="input-wrapper">
          <select v-model="role">
            <option :value="0">Admin</option>
            <option :value="1">User</option>
          </select>
        </div>
      </div>

      <button class="login-btn" @click="Register" :disabled="isLoading">
        {{ isLoading ? 'Registrando...' : 'Registrarme' }}
        <span v-if="!isLoading" class="arrow">→</span>
      </button>

      <div class="register-link">
        <button class="link-btn" @click="goBack">← Volver al Login</button>
      </div>

      <p v-if="message" class="error-msg">{{ message }}</p>
    </div>
  </div>
</template>
