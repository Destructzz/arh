<script setup lang="ts">
import ProductForm from '~/components/admin/ProductForm.vue';

definePageMeta({
  layout: 'admin'
});

const config = useRuntimeConfig();
const router = useRouter();
const isSaving = ref(false);

const handleCreate = async (formData: any) => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/products`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    router.push('/admin/products');
  } catch (e) {
    alert('Failed to create product: ' + e);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/products" class="text-gray-500 hover:text-gray-900 mb-4 inline-block flex items-center gap-1">
        <Icon name="heroicons:arrow-left" /> Back to Products
      </NuxtLink>
      <h1 class="font-serif text-3xl text-primary font-bold">Add New Product</h1>
    </div>

    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <ProductForm :is-loading="isSaving" @submit="handleCreate" />
    </div>
  </div>
</template>
