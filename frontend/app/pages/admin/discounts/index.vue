<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: discounts, refresh, error } = await useFetch<any[]>(`${config.public.apiBase}/discounts`, {
  credentials: 'include'
});

const handleDelete = async (id: string) => {
  if (!confirm('Are you sure you want to delete this discount?')) return;
  
  try {
    await $fetch(`${config.public.apiBase}/discounts/${id}`, {
      method: 'DELETE',
      credentials: 'include'
    });
    refresh();
  } catch (e) {
    alert('Failed to delete discount.');
  }
};
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Discounts</h1>
        <p class="text-gray-600 mt-1">Manage promo codes</p>
      </div>
      <NuxtLink 
        to="/admin/discounts/create"
        class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="heroicons:plus" size="20" />
        Add Discount
      </NuxtLink>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Failed to load discounts: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Code</th>
            <th class="px-6 py-4">Value</th>
            <th class="px-6 py-4">Validity</th>
            <th class="px-6 py-4">Status</th>
            <th class="px-6 py-4 text-right">Actions</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="!discounts?.length" class="text-center text-gray-500">
            <td colspan="5" class="px-6 py-8">No discounts found.</td>
          </tr>
          
          <tr v-for="discount in discounts" :key="discount.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4 font-mono font-medium text-gray-900 tracking-wide">{{ discount.code }}</td>
            <td class="px-6 py-4 text-gray-700">
              {{ discount.type === 'percent' ? `${discount.value}%` : `$${discount.value}` }}
            </td>
            <td class="px-6 py-4 text-sm text-gray-500">
              <div v-if="discount.startsAt">From: {{ new Date(discount.startsAt).toLocaleDateString() }}</div>
              <div v-if="discount.endsAt">To: {{ new Date(discount.endsAt).toLocaleDateString() }}</div>
              <div v-if="!discount.startsAt && !discount.endsAt">Always valid</div>
            </td>
            <td class="px-6 py-4">
              <span 
                :class="discount.isActive ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'"
                class="px-2 py-1 rounded-full text-xs font-medium"
              >
                {{ discount.isActive ? 'Active' : 'Inactive' }}
              </span>
            </td>
            <td class="px-6 py-4 text-right space-x-2">
              <NuxtLink 
                :to="`/admin/discounts/${discount.id}`"
                class="text-indigo-600 hover:text-indigo-800 font-medium text-sm inline-flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity"
              >
                <Icon name="heroicons:pencil-square" size="16" />
                Edit
              </NuxtLink>
              <button 
                @click="handleDelete(discount.id)"
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
