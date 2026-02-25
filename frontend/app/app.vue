<template>
  <div>
    <NuxtRouteAnnouncer />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </div>
</template>

<script setup lang="ts">
import { useAuthStore } from '~/stores/auth'

const auth = useAuthStore()

// Runs on server-side and client-side during SSR initialization
await useAsyncData('auth-init', () => auth.fetchUser(), { server: true })
</script>