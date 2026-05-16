<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 shadow-sm">
      <div class="text-center">
        <h2 class="text-3xl font-serif text-gray-900">Создать аккаунт</h2>
        <p class="mt-2 text-sm text-gray-600">
          Уже есть аккаунт? <NuxtLink to="/auth/login" class="font-medium text-primary hover:text-opacity-80">Войти</NuxtLink>
        </p>
      </div>
      <form class="mt-8 space-y-6" @submit.prevent="handleRegister">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Имя пользователя</label>
            <input id="username" v-model="form.login" name="username" type="text" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Имя пользователя" />
          </div>
          <div>
            <label for="email" class="sr-only">Email</label>
            <input id="email" v-model="form.email" name="email" type="email" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Email (например, manager@example.com)" />
          </div>
          <div>
            <label for="password" class="sr-only">Пароль</label>
            <input id="password" v-model="form.password" name="password" type="password" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Пароль" />
          </div>
        </div>

        <div v-if="error" class="text-red-500 text-sm text-center">
          {{ error }}
        </div>

        <div>
          <button type="submit" :disabled="loading" class="group relative w-full flex justify-center py-3 px-4 border border-transparent text-sm font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary disabled:opacity-50">
            <span v-if="loading">Создание аккаунта...</span>
            <span v-else>Создать аккаунт</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()

const form = reactive({
  login: '',
  password: '',
  email: ''
})
const loading = ref(false)
const error = ref('')

async function handleRegister() {
  loading.value = true
  error.value = ''
  try {
    await auth.register(form)
    router.push({ path: '/auth/login', query: { registered: 'true' } })
  } catch (e: any) {
    error.value = 'Ошибка регистрации. Попробуйте другое имя пользователя.'
  } finally {
    loading.value = false
  }
}
</script>
