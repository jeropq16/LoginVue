<template>
  <div class="form-container">
    <h2>Login</h2>
    <input v-model="email" placeholder="email" />
    <br /><br />
    <input v-model="password" type="password" placeholder="password" />
    <br /><br />
    <button @click="Login">Login</button>
    <button @click="Register" style="margin-left:10px">Ir a Register</button>
    <p>{{message}}</p>
  </div>
</template>
<script setup lang="ts">
import { ref } from 'vue';
import { login } from '../services/authService';
import { useRouter } from 'vue-router';

const email = ref('');
const password = ref('');
const message = ref('');
const router = useRouter();

async function Login() {
  const token = await login(email.value, password.value);
  if (token) {
    message.value = 'Login exitoso.';
    localStorage.setItem('user_email', email.value);
    router.push('/dashboard');
  } else {
    message.value = 'Login falló.';
  }
}

function Register() {
  router.push('/register');
}
</script>
