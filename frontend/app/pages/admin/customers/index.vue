<script setup lang="ts">
definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: customers, error } = await useFetch<any[]>(`${config.public.apiBase}/customers`, {
  credentials: 'include'
});
</script>

<template>
  <div>
    <div class="flex items-center justify-between mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Клиенты</h1>
        <p class="text-gray-600 mt-1">Просмотр базы данных клиентов</p>
      </div>
      <!-- 
      <NuxtLink 
        to="/admin/customers/create"
        class="bg-primary text-white px-6 py-2.5 rounded-lg hover:bg-primary/90 transition-colors font-medium flex items-center gap-2"
      >
        <Icon name="heroicons:plus" size="20" />
        Add Customer
      </NuxtLink> 
      -->
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Не удалось загрузить клиентов: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Имя</th>
            <th class="px-6 py-4">Контакты</th>
            <th class="px-6 py-4">Заметки</th>
            <th class="px-6 py-4">Зарегистрирован</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="!customers?.length" class="text-center text-gray-500">
            <td colspan="4" class="px-6 py-8">Клиенты не найдены.</td>
          </tr>
          
          <tr v-for="customer in customers" :key="customer.id" class="hover:bg-gray-50/50 transition-colors">
            <td class="px-6 py-4 font-medium text-gray-900">{{ customer.name }}</td>
            <td class="px-6 py-4 text-gray-600 text-sm">
              <div v-if="customer.email" class="flex items-center gap-2">
                <Icon name="heroicons:envelope" size="14" class="text-gray-400" />
                {{ customer.email }}
              </div>
              <div v-if="customer.phone" class="flex items-center gap-2 mt-1">
                <Icon name="heroicons:phone" size="14" class="text-gray-400" />
                {{ customer.phone }}
              </div>
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm italic">
              {{ customer.notes || '-' }}
            </td>
            <td class="px-6 py-4 text-gray-500 text-sm">
              {{ new Date(customer.createdAt).toLocaleDateString() }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
