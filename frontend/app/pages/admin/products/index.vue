<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: products, refresh, error } = await useFetch<any[]>(`${config.public.apiBase}/products`, {
  credentials: 'include'
});

const handleDelete = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить этот товар?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/products/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    refresh();
  } catch (e) {
    alert('Не удалось удалить товар.');
  }
};

const formatPrice = (price: number) => {
  return new Intl.NumberFormat('ru-RU', { style: 'currency', currency: 'RUB' }).format(price);
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Товары</h1>
        <p class="text-gray-600 mt-1">Управление вашим каталогом</p>
      </div>
      <NuxtLink 
        to="/admin/products/create"
        class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="heroicons:plus" size="20" />
        Добавить товар
      </NuxtLink>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Ошибка загрузки товаров: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Товар</th>
            <th class="px-6 py-4">Категория</th>
            <th class="px-6 py-4">Цена</th>
            <th class="px-6 py-4">Статус</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="!products?.length" class="text-center text-gray-500">
            <td colspan="5" class="px-6 py-8">Товары не найдены.</td>
          </tr>
          
          <tr v-for="product in products" :key="product.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img 
                    v-if="product.imageUrl" 
                    :src="product.imageUrl" 
                    class="w-full h-full object-cover" 
                    alt="Product"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <Icon name="heroicons:photo" size="24" />
                  </div>
                </div>
                <div>
                  <div class="font-medium text-gray-900">{{ product.name }}</div>
                  <div class="text-xs text-gray-500 truncate max-w-[200px]">{{ product.description }}</div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-gray-500">
              <span v-if="product.category" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {{ product.category.name }}
              </span>
              <span v-else class="text-gray-300">-</span>
            </td>
            <td class="px-6 py-4 font-medium text-gray-900">
              {{ formatPrice(product.price) }}
            </td>
            <td class="px-6 py-4">
              <span 
                :class="product.isActive ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ product.isActive ? 'Активен' : 'Черновик' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <NuxtLink 
                :to="`/admin/products/${product.id}`"
                class="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:pencil-square" size="16" />
                Редактировать
              </NuxtLink>
              <button 
                @click="handleDelete(product.id)"
                class="text-red-600 hover:text-red-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:trash" size="16" />
                Удалить
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
