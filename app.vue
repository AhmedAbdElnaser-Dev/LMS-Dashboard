<script setup>
import LoadingOverlay from '@/components/LoadingOverlay.vue';
import { useAuthStore } from '@/stores/authStore.js';
import ScrollToTop from '@core/components/ScrollToTop.vue';
import initCore from '@core/initCore';
import { initConfigStore, useConfigStore } from '@core/stores/config';
import { hexToRgb } from '@layouts/utils';
import { storeToRefs } from 'pinia';
import { useTheme } from 'vuetify';

const { global } = useTheme();

// ℹ️ Sync current theme with initial loader theme
initCore();
initConfigStore();

const configStore = useConfigStore();
const authStore = useAuthStore(); // Use auth store
const { loading } = storeToRefs(authStore); // Make loading reactive

const { isMobile } = useDevice();
if (isMobile) configStore.appContentLayoutNav = 'vertical';
</script>

<template>
  <VLocaleProvider :rtl="configStore.isAppRTL">
    <VApp :style="`--v-global-theme-primary: ${hexToRgb(global.current.value.colors.primary)}`">
      <NuxtLayout>
        <NuxtPage />
      </NuxtLayout>
      <ScrollToTop />
    </VApp>
  </VLocaleProvider>

  <!-- Show loading overlay only when authStore.loading is true -->
  <LoadingOverlay v-if="loading" :opacity="50" />
</template>
