<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

const links = [
  { name: 'Обзор', path: '/admin', icon: 'heroicons:home' },
  { name: 'Заказы', path: '/admin/orders', icon: 'heroicons:shopping-cart' },
  { name: 'Товары', path: '/admin/products', icon: 'heroicons:shopping-bag' },
  { name: 'Категории', path: '/admin/categories', icon: 'heroicons:tag' },
  { name: 'Склад', path: '/admin/inventory', icon: 'heroicons:archive-box' },
  { name: 'Тесты API', path: '/admin/test', icon: 'heroicons:beaker' },
  { name: 'Сиддер данных', path: '/admin/seed', icon: 'heroicons:command-line' },
];
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary text-secondary flex flex-col shadow-xl">
      <div class="p-6 border-b border-white/10">
        <h1 class="flex items-center gap-2 font-serif text-2xl font-bold tracking-wide">
          <img src="/flower.logo.png" alt="Logo" class="w-8 h-8 object-contain" />
          Админ-панель
        </h1>
      </div>

      <nav class="flex-1 p-4 space-y-2">
        <NuxtLink 
          v-for="link in links" 
          :key="link.path" 
          :to="link.path"
          class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors duration-200 hover:bg-white/10"
          active-class="bg-white/20 text-white shadow-sm"
        >
          <Icon :name="link.icon" size="20" />
          <span class="font-medium">{{ link.name }}</span>
        </NuxtLink>
      </nav>

      <div class="p-4 border-t border-white/10 space-y-2">
        <NuxtLink 
          to="/"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-white/80 hover:bg-white/10 transition-colors"
        >
          <Icon name="heroicons:globe-alt" size="20" />
          <span>На главную страницу</span>
        </NuxtLink>
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-200 hover:bg-red-900/20 transition-colors"
        >
          <Icon name="heroicons:arrow-left-on-rectangle" size="20" />
          <span>Выйти из аккаунта</span>
        </button>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="flex-1 overflow-auto">
      <div class="p-8 max-w-7xl mx-auto">
        <slot />
      </div>
    </main>
  </div>
</template>

<style scoped>
/* Ensure fonts are applied */
.font-serif {
  font-family: 'Playfair Display', serif;
}
</style>
