import { ref, computed } from 'vue';
import { defineStore } from 'pinia';

export const useAuthStore = defineStore('auth', () => {
  const userToken = ref(localStorage.getItem('userToken'));
  const loggedInUserIdentifier = ref(localStorage.getItem('loggedInUserIdentifier'));
  const userRoles = ref(JSON.parse(localStorage.getItem('userRoles') || '[]'));

  const isAuthenticated = computed(() => !!userToken.value);
  const isAdmin = computed(() => userRoles.value.includes('Admin'));

  const setAuth = (token, identifier = null, roles = []) => {
    localStorage.setItem('userToken', token);
    userToken.value = token;

    if (identifier) {
      localStorage.setItem('loggedInUserIdentifier', identifier);
      loggedInUserIdentifier.value = identifier;
    }

    if (roles.length) {
      localStorage.setItem('userRoles', JSON.stringify(roles));
      userRoles.value = roles;
    } else {
      localStorage.removeItem('userRoles');
      userRoles.value = [];
    }

    console.log('Auth set:', {
      token: userToken.value,
      identifier: loggedInUserIdentifier.value,
      roles: userRoles.value
    });
  };

  const clearAuth = () => {
    localStorage.removeItem('userToken');
    localStorage.removeItem('loggedInUserIdentifier');
    localStorage.removeItem('userRoles');

    userToken.value = null;
    loggedInUserIdentifier.value = null;
    userRoles.value = [];
  };

  return {
    userToken,
    loggedInUserIdentifier,
    userRoles,
    isAuthenticated,
    isAdmin,
    setAuth,
    clearAuth,
  };
});
