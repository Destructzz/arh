<script setup lang="ts">
import CategoryForm from '~/components/admin/CategoryForm.vue';

definePageMeta({
  layout: 'admin'
});

const config = useRuntimeConfig();
const router = useRouter();
const isSaving = ref(false);

const handleCreate = async (formData: { name: string; parentId?: string | null }) => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/categories`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    router.push('/admin/categories');
  } catch (e) {
    alert('Не удалось создать категорию: ' + e);
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
      <h1 class="font-serif text-3xl text-primary font-bold">Создать категорию</h1>
    </div>

    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <CategoryForm :is-loading="isSaving" @submit="handleCreate" />
    </div>
  </div>
</template>
