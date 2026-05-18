<template>
  <div class="flex flex-col min-h-screen text-gray-900 font-sans">
    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <!-- Mobile Menu (Hidden on Desktop) -->
        <button class="lg:hidden p-2">
          <Icon name="lucide:menu" size="24" />
        </button>

        <!-- Logo -->
        <NuxtLink to="/" class="flex items-center gap-2 text-2xl font-serif font-bold tracking-tight">
          <img src="/flower.logo.png" alt="Logo" class="w-8 h-8 object-contain" />
          The Green House
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <NuxtLink to="/shop" class="hover:text-primary transition-colors">Весь каталог</NuxtLink>
          <NuxtLink to="/shop?category=plants" class="hover:text-primary transition-colors">Растения</NuxtLink>
          <NuxtLink to="/about" class="hover:text-primary transition-colors">О нас</NuxtLink>
          <NuxtLink to="/admin" v-if="auth.isAuthenticated && (auth.user?.role === 'admin' || auth.user?.role === 'manager')" class="text-primary hover:text-opacity-80 transition-colors font-bold">Админ-панель</NuxtLink>
        </nav>

        <!-- Icons -->
        <div class="flex items-center space-x-6">
          <!-- Sleek Search Input -->
          <div class="relative flex items-center">
            <input
              v-model="headerSearchQuery"
              type="text"
              placeholder="Поиск..."
              class="w-28 sm:w-40 md:w-48 pl-8 pr-3 py-1 bg-gray-50 border border-gray-200 rounded-full text-xs focus:outline-none focus:ring-1 focus:ring-primary focus:border-primary transition-all"
              @keyup.enter="triggerSearch"
            />
            <Icon name="lucide:search" size="14" class="absolute left-2.5 top-1/2 -translate-y-1/2 text-gray-400" />
          </div>
          
          <NuxtLink :to="auth.isAuthenticated ? '/profile' : '/auth/login'" class="hover:text-primary transition-colors">
             <Icon name="lucide:user" size="20" />
          </NuxtLink>
          <NuxtLink to="/cart" class="hover:text-primary transition-colors relative block mt-[6px]">
            <Icon name="lucide:shopping-bag" size="20" />
            <span class="absolute -top-1 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">{{ cartStore.totalItems }}</span>
          </NuxtLink>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="flex-grow">
      <slot />
    </main>

    <!-- Footer -->
    <footer class="bg-gray-50 pt-16 pb-8 border-t border-gray-100">
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
        <div>
          <h3 class="flex items-center gap-2 font-serif text-lg mb-4">
            <img src="/flower.logo.png" alt="Logo" class="w-6 h-6 object-contain" />
            The Green House
          </h3>
          <p class="text-sm text-gray-500 leading-relaxed">
            Приносим жизнь в ваше пространство с помощью тщательно отобранных растений и товаров.
          </p>
        </div>
        <div>
          <h4 class="font-medium text-sm uppercase tracking-widest mb-4">Магазин</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><NuxtLink to="/shop" class="hover:text-primary">Все растения</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-primary">Новинки</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-primary">Распродажа</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-sm uppercase tracking-widest mb-4">Поддержка</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a href="#" class="hover:text-primary">FAQ</a></li>
            <li><a href="#" class="hover:text-primary">Контакты</a></li>
          </ul>
        </div>
      </div>
      <div class="container mx-auto px-4 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        &copy; 2026 The Green House. Все права защищены.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
import { ref, watch } from 'vue'
import { useAuthStore } from '~/stores/auth'
import { useCartStore } from '~/stores/cart'

const auth = useAuthStore()
const cartStore = useCartStore()

const router = useRouter()
const headerSearchQuery = ref('')

const triggerSearch = () => {
  if (headerSearchQuery.value.trim()) {
    router.push({ path: '/shop', query: { q: headerSearchQuery.value.trim() } })
    headerSearchQuery.value = ''
  }
}

// We need to react to auth state changes to fetch or clear the cart
watch(() => auth.user, (user) => {
  if (user) {
    cartStore.fetchCart()
  } else {
    cartStore.clearCart()
  }
}, { immediate: true })

</script>
