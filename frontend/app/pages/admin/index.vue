<script setup lang="ts">
import { computed } from 'vue';

definePageMeta({
  layout: 'admin',
});

const config = useRuntimeConfig();
const headers = useRequestHeaders(['cookie']) as Record<string, string>;

// Live fetching statistics
const { data: orders, pending: ordersPending } = await useFetch<any[]>(`${config.public.apiBase}/orders`, {
  headers,
  credentials: 'include',
  default: () => []
});

const { data: customers, pending: customersPending } = await useFetch<any[]>(`${config.public.apiBase}/customers`, {
  headers,
  credentials: 'include',
  default: () => []
});

const stats = computed(() => {
  const ords = orders.value || [];
  
  // Total Revenue: sum of all non-cancelled orders
  const revenue = ords.reduce((sum, o) => o.status !== 'cancelled' ? sum + Number(o.totalPrice || 0) : sum, 0);
  
  // Active customers count
  const activeCust = customers.value ? customers.value.length : 0;
  
  // Total orders count
  const totalOrds = ords.length;
  
  // Pending orders (status === 'new' or 'paid' or 'in_assembly')
  const pendingOrds = ords.filter(o => ['new', 'paid', 'in_assembly'].includes(o.status)).length;
  
  return [
    { label: 'Общая выручка', value: `${revenue.toLocaleString('ru-RU')} ₽`, change: 'В реальном времени', trend: 'up' },
    { label: 'База клиентов', value: activeCust.toLocaleString('ru-RU'), change: 'Активных пользователей', trend: 'neutral' },
    { label: 'Всего заказов', value: totalOrds.toLocaleString('ru-RU'), change: 'Оформлено на сайте', trend: 'up' },
    { label: 'Ожидают сборки/доставки', value: pendingOrds.toLocaleString('ru-RU'), change: 'Требуют внимания', trend: 'neutral' },
  ];
});

const recentOrders = computed(() => {
  return (orders.value || []).slice(0, 5);
});

const popularProducts = computed(() => {
  const ords = orders.value || [];
  const counts: Record<string, { name: string, qty: number, price: number, image?: string }> = {};
  
  ords.forEach(order => {
    if (order.status === 'cancelled') return;
    (order.items || []).forEach((item: any) => {
      if (!item.product) return;
      const pid = item.product.id;
      if (!counts[pid]) {
        counts[pid] = {
          name: item.product.name,
          qty: 0,
          price: item.product.price,
          image: item.product.imageUrl
        };
      }
      counts[pid].qty += item.qty;
    });
  });

  return Object.values(counts)
    .sort((a, b) => b.qty - a.qty)
    .slice(0, 5);
});

function statusLabel(status: string) {
  const map: Record<string, string> = {
    new: 'Новый',
    paid: 'Оплачен',
    in_assembly: 'В сборке',
    out_for_delivery: 'Доставка',
    done: 'Доставлен',
    cancelled: 'Отменен',
  };
  return map[status] ?? status;
}

function channelLabel(channel: string) {
  const map: Record<string, string> = {
    online: 'Онлайн',
    offline: 'Офлайн',
    phone: 'Телефон',
  };
  return map[channel] ?? channel;
}

function statusClass(status: string) {
  const map: Record<string, string> = {
    new: 'bg-blue-100 text-blue-700',
    paid: 'bg-green-100 text-green-700',
    in_assembly: 'bg-yellow-100 text-yellow-700',
    out_for_delivery: 'bg-orange-100 text-orange-700',
    done: 'bg-emerald-100 text-emerald-700',
    cancelled: 'bg-red-100 text-red-600',
  };
  return map[status] ?? 'bg-gray-100 text-gray-600';
}
</script>

<template>
  <div>
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
      <div>
        <h1 class="font-serif text-4xl text-primary font-bold mb-2">Обзор</h1>
        <p class="text-gray-600">Добро пожаловать в панель управления магазином.</p>
      </div>
    </div>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
        <h3 class="text-gray-500 text-xs font-semibold uppercase tracking-wider mb-2">{{ stat.label }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-2xl font-bold text-gray-900">{{ stat.value }}</span>
          <span 
            :class="{
              'text-green-600': stat.trend === 'up',
              'text-gray-500': stat.trend === 'neutral'
            }"
            class="text-xs font-medium mb-1 bg-gray-50 px-2 py-0.5 rounded-full"
          >
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Recent Orders Widget -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
          <h2 class="font-serif text-xl font-bold text-gray-900">Последние заказы</h2>
          <NuxtLink to="/admin/orders" class="text-sm font-medium text-primary hover:underline">Все заказы →</NuxtLink>
        </div>
        
        <div v-if="ordersPending" class="animate-pulse space-y-4 py-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-50 rounded"></div>
        </div>
        <div v-else-if="!recentOrders.length" class="text-center text-gray-400 py-12">
          Заказов пока не поступало.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                <th class="pb-2">Заказ</th>
                <th class="pb-2">Дата</th>
                <th class="pb-2">Сумма</th>
                <th class="pb-2 text-right">Статус</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="order in recentOrders" :key="order.id" class="hover:bg-gray-50/50 transition-colors">
                <td class="py-3 font-medium text-gray-900 font-mono text-xs">
                  #{{ order.id.slice(0, 8) }}
                  <span class="text-xs text-gray-400 block font-normal font-sans">{{ channelLabel(order.channel) }}</span>
                </td>
                <td class="py-3 text-gray-500">
                  {{ new Date(order.createdAt).toLocaleDateString('ru-RU', { day: 'numeric', month: 'short' }) }}
                </td>
                <td class="py-3 font-semibold text-gray-900">
                  {{ order.totalPrice.toLocaleString('ru-RU') }} ₽
                </td>
                <td class="py-3 text-right">
                  <span :class="statusClass(order.status)" class="px-2 py-0.5 text-[10px] font-bold rounded-full uppercase tracking-wider">
                    {{ statusLabel(order.status) }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
      
      <!-- Top Selling Products Widget -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-4 border-b border-gray-50 pb-4">
          <h2 class="font-serif text-xl font-bold text-gray-900">Популярные товары</h2>
          <NuxtLink to="/admin/products" class="text-sm font-medium text-primary hover:underline">Каталог →</NuxtLink>
        </div>
        
        <div v-if="ordersPending" class="animate-pulse space-y-4 py-4">
          <div v-for="i in 5" :key="i" class="h-10 bg-gray-50 rounded"></div>
        </div>
        <div v-else-if="!popularProducts.length" class="text-center text-gray-400 py-12">
          Нет данных по продажам.
        </div>
        <div v-else class="overflow-x-auto">
          <table class="w-full text-left text-sm">
            <thead>
              <tr class="text-gray-400 font-semibold border-b border-gray-100 pb-2">
                <th class="pb-2">Товар</th>
                <th class="pb-2 text-center">Продано</th>
                <th class="pb-2 text-right">Цена</th>
              </tr>
            </thead>
            <tbody class="divide-y divide-gray-50">
              <tr v-for="prod in popularProducts" :key="prod.name" class="hover:bg-gray-50/50 transition-colors">
                <td class="py-3 flex items-center gap-3">
                  <div class="w-8 h-8 rounded overflow-hidden bg-gray-100 border border-gray-200 flex-shrink-0">
                    <img v-if="prod.image" :src="prod.image" class="w-full h-full object-cover" alt="Product" />
                    <div v-else class="w-full h-full flex items-center justify-center text-gray-400">
                      <Icon name="heroicons:photo" size="14" />
                    </div>
                  </div>
                  <span class="font-medium text-gray-900">{{ prod.name }}</span>
                </td>
                <td class="py-3 text-center text-gray-600 font-semibold">
                  {{ prod.qty }} шт.
                </td>
                <td class="py-3 text-right font-semibold text-gray-900">
                  {{ prod.price.toLocaleString('ru-RU') }} ₽
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </div>
</template>
