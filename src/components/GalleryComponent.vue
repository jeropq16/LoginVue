<script setup lang="ts">
import { ref, onMounted } from 'vue';
import type { GalleryImage } from '../models/GalleryImage';
import { getGallery, uploadImage, deleteImage } from '../services/galleryService';

const props = defineProps<{
  isAdmin: boolean;
}>();

const images = ref<GalleryImage[]>([]);
const newTitle = ref('');
const newFile = ref<File | null>(null);
const fileInput = ref<HTMLInputElement | null>(null);
const uploading = ref(false);

onMounted(async () => {
  await loadImages();
});

async function loadImages() {
  images.value = await getGallery();
}

function handleFileChange(event: Event) {
  const target = event.target as HTMLInputElement;
  if (target.files && target.files.length > 0) {
    newFile.value = target.files[0];
    if (!newTitle.value) {
      newTitle.value = newFile.value.name.split('.')[0];
    }
  }
}

async function handleUpload() {
  if (!newFile.value) return;
  const titleToUse = newTitle.value || newFile.value.name;

  uploading.value = true;
  const success = await uploadImage(newFile.value, titleToUse);
  if (success) {
    await loadImages();
    newTitle.value = '';
    newFile.value = null;
    if (fileInput.value) fileInput.value.value = '';
  } else {
    alert('Error al subir la imagen');
  }
  uploading.value = false;
}

async function handleDelete(id: number) {
  if (confirm('Estás seguro de que quieres eliminar esta imagen?')) {
    const success = await deleteImage(id);
    if (success) {
      images.value = images.value.filter(img => img.id !== id);
    } else {
      alert('Error al eliminar la imagen');
    }
  }
}

function formatDate(dateStr: string) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  return new Intl.DateTimeFormat('es-ES', { day: 'numeric', month: 'long', year: 'numeric' }).format(date);
}
</script>

<template>
  <div class="gallery-wrapper">
    <div v-if="props.isAdmin" class="upload-card">
      <div class="upload-header">
        <h3>Subir Imágenes</h3>
      </div>

      <div class="upload-body">
        <div class="file-select-row">
          <button class="choose-btn" @click="fileInput?.click()">Elegir archivos</button>
          <span class="file-name">{{ newFile ? newFile.name : 'Ningún archivo seleccionado' }}</span>
        </div>

        <input type="text" v-model="newTitle" placeholder="Título" class="title-input" v-if="newFile" />

        <input type="file" ref="fileInput" @change="handleFileChange" accept="image/*" class="hidden-input" />

        <button v-if="newFile" @click="handleUpload" :disabled="uploading" class="upload-confirm-btn">
          {{ uploading ? 'Subiendo' : 'Subir' }}
        </button>
      </div>
    </div>

    <h3 class="gallery-heading">Galería de imágenes ({{ images.length }})</h3>

    <div v-if="images.length === 0" class="empty-state">
      <p>No hay imágenes disponibles.</p>
    </div>

    <div v-else class="gallery-grid">
      <div v-for="img in images" :key="img.id" class="gallery-card">
        <div class="card-image">
          <img :src="img.url" :alt="img.title || 'Imagen'" loading="lazy" />
          <button v-if="props.isAdmin" @click="handleDelete(img.id)" class="delete-btn" title="Eliminar">
            ×
          </button>
        </div>
        <div class="card-info">
          <h4 class="img-title">{{ img.title || 'Sin Título' }}</h4>
          <p class="img-date">{{ formatDate(img.createdAt) }}</p>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
@import url('https://fonts.googleapis.com/css2?family=Roboto:wght@400;500;700&display=swap');

.gallery-wrapper {
  font-family: 'Roboto', sans-serif;
  width: 100%;
}

.upload-card {
  background: white;
  border: 1px solid #e2e8f0;
  border-radius: 12px;
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
}

.upload-header {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 24px;
}

.icon-upload {
  width: 24px;
  height: 24px;
  color: #3b82f6;
}

.upload-header h3 {
  margin: 0;
  font-size: 1.1rem;
  font-weight: 600;
  color: #1e293b;
}

.upload-body {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.file-select-row {
  display: flex;
  align-items: center;
  gap: 16px;
}

.choose-btn {
  background: #2563eb;
  color: white;
  border: none;
  border-radius: 6px;
  padding: 8px 16px;
  font-size: 0.9rem;
  cursor: pointer;
  transition: background 0.2s;
}

.choose-btn:hover {
  background: #1d4ed8;
}

.file-name {
  color: #94a3b8;
  font-size: 0.95rem;
}

.title-input {
  padding: 8px 12px;
  border: 1px solid #cbd5e1;
  border-radius: 6px;
  width: 100%;
  max-width: 300px;
}

.upload-confirm-btn {
  background: #10b981;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 6px;
  cursor: pointer;
  width: max-content;
}

.help-text {
  margin: 0;
  color: #94a3b8;
  font-size: 0.85rem;
}

.hidden-input {
  display: none;
}

.gallery-heading {
  font-size: 1.15rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 20px;
}

.gallery-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 24px;
}

.gallery-card {
  background: white;
  border-radius: 12px;
  border: 1px solid #e2e8f0;
  overflow: hidden;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.05);
  transition: transform 0.2s, box-shadow 0.2s;
  display: flex;
  flex-direction: column;
}

.gallery-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.card-image {
  position: relative;
  width: 100%;
  padding-top: 56.25%;
  background: #f1f5f9;
}

.card-image img {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.delete-btn {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(0, 0, 0, 0.6);
  color: white;
  border: none;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  opacity: 0;
  transition: opacity 0.2s;
}

.card-image:hover .delete-btn {
  opacity: 1;
}

.delete-btn:hover {
  background: #ef4444;
}

.card-info {
  padding: 16px;
  border-top: 1px solid #f1f5f9;
}

.img-title {
  margin: 0;
  font-size: 1rem;
  font-weight: 600;
  color: #1e293b;
  margin-bottom: 4px;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.img-date {
  margin: 0;
  font-size: 0.85rem;
  color: #64748b;
}

.empty-state {
  text-align: center;
  color: #94a3b8;
  padding: 40px;
  background: #f8fafc;
  border-radius: 12px;
  border: 1px dashed #cbd5e1;
}
</style>
