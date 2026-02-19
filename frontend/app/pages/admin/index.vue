<script setup lang="ts">
definePageMeta({
  layout: 'admin',
  // middleware: 'auth' // Assuming middleware exists or will be added
});

const stats = [
  { label: 'Total Revenue', value: '$45,231', change: '+20.1%', trend: 'up' },
  { label: 'Active Users', value: '2,338', change: '-1.2%', trend: 'down' },
  { label: 'New Orders', value: '1,200', change: '+10.5%', trend: 'up' },
  { label: 'Pending Issues', value: '4', change: '0%', trend: 'neutral' },
];
</script>

<template>
  <div>
    <h1 class="font-serif text-4xl text-primary font-bold mb-2">Dashboard</h1>
    <p class="text-gray-600 mb-8">Welcome back to the store management overview.</p>

    <!-- Stats Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div v-for="stat in stats" :key="stat.label" class="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
        <h3 class="text-gray-500 text-sm font-medium uppercase tracking-wider mb-2">{{ stat.label }}</h3>
        <div class="flex items-end justify-between">
          <span class="text-3xl font-bold text-gray-900">{{ stat.value }}</span>
          <span 
            :class="{
              'text-green-600': stat.trend === 'up',
              'text-red-600': stat.trend === 'down',
              'text-gray-500': stat.trend === 'neutral'
            }"
            class="text-sm font-medium mb-1"
          >
            {{ stat.change }}
          </span>
        </div>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
      <!-- Placeholder for recent orders -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p class="text-gray-400">Recent Orders Chart (Placeholder)</p>
      </div>
      
      <!-- Placeholder for popular products -->
      <div class="bg-white p-6 rounded-xl shadow-sm border border-gray-100 h-64 flex items-center justify-center">
        <p class="text-gray-400">Popular Products (Placeholder)</p>
      </div>
    </div>
  </div>
</template>
