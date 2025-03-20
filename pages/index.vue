<script setup>
import { useRouter } from 'vue-router';
import { useAuthStore } from '~/stores/authStore';

const authStore = useAuthStore();
const router = useRouter();

onMounted(() => {
  if (authStore.user) {
    router.push('/dashboard');
  } else {
    router.push('/login');
  }
});
</script>

<template>
  <div>Redirecting...</div>
</template>

