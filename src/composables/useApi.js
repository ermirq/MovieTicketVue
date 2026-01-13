import axios from 'axios';
import { ref } from 'vue';
import { useRouter } from 'vue-router';

const API_BASE_URL = 'https://localhost:7127';

export function useApi() {
  const loading = ref(false);
  const error = ref(null);
  const router = useRouter();

  const api = axios.create({
    baseURL: API_BASE_URL,
    headers: {
      'Content-Type': 'application/json'
    }
  });

  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('userToken');
      if (token) {
        config.headers['Authorization'] = `Bearer ${token}`;
      }
      return config;
    },
    (err) => Promise.reject(err)
  );

  api.interceptors.response.use(
    (response) => response,
    (err) => {
      if (err.response && (err.response.status === 401 || err.response.status === 403)) {
        router.push('/login');
      }
      return Promise.reject(err);
    }
  );

  const get = async (url, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.get(url, config);
      return response.data;
    } catch (err) {
      error.value = parseError(err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const post = async (url, data, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.post(url, data, config);
      return response.data;
    } catch (err) {
      error.value = parseError(err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const put = async (url, data, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.put(url, data, config);
      return response.data;
    } catch (err) {
      error.value = parseError(err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const del = async (url, config = {}) => {
    loading.value = true;
    error.value = null;
    try {
      const response = await api.delete(url, config);
      return response.data;
    } catch (err) {
      error.value = parseError(err);
      throw error.value;
    } finally {
      loading.value = false;
    }
  };

  const parseError = (err) => {
    if (err.response?.data?.message) return err.response.data.message;
    if (err.response?.data?.detail) return err.response.data.detail;
    return err.message || 'Ndodhi një gabim i papritur.';
  };

  return { api, get, post, put, del, loading, error };
}
