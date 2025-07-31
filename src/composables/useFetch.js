import { ref } from 'vue';

const API_BASE_URL = 'https://localhost:7127';

export function useFetch(endpoint, options = {}) {
  const result = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const fetchData = async () => {
    loading.value = true;
    try {
      const res = await fetch(`${API_BASE_URL}${endpoint}`);
      if (!res.ok) throw new Error(`HTTP error! status: ${res.status}`);
      result.value = await res.json();
    } catch (err) {
      error.value = err;
    } finally {
      loading.value = false;
    }
  };

  fetchData();

  return { result, error, loading, refetch: fetchData };
}
