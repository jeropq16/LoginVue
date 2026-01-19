import { api } from './authService';
import type { GalleryImage } from '../models/GalleryImage';

export async function getGallery(): Promise<GalleryImage[]> {
    try {
        const res = await api.get('/api/Gallery');
        return res.data;
    } catch (error) {
        console.error(error);
        return [];
    }
}

export async function uploadImage(file: File, title: string): Promise<boolean> {
    try {
        const formData = new FormData();
        formData.append('File', file);
        formData.append('Title', title);

        const res = await api.post('/api/Gallery', formData, {
            headers: {
                'Content-Type': 'multipart/form-data'
            }
        });
        return res.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}

export async function deleteImage(id: number): Promise<boolean> {
    try {
        const res = await api.delete(`/api/Gallery/${id}`);
        return res.status === 200;
    } catch (error) {
        console.error(error);
        return false;
    }
}
