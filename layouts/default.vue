<template>
  <div class="wrapper">
    <div class="container">
      <SideNavigation />
      <div class="content">
        <slot />
      </div>
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

.content {
  flex: 1;
  height: 100%;
  overflow: auto;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>