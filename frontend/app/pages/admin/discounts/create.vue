<script setup lang="ts">
import DiscountForm from '~/components/admin/DiscountForm.vue';

definePageMeta({
  layout: 'admin'
});

const config = useRuntimeConfig();
const router = useRouter();
const isSaving = ref(false);

const handleCreate = async (formData: any) => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/discounts`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    router.push('/admin/discounts');
  } catch (e) {
    alert('Failed to create discount: ' + e);
  } finally {
    isSaving.value = false;
  }
};
</script>

<template>
  <div>
    <div class="mb-8">
      <NuxtLink to="/admin/discounts" class="text-gray-500 hover:text-gray-900 mb-4 inline-block flex items-center gap-1">
        <Icon name="heroicons:arrow-left" /> Back to Discounts
      </NuxtLink>
      <h1 class="font-serif text-3xl text-primary font-bold">Add Discount</h1>
    </div>

    <div class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <DiscountForm :is-loading="isSaving" @submit="handleCreate" />
    </div>
  </div>
</template>
