<template>
  <div class="flex flex-col min-h-screen text-gray-900 font-sans">
    <!-- Announcement Bar -->
    <div class="bg-primary text-white text-center py-2 text-xs uppercase tracking-widest font-medium">
      Free Shipping on Orders Over $75
    </div>

    <!-- Header -->
    <header class="sticky top-0 z-50 bg-white border-b border-gray-100">
      <div class="container mx-auto px-4 h-20 flex items-center justify-between">
        <!-- Mobile Menu (Hidden on Desktop) -->
        <button class="lg:hidden p-2">
          <Icon name="lucide:menu" size="24" />
        </button>

        <!-- Logo -->
        <NuxtLink to="/" class="text-2xl font-serif font-bold tracking-tight">
          The Green House
        </NuxtLink>

        <!-- Desktop Nav -->
        <nav class="hidden lg:flex items-center space-x-8 text-sm font-medium tracking-wide">
          <NuxtLink to="/shop" class="hover:text-primary transition-colors">Shop All</NuxtLink>
          <NuxtLink to="/shop?category=plants" class="hover:text-primary transition-colors">Plants</NuxtLink>
          <NuxtLink to="/shop?category=care" class="hover:text-primary transition-colors">Plant Care</NuxtLink>
          <NuxtLink to="/about" class="hover:text-primary transition-colors">About</NuxtLink>
        </nav>

        <!-- Icons -->
        <div class="flex items-center space-x-6">
          <button class="hover:text-primary transition-colors">
            <Icon name="lucide:search" size="20" />
          </button>
          
          <NuxtLink to="/auth/login" class="hover:text-primary transition-colors">
             <Icon name="lucide:user" size="20" />
          </NuxtLink>

          <button class="hover:text-primary transition-colors relative">
            <Icon name="lucide:shopping-bag" size="20" />
            <span class="absolute -top-1 -right-2 bg-primary text-white text-[10px] w-4 h-4 rounded-full flex items-center justify-center">0</span>
          </button>
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
          <h3 class="font-serif text-lg mb-4">The Green House</h3>
          <p class="text-sm text-gray-500 leading-relaxed">
            Bringing life to your space with carefully curated plants and goods.
          </p>
        </div>
        <div>
          <h4 class="font-medium text-sm uppercase tracking-widest mb-4">Shop</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><NuxtLink to="/shop" class="hover:text-primary">All Plants</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-primary">New Arrivals</NuxtLink></li>
            <li><NuxtLink to="/shop" class="hover:text-primary">Sale</NuxtLink></li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-sm uppercase tracking-widest mb-4">Support</h4>
          <ul class="space-y-2 text-sm text-gray-500">
            <li><a href="#" class="hover:text-primary">FAQ</a></li>
            <li><a href="#" class="hover:text-primary">Shipping & Returns</a></li>
            <li><a href="#" class="hover:text-primary">Contact Us</a></li>
          </ul>
        </div>
        <div>
          <h4 class="font-medium text-sm uppercase tracking-widest mb-4">Stay in the loop</h4>
          <div class="flex">
            <input type="email" placeholder="Email Address" class="bg-white border border-gray-300 px-4 py-2 w-full focus:outline-none focus:border-primary text-sm" />
            <button class="bg-primary text-white px-4 py-2 text-sm uppercase tracking-wider">Join</button>
          </div>
        </div>
      </div>
      <div class="container mx-auto px-4 pt-8 border-t border-gray-200 text-center text-xs text-gray-400">
        &copy; 2026 The Green House. All rights reserved.
      </div>
    </footer>
  </div>
</template>

<script setup lang="ts">
// Logic for cart count / user state can go here
</script>
