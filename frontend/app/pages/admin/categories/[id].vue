<script setup lang="ts">
import CategoryForm from '~/components/admin/CategoryForm.vue';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const isSaving = ref(false);

const { data: category, pending, error } = await useFetch<any>(`${config.public.apiBase}/categories/${route.params.id}`, {
  credentials: 'include'
});

const handleUpdate = async (formData: { name: string; parentId?: string | null }) => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/categories/${route.params.id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include'
    });
    router.push('/admin/categories');
  } catch (e) {
    alert('Не удалось обновить категорию: ' + e);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/categories" class="text-gray-500 hover:text-gray-900 mb-4 inline-block flex items-center gap-1">
        <Icon name="heroicons:arrow-left" /> Назад к категориям
      </NuxtLink>
      <h1 class="font-serif text-3xl text-primary font-bold">Редактировать категорию</h1>
    </div>

    <div v-if="pending" class="text-gray-500">Загрузка...</div>
    <div v-else-if="error" class="text-red-500">Ошибка при загрузке категории</div>
    
    <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <CategoryForm 
        :initial-data="category" 
        :is-loading="isSaving" 
        @submit="handleUpdate" 
      />
    </div>
  </div>
</template>
