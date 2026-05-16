<script setup lang="ts">
const authStore = useAuthStore();
const router = useRouter();

const handleLogout = async () => {
  await authStore.logout();
  router.push('/auth/login');
};

const links = [
  { name: 'Dashboard', path: '/admin', icon: 'heroicons:home' },
  { name: 'Orders', path: '/admin/orders', icon: 'heroicons:shopping-cart' },
  { name: 'Products', path: '/admin/products', icon: 'heroicons:shopping-bag' },
  { name: 'Categories', path: '/admin/categories', icon: 'heroicons:tag' },
  { name: 'Discounts', path: '/admin/discounts', icon: 'heroicons:ticket' },
  { name: 'API Tests', path: '/admin/test', icon: 'heroicons:beaker' },
  { name: 'Data Seeder', path: '/admin/seed', icon: 'heroicons:command-line' },
];
</script>

<template>
  <div class="flex h-screen bg-gray-50 font-sans">
    <!-- Sidebar -->
    <aside class="w-64 bg-primary text-secondary flex flex-col shadow-xl">
      <div class="p-6 border-b border-white/10">
        <h1 class="flex items-center gap-2 font-serif text-2xl font-bold tracking-wide">
          <img src="/flower.logo.png" alt="Logo" class="w-8 h-8 object-contain" />
          The Sill Admin
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

      <div class="p-4 border-t border-white/10">
        <button 
          @click="handleLogout"
          class="flex items-center gap-3 px-4 py-3 w-full rounded-lg text-red-200 hover:bg-red-900/20 transition-colors"
        >
          <Icon name="heroicons:arrow-left-on-rectangle" size="20" />
          <span>Logout</span>
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
