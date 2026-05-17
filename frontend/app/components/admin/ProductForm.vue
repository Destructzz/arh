<script setup lang="ts">
import { ref, reactive } from 'vue';

const props = defineProps<{
  initialData?: {
    name: string;
    description?: string;
    price: number;
    costPrice?: number;
    category?: { id: string };
    imageUrl?: string;
    isActive: boolean;
    quantityOnHand?: number;
  };
  isLoading?: boolean;
  isCreate?: boolean;
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
  quantityOnHand: props.initialData?.quantityOnHand ?? 0,
});

// Fetch categories for dropdown
const { data: categories } = await useFetch<any[]>(`${config.public.apiBase}/categories`, {
  credentials: 'include'
});

const isUploading = ref(false);
const fileInput = ref<HTMLInputElement | null>(null);

const handleFileUpload = async (event: Event) => {
  const target = event.target as HTMLInputElement;
  if (!target.files || target.files.length === 0) return;
  const file = target.files[0];
  if (!file) return;
  
  isUploading.value = true;
  const formData = new FormData();
  formData.append('file', file);
  
  try {
    const data = await $fetch<{ url: string }>(`${config.public.apiBase}/uploads`, {
      method: 'POST',
      body: formData,
      credentials: 'include'
    });
    
    const host = config.public.apiBase.replace(/\/api\/?$/, '');
    form.imageUrl = host + data.url;
  } catch (err: any) {
    alert('Ошибка загрузки изображения: ' + err.message);
  } finally {
    isUploading.value = false;
    if (fileInput.value) fileInput.value.value = '';
  }
};

const handleSubmit = () => {
  emit('submit', {
    name: form.name,
    description: form.description || null,
    price: Number(form.price),
    costPrice: Number(form.costPrice),
    categoryId: form.categoryId || null,
    imageUrl: form.imageUrl || null,
    isActive: form.isActive,
    quantityOnHand: Number(form.quantityOnHand),
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

        <div v-if="isCreate">
          <label class="block text-sm font-medium text-gray-700 mb-1">Начальный остаток на складе (шт)</label>
          <input 
            v-model="form.quantityOnHand"
            type="number" 
            min="0"
            class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-blue-50/30"
            placeholder="0"
          />
        </div>

        <div>
          <label class="block text-sm font-medium text-gray-700 mb-1">Изображение товара</label>
          <div class="flex gap-2 mb-2">
            <input 
              v-model="form.imageUrl"
              type="url" 
              class="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all text-sm"
              placeholder="Вставьте ссылку https://..."
            />
            <div class="relative">
              <input 
                type="file" 
                ref="fileInput"
                accept="image/*"
                @change="handleFileUpload"
                class="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                :disabled="isUploading"
              />
              <button 
                type="button"
                class="px-4 py-2 bg-gray-100 hover:bg-gray-200 text-gray-700 text-sm font-medium rounded-lg border border-gray-300 transition-colors flex items-center gap-2 whitespace-nowrap"
                :class="{ 'opacity-50 cursor-not-allowed': isUploading }"
              >
                <Icon v-if="isUploading" name="lucide:loader-2" class="animate-spin" size="16" />
                <Icon v-else name="lucide:upload" size="16" />
                <span>Загрузить</span>
              </button>
            </div>
          </div>
          <div v-if="form.imageUrl" class="mt-4 border border-gray-200 rounded-lg overflow-hidden h-40 bg-gray-50 flex items-center justify-center relative group">
            <img :src="form.imageUrl" class="h-full w-full object-contain" />
            <div class="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
              <button @click.prevent="form.imageUrl = ''" class="text-white bg-red-500 hover:bg-red-600 px-3 py-1.5 rounded text-sm font-medium">Удалить</button>
            </div>
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
