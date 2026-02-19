<script setup lang="ts">
const props = defineProps<{
  initialData?: {
    code: string;
    type: 'percent' | 'fixed';
    value: number;
    startsAt?: string | null;
    endsAt?: string | null;
    isActive: boolean;
  };
  isLoading?: boolean;
}>();

const emit = defineEmits<{
  (e: 'submit', data: any): void;
}>();

const form = reactive({
  code: props.initialData?.code || '',
  type: props.initialData?.type || 'percent',
  value: props.initialData?.value || 0,
  startsAt: props.initialData?.startsAt ? props.initialData.startsAt.slice(0, 16) : '', // Format for datetime-local
  endsAt: props.initialData?.endsAt ? props.initialData.endsAt.slice(0, 16) : '',
  isActive: props.initialData?.isActive ?? true,
});

const handleSubmit = () => {
  emit('submit', {
    code: form.code,
    type: form.type,
    value: Number(form.value),
    startsAt: form.startsAt ? new Date(form.startsAt).toISOString() : null,
    endsAt: form.endsAt ? new Date(form.endsAt).toISOString() : null,
    isActive: form.isActive,
  });
};
</script>

<template>
  <form @submit.prevent="handleSubmit" class="space-y-6 max-w-2xl">
    <div>
      <label class="block text-sm font-medium text-gray-700 mb-1">Discount Code</label>
      <input 
        v-model="form.code"
        type="text" 
        required
        class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all uppercase tracking-wide"
        placeholder="SUMMER2024"
      />
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Type</label>
        <select 
          v-model="form.type"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all bg-white"
        >
          <option value="percent">Percentage (%)</option>
          <option value="fixed">Fixed Amount ($)</option>
        </select>
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Value</label>
        <input 
          v-model="form.value"
          type="number" 
          required
          min="0"
          :max="form.type === 'percent' ? 100 : undefined"
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </div>
    </div>

    <div class="grid grid-cols-2 gap-6">
      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Starts At (Optional)</label>
        <input 
          v-model="form.startsAt"
          type="datetime-local" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </div>

      <div>
        <label class="block text-sm font-medium text-gray-700 mb-1">Ends At (Optional)</label>
        <input 
          v-model="form.endsAt"
          type="datetime-local" 
          class="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none transition-all"
        />
      </div>
    </div>

    <div class="flex items-center gap-2 pt-2">
      <input 
        v-model="form.isActive"
        type="checkbox" 
        id="isActive"
        class="w-4 h-4 text-primary border-gray-300 rounded focus:ring-primary"
      />
      <label for="isActive" class="text-sm font-medium text-gray-700 select-none">Active</label>
    </div>

    <div class="pt-4">
      <button 
        type="submit" 
        :disabled="isLoading"
        class="bg-primary text-white px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors font-medium disabled:opacity-70 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
      >
        <span v-if="isLoading">Saving...</span>
        <span v-else>Save Discount</span>
      </button>
    </div>
  </form>
</template>
