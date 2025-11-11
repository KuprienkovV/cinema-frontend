<template>
  <div class="wrapper">
      <SideNavigation />
      <div class="content">
        <slot />
      </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  display: flex;
}

.content {
  flex: 1;
  padding: 48px 72px;
}
</style>