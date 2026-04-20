import { ref, computed } from 'vue'

const CREDENTIALS = {
  username: 'radenaja123',
  password: 'radenaja123',
}

const isLoggedIn = ref(sessionStorage.getItem('raden_auth') === 'true')

export function useAuth() {
  function login(username, password) {
    if (username === CREDENTIALS.username && password === CREDENTIALS.password) {
      isLoggedIn.value = true
      sessionStorage.setItem('raden_auth', 'true')
      return true
    }
    return false
  }

  function logout() {
    isLoggedIn.value = false
    sessionStorage.removeItem('raden_auth')
  }

  return {
    isLoggedIn: computed(() => isLoggedIn.value),
    login,
    logout,
  }
}
