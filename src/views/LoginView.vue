<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../services/authService';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const message = ref('');
const isLoading = ref(false);
const router = useRouter();

async function Login() {
  if (!email.value || !password.value) {
    message.value = 'Por favor ingresa usuario y contraseña';
    return;
  }

  isLoading.value = true;
  message.value = '';

  try {
    const result = await login(email.value, password.value);
    if (result && result.token) {
      localStorage.setItem('user_email', email.value);
      localStorage.setItem('user_role', result.role);
      if (result.role === 'Admin') {
        router.push('/dashboard');
      } else {
        router.push('/user-welcome');
      }
    } else {
      message.value = 'Credenciales inválidas. Intenta de nuevo.';
    }
  } catch (e) {
    message.value = 'Ocurrió un error al iniciar sesión.';
  } finally {
    isLoading.value = false;
  }
}

function goToRegister() {
  router.push('/register');
}
</script>

<template>
  <div class="login-page">
    <div class="header-section">
      <h1 class="main-title">Galería de Imágenes</h1>
      <p class="subtitle">Inicia sesión para continuar</p>
    </div>

    <div class="card-container">
      <div class="input-group">
        <label>Usuario</label>
        <div class="input-wrapper">
          <input v-model="email" type="text" placeholder="Ingresa tu usuario" @keyup.enter="Login" />
        </div>
      </div>

      <div class="input-group">
        <label>Contraseña</label>
        <div class="input-wrapper">
          <input v-model="password" :type="showPassword ? 'text' : 'password'" placeholder="Ingresa tu contraseña"
            @keyup.enter="Login" />
          <button class="toggle-password" @click="showPassword = !showPassword" tabindex="-1">
            {{ showPassword ? 'Ocultar' : 'Mostrar' }}
          </button>
        </div>
      </div>

      <button class="login-btn" @click="Login" :disabled="isLoading">
        {{ isLoading ? 'Cargando...' : 'Iniciar Sesión' }}
        <span v-if="!isLoading" class="arrow">→</span>
      </button>

      <div class="register-link">
        <p>¿No tienes cuenta?</p>
        <button class="link-btn" @click="goToRegister">Regístrate aquí</button>
      </div>

      <p v-if="message" class="error-msg">{{ message }}</p>
    </div>
  </div>
</template>
