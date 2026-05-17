<script setup lang="ts">
import { ref, computed } from 'vue';

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const { data: inventoryItems, refresh, error, pending } = await useFetch<any[]>(`${config.public.apiBase}/inventory-items`, {
  credentials: 'include'
});

const searchQuery = ref('');

const filteredItems = computed(() => {
  if (!inventoryItems.value) return [];
  if (!searchQuery.value) return inventoryItems.value;
  const q = searchQuery.value.toLowerCase();
  return inventoryItems.value.filter(item => item.product?.name?.toLowerCase().includes(q));
});

const updateStates = ref<Record<string, {
  exactQty: number | null,
  addQty: number | null,
  exactReserve: number | null,
  addReserve: number | null
}>>({});

const getUpdateState = (id: string) => {
  if (!updateStates.value[id]) {
    updateStates.value[id] = {
      exactQty: null,
      addQty: null,
      exactReserve: null,
      addReserve: null
    };
  }
  return updateStates.value[id];
};

const isUpdating = ref<string | null>(null);

const updateInventoryItem = async (id: string, body: { quantityOnHand?: number, reserved?: number }) => {
  isUpdating.value = id;
  try {
    await $fetch(`${config.public.apiBase}/inventory-items/${id}`, {
      method: 'PATCH',
      credentials: 'include',
      body
    });
    if (updateStates.value[id]) {
      updateStates.value[id].exactQty = null;
      updateStates.value[id].addQty = null;
      updateStates.value[id].exactReserve = null;
      updateStates.value[id].addReserve = null;
    }
    refresh();
  } catch (e: any) {
    alert('Не удалось обновить остатки: ' + e.message);
  } finally {
    isUpdating.value = null;
  }
};

const submitExactQty = (id: string) => {
  const state = getUpdateState(id);
  if (state.exactQty !== null && state.exactQty !== undefined && state.exactQty >= 0) {
    updateInventoryItem(id, { quantityOnHand: state.exactQty });
  }
};

const submitAddQty = (id: string, currentVal: number) => {
  const state = getUpdateState(id);
  if (state.addQty !== null && state.addQty !== undefined && state.addQty !== 0) {
    updateInventoryItem(id, { quantityOnHand: currentVal + state.addQty });
  }
};

const submitExactReserve = (id: string) => {
  const state = getUpdateState(id);
  if (state.exactReserve !== null && state.exactReserve !== undefined && state.exactReserve >= 0) {
    updateInventoryItem(id, { reserved: state.exactReserve });
  }
};

const submitAddReserve = (id: string, currentVal: number) => {
  const state = getUpdateState(id);
  if (state.addReserve !== null && state.addReserve !== undefined && state.addReserve !== 0) {
    updateInventoryItem(id, { reserved: currentVal + state.addReserve });
  }
};
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="font-serif text-3xl text-primary font-bold">Склад</h1>
        <p class="text-gray-600 mt-1">Управление остатками товаров (Inventory)</p>
      </div>
      <div class="relative">
        <Icon name="heroicons:magnifying-glass" class="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size="20" />
        <input 
          v-model="searchQuery" 
          type="text" 
          placeholder="Поиск по названию..." 
          class="pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary outline-none w-64"
        >
      </div>
    </div>

    <div v-if="error" class="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-100">
      Ошибка загрузки склада: {{ error.message }}
    </div>

    <div class="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
      <table class="w-full text-left border-collapse">
        <thead class="bg-gray-50 border-b border-gray-100 text-xs uppercase text-gray-500 font-semibold tracking-wider">
          <tr>
            <th class="px-6 py-4">Товар</th>
            <th class="px-6 py-4">В наличии</th>
            <th class="px-6 py-4">В резерве</th>
            <th class="px-6 py-4 text-right">Обновлено</th>
          </tr>
        </thead>
        <tbody class="divide-y divide-gray-100">
          <tr v-if="pending" class="text-center">
            <td colspan="4" class="px-6 py-8 text-gray-500 animate-pulse">Загрузка...</td>
          </tr>
          <tr v-else-if="!filteredItems.length" class="text-center text-gray-500">
            <td colspan="4" class="px-6 py-8">Товары не найдены.</td>
          </tr>
          
          <tr v-for="item in filteredItems" :key="item.id" class="hover:bg-gray-50/50 transition-colors group">
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden flex-shrink-0 border border-gray-200">
                  <img 
                    v-if="item.product?.imageUrl" 
                    :src="item.product.imageUrl" 
                    class="w-full h-full object-cover" 
                    alt="Product"
                  />
                  <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                    <Icon name="heroicons:photo" size="24" />
                  </div>
                </div>
                <div class="font-medium text-gray-900">{{ item.product?.name || 'Неизвестный товар' }}</div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-12 font-bold text-xl text-gray-900">{{ item.quantityOnHand }}</div>
                
                <div class="flex flex-col gap-2">
                  <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <input 
                      v-model.number="getUpdateState(item.id).exactQty" 
                      type="number" 
                      min="0"
                      class="w-24 px-2 py-1.5 text-sm outline-none" 
                      placeholder="Точное шт."
                      :disabled="isUpdating === item.id"
                    />
                    <button 
                      @click="submitExactQty(item.id)" 
                      class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium border-l border-gray-200 text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isUpdating === item.id || getUpdateState(item.id).exactQty === null"
                    >
                      <Icon v-if="isUpdating === item.id" name="lucide:loader-2" class="animate-spin" size="16" />
                      <span v-else>Ок</span>
                    </button>
                  </div>
                  
                  <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <input 
                      v-model.number="getUpdateState(item.id).addQty" 
                      type="number" 
                      class="w-24 px-2 py-1.5 text-sm outline-none" 
                      placeholder="+/- шт."
                      :disabled="isUpdating === item.id"
                    />
                    <button 
                      @click="submitAddQty(item.id, item.quantityOnHand)" 
                      class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium border-l border-gray-200 text-primary transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isUpdating === item.id || getUpdateState(item.id).addQty === null || getUpdateState(item.id).addQty === 0"
                    >
                      <Icon v-if="isUpdating === item.id" name="lucide:loader-2" class="animate-spin" size="16" />
                      <span v-else>Добавить</span>
                    </button>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4">
              <div class="flex items-center gap-4">
                <div class="w-12 font-bold text-xl text-orange-600">{{ item.reserved }}</div>
                
                <div class="flex flex-col gap-2">
                  <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <input 
                      v-model.number="getUpdateState(item.id).exactReserve" 
                      type="number" 
                      min="0"
                      class="w-24 px-2 py-1.5 text-sm outline-none" 
                      placeholder="Точное шт."
                      :disabled="isUpdating === item.id"
                    />
                    <button 
                      @click="submitExactReserve(item.id)" 
                      class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium border-l border-gray-200 text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isUpdating === item.id || getUpdateState(item.id).exactReserve === null"
                    >
                      <Icon v-if="isUpdating === item.id" name="lucide:loader-2" class="animate-spin" size="16" />
                      <span v-else>Ок</span>
                    </button>
                  </div>
                  
                  <div class="flex items-center border border-gray-200 rounded-md overflow-hidden bg-white shadow-sm">
                    <input 
                      v-model.number="getUpdateState(item.id).addReserve" 
                      type="number" 
                      class="w-24 px-2 py-1.5 text-sm outline-none" 
                      placeholder="+/- шт."
                      :disabled="isUpdating === item.id"
                    />
                    <button 
                      @click="submitAddReserve(item.id, item.reserved)" 
                      class="px-3 py-1.5 bg-gray-50 hover:bg-gray-100 text-sm font-medium border-l border-gray-200 text-orange-600 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                      :disabled="isUpdating === item.id || getUpdateState(item.id).addReserve === null || getUpdateState(item.id).addReserve === 0"
                    >
                      <Icon v-if="isUpdating === item.id" name="lucide:loader-2" class="animate-spin" size="16" />
                      <span v-else>Добавить</span>
                    </button>
                  </div>
                </div>
              </div>
            </td>
            <td class="px-6 py-4 text-right text-sm text-gray-500">
              {{ new Date(item.updatedAt).toLocaleString('ru-RU', { dateStyle: 'short', timeStyle: 'short' }) }}
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </div>
</template>
