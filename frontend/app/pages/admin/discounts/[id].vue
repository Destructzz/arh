<script setup lang="ts">
import DiscountForm from '~/components/admin/DiscountForm.vue';

definePageMeta({
  layout: 'admin'
});

const route = useRoute();
const router = useRouter();
const config = useRuntimeConfig();
const isSaving = ref(false);

const { data: discount, pending, error } = await useFetch<any>(`${config.public.apiBase}/discounts/${route.params.id}`, {
  credentials: 'include'
});

const handleUpdate = async (formData: any) => {
  isSaving.value = true;
  try {
    await $fetch(`${config.public.apiBase}/discounts/${route.params.id}`, {
      method: 'PATCH',
      body: formData,
      credentials: 'include'
    });
    router.push('/admin/discounts');
  } catch (e) {
    alert('Failed to update discount: ' + e);
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
      <h1 class="font-serif text-3xl text-primary font-bold">Edit Discount</h1>
    </div>

    <div v-if="pending" class="text-gray-500">Loading...</div>
    <div v-else-if="error" class="text-red-500">Error loading discount</div>
    
    <div v-else class="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
      <DiscountForm 
        :initial-data="discount" 
        :is-loading="isSaving" 
        @submit="handleUpdate" 
      />
    </div>
  </div>
</template>
