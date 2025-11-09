<template>
  <aside class="aside">
    <nav>
      <ul>
        <li v-for="link in navLinks">
          <NuxtLink class="nav-link" :to="link.route">{{ link.text }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
const navLinks = [
  {
    route: 'movies',
    text: 'Фильмы',
  },
  {
    route: 'cinemas',
    text: 'Кинотеатры',
  },
  {
    route: 'bookings',
    text: 'Мои билеты',
  },
  {
    route: 'login',
    text: 'Вход',
  }
];
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 172px;
  width: fit-content;
  height: 80%;
  border: 1px solid #9E9E9E;
  padding-top: 36px;
}

.nav-link {
  display: flex;
  width: 100%;
  height: 45px;
  align-items: center;
  padding-left: 30.5px;
  font-size: 18px;
}

.nav-link.router-link-active {
  border: 1px solid #A7A7A7;
  background-color: #2D2D2D;
}
</style>
