import { useAuthStore } from '~/stores/auth'

export default defineNuxtRouteMiddleware(async (to, from) => {
  // Only protect /admin routes
  if (to.path.startsWith('/admin')) {
    const authStore = useAuthStore();
    
    // Attempt to fetch user if we don't have it yet
    if (!authStore.user) {
      await authStore.fetchUser();
    }
    
    // If still not authenticated or not an admin, redirect to login page
    if (!authStore.user || authStore.user.role !== 'admin') {
      return navigateTo('/login');
    }
  }
});
