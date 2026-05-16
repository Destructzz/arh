<script setup lang="ts">
const props = defineProps<{
  initialData?: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    category?: { id: string };
    imageUrl?: string;
    isActive: boolean;
  };
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: any): void;
}>();

const config = useRuntimeConfig();

const form = reactive({
  name: props.initialData?.name || '',
  description: props.initialData?.description || '',
  price: props.initialData?.price || 0,
  costPrice: props.initialData?.costPrice || 0,
  categoryId: props.initialData?.category?.id || '',
  imageUrl: props.initialData?.imageUrl || '',
  isActive: props.initialData?.isActive ?? true,
});

// Fetch categories for dropdown
const { data: categories } = await useFetch<any[]>(`${config.public.apiBase}/categories`, {
  credentials: 'include'
});

const handleSubmit = () => {
  emit('submit', {
    name: form.name,
    description: form.description || null,
    price: Number(form.price),
    costPrice: Number(form.costPrice),
    categoryId: form.categoryId || null,
    imageUrl: form.imageUrl || null,
    isActive: form.isActive,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="max-w-4xl space-y-8">
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
      <!-- Left Column: Main Info -->
      <div class="space-y-6">
        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Название товара</label>
          <input 
            v-model="form.name"
            type="text" 
            required
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="например, Монстера Делициоза"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Описание</label>
          <textarea 
            v-model="form.description"
            rows="4"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all resize-none"
            placeholder="Детали товара..."
          ></textarea>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Категория</label>
          <select 
            v-model="form.categoryId"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
          >
            <option value="">Выберите категорию</option>
            <option v-for="cat in categories" :key="cat.id" :value="cat.id">
              {{ cat.name }}
            </option>
          </select>
        </div>
      </div>

      <!-- Right Column: Pricing & Media -->
      <div class="space-y-6">
        <div class="grid grid-cols-2 gap-4">
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Цена (₽)</label>
            <input 
              v-model="form.price"
              type="number" 
              step="0.01"
              required
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
          <div>
            <label class="block text-sm font-medium text-gray-700 mb-1">Себестоимость (₽)</label>
            <input 
              v-model="form.costPrice"
              type="number" 
              step="0.01"
              class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            />
          </div>
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Ссылка на изображение</label>
          <input 
            v-model="form.imageUrl"
            type="url" 
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
            placeholder="https://..."
          />
          <div v-if="form.imageUrl" class="mt-4 border border-gray-200 rounded-lg overflow-hidden h-40 bg-gray-50 flex items-center justify-center">
            <img :src="form.imageUrl" class="h-full w-full object-contain" />
          </div>
        </div>

        <div class="flex items-center gap-2 pt-2">
          <input 
            v-model="form.isActive"
            type="checkbox" 
            id="isActive"
            class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
          />
          <label for="isActive" class="text-sm font-medium text-gray-700 select-none">Активен (Виден в магазине)</label>
        </div>
      </div>
    </div>

    <div class="pt-6 border-t border-gray-100">
      <button 
        type="submit" 
        :disabled="isLoading"
        class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        <span v-if="isLoading">Сохранение...</span>
        <span v-else>Сохранить товар</span>
      </button>
    </div>
  </form>
</template>
