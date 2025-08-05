import { ref } from 'vue';

const API_BASE_URL = 'https://localhost:7127';

export function useFetch(endpoint, options = {}) {
  const result = ref(null);
  const error = ref(null);
  const loading = ref(true);

  const {
    method = 'GET',
    headers = {},
    body = null,
    immediate = true, 
  } = options;

  const fetchData = async () => {
    loading.value = true;
    error.value = null;

    try {
      const response = await fetch(`${API_BASE_URL}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...headers,
        },
        body: body ? JSON.stringify(body) : null,
      });

      if (!response.ok) {
        throw new Error(`Gabim HTTP: ${response.status} ${response.statusText}`);
      }

      result.value = await response.json();
    } catch (err) {
      error.value = err.message || 'Gabim i panjohur gjatë fetch.';
    } finally {
      loading.value = false;
    }
  };

  if (immediate) fetchData();

  return { result, error, loading, refetch: fetchData };
}
