<template>
  <div>
    <!-- Hero Section -->
    <section class="relative bg-[#f4f7f6] h-[600px] flex items-center">
      <div class="container mx-auto px-4 grid grid-cols-1 md:grid-cols-2 gap-8 items-center h-full">
        <div class="order-2 md:order-1 space-y-6">
          <h1 class="text-5xl md:text-7xl font-serif leading-tight text-gray-900">
            Bring Nature <br/> <span class="text-primary">Indoors.</span>
          </h1>
          <p class="text-lg text-gray-600 max-w-md">
            Discover our curated collection of easy-care plants that thrive in your home.
          </p>
          <div class="flex gap-4">
            <NuxtLink to="/shop" class="inline-block bg-primary text-white px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-opacity-90 transition-all">
              Shop Plants
            </NuxtLink>
            <NuxtLink to="/cart" class="inline-block bg-transparent border-2 border-primary text-primary px-8 py-4 text-sm font-medium uppercase tracking-widest hover:bg-primary hover:text-white transition-all">
              Go to Cart
            </NuxtLink>
          </div>
        </div>
        <div class="order-1 md:order-2 h-full relative overflow-hidden">
           <img 
            src="https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
            alt="Beautiful Plant" 
            class="absolute inset-0 w-full h-full object-cover"
          />
        </div>
      </div>
    </section>

    <!-- Categories -->
    <section class="py-20 bg-white">
      <div class="container mx-auto px-4">
        <h2 class="text-3xl font-serif text-center mb-12">Shop by Category</h2>
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div v-for="cat in categories" :key="cat.name" class="group cursor-pointer">
            <div class="relative overflow-hidden aspect-[3/4] mb-4">
              <img :src="cat.image" :alt="cat.name" class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </div>
            <h3 class="text-xl font-serif mb-1">{{ cat.name }}</h3>
            <span class="text-sm text-gray-500 group-hover:text-primary transition-colors flex items-center gap-1">
              Shop Now <Icon name="lucide:arrow-right" size="14" />
            </span>
          </div>
        </div>
      </div>
    </section>

    <!-- Featured Products (Mockup) -->
    <section class="py-20 bg-[#f9f9f9]">
      <div class="container mx-auto px-4">
         <div class="flex justify-between items-end mb-12">
            <h2 class="text-3xl font-serif">Best Sellers</h2>
            <NuxtLink to="/shop" class="text-sm border-b border-gray-900 pb-1 hover:text-primary hover:border-primary transition-colors">View All</NuxtLink>
         </div>
         
         <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
           <div v-for="i in 4" :key="i" class="group">
             <div class="relative aspect-square bg-white mb-4 overflow-hidden">
                <img :src="`https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80`" class="w-full h-full object-cover group-hover:opacity-90 transition-opacity" />
                <button class="absolute bottom-4 right-4 bg-white p-2 rounded-full shadow-md hover:bg-primary hover:text-white transition-colors opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 duration-300">
                  <Icon name="lucide:plus" size="20" />
                </button>
             </div>
             <h3 class="font-medium text-lg mb-1">Monstera Deliciosa</h3>
             <p class="text-gray-500 text-sm">$45.00</p>
           </div>
         </div>
      </div>
    </section>
  </div>
</template>

<script setup>
const categories = [
  { name: 'Live Plants', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Pots & Planters', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
  { name: 'Plant Care', image: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80' },
]
</script>
