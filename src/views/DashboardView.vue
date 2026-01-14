<template>
  <div style="padding:40px; max-width:400px; margin:auto; font-family:sans-serif">
    <h2>Bienvenido</h2>
    <p><strong>Email:</strong> {{ email }}</p>
    <p><strong>Token:</strong> {{ token }}</p>
  </div>
</template>
<script setup lang="ts">
import { getToken } from '../services/authService';

const token = getToken();
const email = localStorage.getItem('user_email') || '';
</script>
