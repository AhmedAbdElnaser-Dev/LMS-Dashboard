<script setup>
import navItems from '@/navigation/vertical'
import { themeConfig } from '@themeConfig'

// Components
import Footer from '@/layouts/components/Footer.vue'
import NavbarThemeSwitcher from '@/layouts/components/NavbarThemeSwitcher.vue'
import UserProfile from '@/layouts/components/UserProfile.vue'
import NavBarI18n from '@core/components/I18n.vue'

// @layouts plugin
import { VerticalNavLayout } from '@layouts'

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
    <VerticalNavLayout :nav-items="navItems">
      <!-- 👉 navbar -->
      <template #navbar="{ toggleVerticalOverlayNavActive }">
        <div class="d-flex h-100 align-center">
          <IconBtn
            id="vertical-nav-toggle-btn"
            class="ms-n3 d-lg-none"
            @click="toggleVerticalOverlayNavActive(true)"
          >
            <VIcon
              size="26"
              icon="tabler-menu-2"
            />
          </IconBtn>

          <NavbarThemeSwitcher />

          <VSpacer />

          <NavBarI18n
            v-if="themeConfig.app.i18n.enable && themeConfig.app.i18n.langConfig?.length"
            :languages="themeConfig.app.i18n.langConfig"
          />
          <UserProfile />
        </div>
      </template>

      <!-- 👉 Pages -->
      <slot />

      <!-- 👉 Footer -->
      <template #footer>
        <Footer />
      </template>

      <!-- 👉 Customizer -->
      <!-- <TheCustomizer /> -->
    </VerticalNavLayout>
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
