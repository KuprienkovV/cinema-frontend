<template>
  <div class="wrapper">
    <div class="container">
      <SideNavigation />
      <slot />
    </div>
  </div>
</template>

<style lang="scss" scoped>
.wrapper {
  width: 100vw;
  height: 100vh;
  display: flex;
  justify-content: center;
  align-items: center;
}

.container {
  width: 90vw;
  height: 85vh;
  border: 2px solid #fff;
  display: flex;
}
</style>