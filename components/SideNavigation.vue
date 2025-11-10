<template>
  <aside class="aside">
    <nav>
      <ul>
        <li v-for="link in navLinks" :key="link.route">
          <NuxtLink class="nav-link" :to="link.route">
            {{ link.text }}
          </NuxtLink>
        </li>
        <li>
          <button v-if="isAuthorized" class="nav-link" type="button" @click="logout">
            Выход
          </button>
          <NuxtLink v-else  class="nav-link" to="/auth/login">
            Вход
          </NuxtLink>
        </li>
      </ul>
    </nav>
  </aside>
</template>

<script lang="ts" setup>
const navLinks = [
  { route: '/movies', text: 'Фильмы' },
  { route: '/cinemas', text: 'Кинотеатры' },
  { route: '/bookings', text: 'Мои билеты' },
]

const sessionKey = 'auth-session'
const { data: session, refresh } = await useAsyncData(sessionKey, () =>
  $fetch<{ authenticated: boolean }>('/api/auth/session')
)

const isAuthorized = computed(() => Boolean(session.value?.authenticated))

const toast = useToast()

const logout = async () => {
  await $fetch('/api/auth/logout', { method: 'POST' })
  toast.success({
    title: 'Выход',
    message: 'Вы успешно вышли из системы.',
  })
  await refresh()
  await navigateTo('/movies')
}
</script>

<style lang="scss" scoped>
.aside {
  display: flex;
  flex-direction: column;
  gap: 9px;
  min-width: 172px;
  width: fit-content;
  height: 80vh;
  border: 1px solid #9e9e9e;
  padding-top: 36px;
}

ul {
  display: flex;
  flex-direction: column;
  gap: 9px;
}

.nav-link {
  display: flex;
  width: 100%;
  height: 45px;
  align-items: center;
  padding-left: 30.5px;
  font-size: 18px;
  color: #ffffff;
}

.nav-link.router-link-active {
  border: 1px solid #a7a7a7;
  background-color: #2d2d2d;
}
</style>
