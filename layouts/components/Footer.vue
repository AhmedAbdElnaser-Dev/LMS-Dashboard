<template>
  <div class="h-100 d-flex align-center justify-md-space-between justify-center">
    <!-- 👉 Footer: left content -->
    <span class="d-flex align-center text-medium-emphasis">
      &copy;
      {{ new Date().getFullYear() }}
      Made By <a
        href="https://www.linkedin.com/in/ahmed-abd-elnaser-845153226/"
        target="_blank"
        rel="noopener noreferrer"
        class="text-primary ms-1"
      >Ahmed AbdElnaser and someone</a>
    </span>
    <!-- 👉 Footer: right content -->
    <span class="d-md-flex gap-x-4 text-primary d-none">
      <a
        href="https://themeforest.net/licenses/standard"
        target="noopener noreferrer"
      >License</a>
      <a
        href="https://1.envato.market/pixinvent_portfolio"
        target="noopener noreferrer"
      >More Themes</a>
      <a
        href="https://demos.pixinvent.com/vuexy-vuejs-admin-template/documentation/"
        target="noopener noreferrer"
      >Documentation</a>
      <a
        href="https://pixinvent.ticksy.com/"
        target="noopener noreferrer"
      >Support</a>
    </span>
  </div>
</template>
