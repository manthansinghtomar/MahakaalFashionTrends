import api from '../lib/axios.js';
import { API_ENDPOINTS } from '../constants/index.js';

export const uploadService = {
  uploadImages: async (files, folder = 'products') => {
    const formData = new FormData();
    if (files instanceof FileList || Array.isArray(files)) {
      for (let i = 0; i < files.length; i++) {
        formData.append('images', files[i]);
      }
    } else {
      formData.append('images', files);
    }

    return api.post(`/upload/${folder}`, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
  },
};

export default uploadService;
