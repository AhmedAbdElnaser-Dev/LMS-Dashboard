<script setup>
import GlobalSnackbar from '@/components/GlobalSnackbar.vue'
import LoadingOverlay from '@/components/LoadingOverlay.vue'
import { useAuthStore } from '@/stores/useAuthStore'
import ScrollToTop from '@core/components/ScrollToTop.vue'
import initCore from '@core/initCore'
import { initConfigStore, useConfigStore } from '@core/stores/config'
import { hexToRgb } from '@layouts/utils'
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { useTheme } from 'vuetify'

const { global } = useTheme()

initCore()
initConfigStore()

const configStore = useConfigStore()
const authStore = useAuthStore()
const { loading } = storeToRefs(authStore)

const { isMobile } = useDevice()
if (isMobile) configStore.appContentLayoutNav = 'vertical'

// Initialize auth store
onMounted(() => {
  if (!authStore.isInitialized) {
    authStore.initialize()
  }
})
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <NuxtLayout>
        <NuxtPage />
        <GlobalSnackbar />
      </NuxtLayout>
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>

  <LoadingOverlay
    v-if="loading"
    :opacity="50"
  />
</template>
