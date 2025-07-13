<script setup>
import navItems from '@/navigation/horizontal'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'
import { HorizontalNavLayout } from '@layouts'
import { VNodeRenderer } from '@layouts/components/VNodeRenderer'

// Add loading state for layout initialization
const isLayoutReady = ref(false)

onMounted(() => {
  // Small delay to ensure all components are properly mounted
  nextTick(() => {
    isLayoutReady.value = true
  })
})
</script>

<template>
  <div v-if="isLayoutReady">
    <HorizontalNavLayout :nav-items="navItems">
      <!-- 👉 navbar -->
      <template #navbar>
        <NuxtLink
          to="/"
          class="app-logo d-flex align-center gap-x-3"
        >
          <VNodeRenderer :nodes="themeConfig.app.logo" />

          <h1 class="app-title font-weight-bold leading-normal text-xl text-capitalize">
            {{ themeConfig.app.title }}
          </h1>
        </NuxtLink>
        <VSpacer />

        <NavBarI18n
          v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
          :languages="themeConfig.app.i18n.langConfig"
        />

        <NavbarThemeSwitcher class="me-2" />
        <UserProfile />
      </template>

      <!-- 👉 Pages -->
      <slot />

      <!-- 👉 Footer -->
      <template #footer>
        <Footer />
      </template>

      <!-- 👉 Customizer -->
      <!-- <TheCustomizer /> -->
    </HorizontalNavLayout>
  </div>
  <div
    v-else
    class="d-flex align-center justify-center min-h-screen"
  >
    <VProgressCircular
      indeterminate
      size="64"
    />
  </div>
</template>
