<script setup>
import { useAuthStore } from '@/stores/useAuthStore'
import { useRouter } from 'vue-router'

const authStore = useAuthStore()
const router = useRouter()

onMounted(() => {
  if (authStore.user) {
    router.push('/dashboard')
  } else {
    router.push('/login')
  }
})
</script>

<template>
  <div>Redirecting...</div>
</template>

