<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: categories, refresh, error } = await useFetch<any[]>(`${config.public.apiBase}/categories`, {
  credentials: 'include' // Important for cookies
});

// Helper to flatten tree for display or just show top level? 
// The API says "returns list with parents and children". 
// Let's assume it returns a flat list or we need to traverse.
// Inspecting the controller: `findAll` -> `categoriesService.findAll`. 
// Usually TypeORM `find` returns flat unless `treeRepository` is used.
// If it returns flat list, we can just display it.

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this category?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/categories/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    refresh(); // Reload list
  } catch (e) {
    alert('Failed to delete category. It might have related products.');
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Categories</h1>
        <p class="text-gray-600 mt-1">Manage product categories</p>
      </div>
      <NuxtLink 
        to="/admin/categories/create"
        class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="heroicons:plus" size="20" />
        Add Category
      </NuxtLink>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Failed to load categories: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Name</th>
            <th class="px-6 py-4">Parent Category</th>
            <th class="px-6 py-4">Created At</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="!categories?.length" class="text-center text-gray-500">
            <td colspan="4" class="px-6 py-8">No categories found.</td>
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
              {{ new Date(category.createdAt).toLocaleDateString() }}
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <NuxtLink 
                :to="`/admin/categories/${category.id}`"
                class="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:pencil-square" size="16" />
                Edit
              </NuxtLink>
              <button 
                @click="handleDelete(category.id)"
                class="text-red-600 hover:text-red-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:trash" size="16" />
                Delete
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
