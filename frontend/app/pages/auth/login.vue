<template>
  <div class="min-h-[calc(100vh-80px)] flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
    <div class="max-w-md w-full space-y-8 bg-white p-10 shadow-sm">
      <div class="text-center">
        <h2 class="text-3xl font-serif text-gray-900">С возвращением</h2>
        <p class="mt-2 text-sm text-gray-600">
          Или <NuxtLink to="/auth/register" class="font-medium text-primary hover:text-opacity-80">создайте новый аккаунт</NuxtLink>
        </p>
      </div>

      <!-- Success message from registration -->
      <div v-if="successMessage" class="bg-green-50 text-green-700 p-4 rounded-md text-sm text-center border border-green-200">
        {{ successMessage }}
      </div>
      
      <form class="mt-8 space-y-6" @submit.prevent="handleLogin">
        <div class="space-y-4">
          <div>
            <label for="username" class="sr-only">Имя пользователя или Email</label>
            <input id="username" v-model="form.username" name="username" type="text" required class="appearance-none relative block w-full px-3 py-3 border border-gray-300 placeholder-gray-500 text-gray-900 focus:outline-none focus:ring-primary focus:border-primary sm:text-sm" placeholder="Имя пользователя или Email" />
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
            <span v-if="loading">Вход...</span>
            <span v-else>Войти</span>
          </button>
        </div>
      </form>
    </div>
  </div>
</template>

<script setup lang="ts">
const auth = useAuthStore()
const router = useRouter()
const route = useRoute()

const form = reactive({
  username: '',
  password: ''
})
const loading = ref(false)
const error = ref('')
const successMessage = ref('')

onMounted(() => {
  if (route.query.registered) {
    successMessage.value = 'Регистрация прошла успешно! Теперь вы можете войти в свой аккаунт.'
  }
})

async function handleLogin() {
  loading.value = true
  error.value = ''
  try {
    await auth.login(form)
    router.push('/')
  } catch (e: any) {
    error.value = 'Неверный логин или пароль'
  } finally {
    loading.value = false
  }
}
</script>
