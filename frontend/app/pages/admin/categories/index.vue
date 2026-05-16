<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: categories, refresh, error } = await useFetch<any[]>(`${config.public.apiBase}/categories`, {
  credentials: 'include' // Important for cookies
});

const handleDelete = async (id: string) => {
  if (!confirm('Вы уверены, что хотите удалить эту категорию?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    refresh(); // Reload list
  } catch (e) {
    alert('Не удалось удалить категорию. Возможно, в ней есть товары.');
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Категории</h1>
        <p class="text-gray-600 mt-1">Управление категориями товаров</p>
      </div>
      <NuxtLink 
        to="/admin/categories/create"
        class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="heroicons:plus" size="20" />
        Добавить категорию
      </NuxtLink>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Ошибка загрузки категорий: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Название</th>
            <th class="px-6 py-4">Родительская категория</th>
            <th class="px-6 py-4">Создано</th>
            <th class="px-6 py-4 text-right">Действия</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="!categories?.length" class="text-center text-gray-500">
            <td colspan="4" class="px-6 py-8">Категории не найдены.</td>
          </tr>
          
          <tr v-for="category in categories" :key="category.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4 font-medium text-gray-900">{{ category.name }}</td>
            <td class="px-6 py-4 text-gray-500">
              <span v-if="category.parent" class="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs">
                {{ category.parent.name }}
              </span>
              <span v-else class="text-gray-300">-</span>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">
              {{ new Date(category.createdAt).toLocaleDateString('ru-RU') }}
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <NuxtLink 
                :to="`/admin/categories/${category.id}`"
                class="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:pencil-square" size="16" />
                Редактировать
              </NuxtLink>
              <button 
                @click="handleDelete(category.id)"
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
