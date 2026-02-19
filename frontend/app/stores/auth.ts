import { defineStore } from 'pinia'

interface User {
  id: string;
  login: string;
  role: string;
  email?: string;
}

export const useAuthStore = defineStore('auth', () => {
  const user = useState<User | null>('auth-user', () => null)
  const config = useRuntimeConfig()

  const isAuthenticated = computed(() => !!user.value)

  async function login(credentials: any) {
    try {
      const { data, error } = await useFetch(`${config.public.apiBase}/auth/login`, {
        method: 'POST',
        body: credentials
      })

      if (error.value) throw error.value

      if (data.value) {
        user.value = data.value.user
      }
    } catch (e) {
      console.error('Login failed', e)
      throw e
    }
  }

  async function register(credentials: any) {
    try {
      const { data, error } = await useFetch(`${config.public.apiBase}/auth/register`, {
        method: 'POST',
        body: credentials
      })

      if (error.value) throw error.value
      
      // Auto login after register if desired, or just redirect
      return data.value
    } catch (e) {
      console.error('Registration failed', e)
      throw e
    }
  }

  async function logout() {
    try {
      await useFetch(`${config.public.apiBase}/auth/logout`, { method: 'POST' })
    } catch (e) {
      console.error('Logout error', e)
    } finally {
      user.value = null
    }
  }

  return {
    user,
    isAuthenticated,
    login,
    register,
    logout
  }
})
