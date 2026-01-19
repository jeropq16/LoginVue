<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { getUsers, updateMyProfile } from '../services/userService';

const props = defineProps<{
  email: string;
  role: string | null;
}>();

const photoUrl = ref('');
const fileInput = ref<HTMLInputElement | null>(null);
const isHovering = ref(false);

onMounted(async () => {
  await loadMyPhoto();
});

async function loadMyPhoto() {
  const allUsers = await getUsers();
  const me = allUsers.find((u: any) => u.email === props.email);
  if (me && me.profileImageUrl) {
    photoUrl.value = me.profileImageUrl;
  }
}

function triggerUpload() {
  fileInput.value?.click();
}

async function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    const file = target.files[0];
    try {
      const updatedUser = await updateMyProfile(props.email, '', file);
      if (updatedUser && updatedUser.profileImageUrl) {
        photoUrl.value = updatedUser.profileImageUrl;
      }
      await loadMyPhoto();
    } catch (e) {
      console.error(e);
      alert('Error updating profile photo');
    }
  }
}
</script>

<template>
  <div class="user-profile">
    <div class="profile-icon" :class="{ 'has-photo': !!photoUrl }" @click="triggerUpload"
      @mouseenter="isHovering = true" @mouseleave="isHovering = false">
      <img v-if="photoUrl" :src="photoUrl" alt="Profile" />
      <div v-else class="default-icon">
        <img src="../assets/img/Logo.png" alt="Default Profile" class="default-img" />
      </div>
      <div v-if="isHovering" class="upload-overlay">
        📷
      </div>
    </div>

    <div class="profile-info">
      <h2 class="title">Galería de Imágenes</h2>
      <p class="subtitle">{{ role || 'User' }} - {{ email }}</p>
    </div>

    <input type="file" ref="fileInput" accept="image/*" class="hidden-input" @change="handleFileChange" />
  </div>
</template>

<style scoped>
.user-profile {
  display: flex;
  align-items: center;
  gap: 16px;
}

.profile-icon {
  width: 48px;
  height: 48px;
  background: #2563eb;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
  position: relative;
  cursor: pointer;
  transition: transform 0.2s;
}

.profile-icon:hover {
  transform: scale(1.05);
}

.profile-icon img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.default-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
  background: #ffffff;
}

.default-img {
    width: 80%;
    height: 80%;
    object-fit: contain;
}

.shield {
  width: 24px;
  height: 24px;
  color: white;
}

.upload-overlay {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.4);
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 20px;
}

.profile-info {
  display: flex;
  flex-direction: column;
}

.title {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 700;
  color: #1e293b;
  line-height: 1.2;
}

.subtitle {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
  margin-top: 2px;
}

.hidden-input {
  display: none;
}
</style>
