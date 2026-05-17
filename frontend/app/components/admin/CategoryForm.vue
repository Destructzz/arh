<script setup lang="ts">
const props = defineProps<{
  initialData?: {
    name: string;
    parent?: { id: string } | null;
  };
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: { name: string; parentId?: string | null }): void;
}>();

const config = useRuntimeConfig();
const form = reactive({
  name: props.initialData?.name || '',
  parentId: props.initialData?.parent?.id || ''
});

// Fetch all categories for parent dropdown
const { data: categories } = await useFetch<any[]>(`${config.public.apiBase}/categories`, {
  credentials: 'include'
});

// Filter out current category if editing (to avoid circular dependency)
// This is a simple client-side check.
const availableParents = computed(() => {
  if (!categories.value) return [];
  // If we had the current ID passed in props, we could filter it out here.
  // For now, let's just list all.
  return categories.value;
});

const handleSubmit = () => {
  emit('submit', {
    name: form.name,
    parentId: form.parentId || null
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Название категории</label>
      <input 
        v-model="form.name"
        type="text" 
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        placeholder="например, Комнатные растения"
      />
    </div>

    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Родительская категория (необязательно)</label>
      <select 
        v-model="form.parentId"
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
      >
        <option value="">Нет (Верхний уровень)</option>
        <option v-for="cat in availableParents" :key="cat.id" :value="cat.id">
          {{ cat.name }}
        </option>
      </select>
      <p class="text-xs text-gray-500 mt-1">Выберите родительскую категорию, чтобы сделать эту категорию подкатегорией.</p>
    </div>

    <div class="pt-4">
      <button 
        type="submit" 
        :disabled="isLoading"
        class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        <span v-if="isLoading">Сохранение...</span>
        <span v-else>Сохранить категорию</span>
      </button>
    </div>
  </form>
</template>
