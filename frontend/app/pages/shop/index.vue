<template>
  <div class="container mx-auto px-4 py-12">
    <div class="flex flex-col md:flex-row gap-12">
      <!-- Sidebar Filters -->
      <aside class="w-full md:w-64 space-y-8 flex-shrink-0 hidden md:block">
        <div>
          <h3 class="font-serif text-lg mb-4">Categories</h3>
          <ul class="space-y-3 text-sm text-gray-600">
            <li><button class="hover:text-primary transition-colors font-medium text-primary">All Plants ({{ displayProducts.length }})</button></li>
            <li><button class="hover:text-primary transition-colors">New Arrivals</button></li>
            <li><button class="hover:text-primary transition-colors">Large Plants</button></li>
            <li><button class="hover:text-primary transition-colors">Pet Friendly</button></li>
            <li><button class="hover:text-primary transition-colors">Low Light</button></li>
            <li><button class="hover:text-primary transition-colors">Pots & Planters</button></li>
          </ul>
        </div>
        
        <div>
           <h3 class="font-serif text-lg mb-4">Price</h3>
           <div class="space-y-4">
             <div class="flex items-center gap-2 text-sm text-gray-500">
                <span>$0</span>
                <input type="range" min="0" max="200" class="flex-grow h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer accent-primary">
                <span>$200+</span>
             </div>
           </div>
        </div>

        <div>
           <h3 class="font-serif text-lg mb-4">Availability</h3>
           <div class="space-y-2">
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input type="checkbox" checked class="rounded border-gray-300 text-primary focus:ring-primary">
               In Stock
             </label>
             <label class="flex items-center gap-2 text-sm text-gray-600 cursor-pointer hover:text-primary">
               <input type="checkbox" class="rounded border-gray-300 text-primary focus:ring-primary">
               Out of Stock
             </label>
           </div>
        </div>
      </aside>

      <!-- Product Grid -->
      <div class="flex-grow">
        <div class="flex justify-between items-center mb-8">
          <h1 class="text-3xl font-serif">All Plants</h1>
          <div class="flex items-center gap-4">
            <span class="text-sm text-gray-500 hidden sm:block">Showing {{ displayProducts.length }} products</span>
            <select class="border-gray-200 rounded-md text-sm focus:ring-primary focus:border-primary cursor-pointer py-2 pl-3 pr-8">
              <option>Sort by: Featured</option>
              <option>Price: Low to High</option>
              <option>Price: High to Low</option>
              <option>Newest Arrivals</option>
            </select>
          </div>
        </div>

        <div v-if="pending" class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          <div v-for="i in 6" :key="i" class="animate-pulse">
            <div class="bg-gray-100 aspect-[3/4] mb-4"></div>
            <div class="h-4 bg-gray-100 w-3/4 mb-2"></div>
            <div class="h-4 bg-gray-100 w-1/4"></div>
          </div>
        </div>

        <div v-else class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
          <div v-for="product in displayProducts" :key="product.id" class="group cursor-pointer">
            <NuxtLink :to="`/shop/${product.id}`">
              <div class="relative overflow-hidden aspect-[3/4] bg-[#f4f7f6] mb-4">
                <img 
                  :src="product.imageUrl" 
                  :alt="product.name"
                  class="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                />
                <!-- Badges -->
                <div v-if="product.isNew" class="absolute top-3 left-3 bg-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium">
                  New
                </div>
                <div v-if="product.isSale" class="absolute top-3 left-3 bg-accent text-white px-2 py-1 text-[10px] uppercase tracking-widest font-medium">
                  Sale
                </div>

                <!-- Quick Add Button -->
                <button class="absolute bottom-4 right-4 bg-white w-10 h-10 flex items-center justify-center rounded-full shadow-md hover:bg-primary hover:text-white transition-all opacity-0 group-hover:opacity-100 translate-y-4 group-hover:translate-y-0 duration-300">
                  <Icon name="lucide:shopping-bag" size="18" />
                </button>
              </div>
              
              <div class="space-y-1">
                <h3 class="font-serif text-lg leading-tight group-hover:text-primary transition-colors">{{ product.name }}</h3>
                <div class="flex items-center gap-2 text-sm">
                  <span :class="{'text-accent font-medium': product.salePrice, 'text-gray-500': !product.salePrice}">
                    ${{ product.salePrice || product.price }}
                  </span>
                  <span v-if="product.salePrice" class="text-gray-400 line-through text-xs">${{ product.price }}</span>
                </div>
              </div>
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const config = useRuntimeConfig()
const { data: realProducts, pending, error } = await useFetch(`${config.public.apiBase}/products`)

// Mock data to ensure the design looks good immediately
const mockProducts = [
  {
    id: 'mock-1',
    name: 'Monstera Deliciosa',
    price: 45.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: true
  },
  {
    id: 'mock-2',
    name: 'Fiddle Leaf Fig',
    price: 65.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isSale: false
  },
  {
    id: 'mock-3',
    name: 'Snake Plant Laurentii',
    price: 35.00,
    salePrice: 28.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isSale: true
  },
  {
    id: 'mock-4',
    name: 'Pilea Peperomioides',
    price: 25.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
    isNew: true
  },
  {
    id: 'mock-5',
    name: 'Peace Lily',
    price: 40.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  },
  {
    id: 'mock-6',
    name: 'Rubber Plant',
    price: 55.00,
    imageUrl: 'https://images.unsplash.com/photo-1459411552884-841db9b3cc2a?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80',
  }
]

// Use real products if available, otherwise fall back to mock data
const displayProducts = computed(() => {
  if (realProducts.value && realProducts.value.length > 0) {
    return realProducts.value
  }
  return mockProducts
})
</script>