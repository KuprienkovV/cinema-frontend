<template>
  <div class="error-page">
    <h1 class="error-page__title">Что-то пошло не так</h1>
    <p class="error-page__message">
      <span v-if="error?.statusCode">{{ error.statusCode }} — </span>
      {{ errorMessage }}
    </p>
    <div class="error-page__actions">
      <button type="button" class="error-page__button" @click="onRetry">
        Обновить страницу
      </button>
      <NuxtLink to="/movies" class="error-page__link">
        На главную
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const props = defineProps<{
  error: any
}>()

const errorMessage = computed(() => {
  if (!props.error) {
    return 'Неизвестная ошибка.'
  }
  return props.error.message || 'Неизвестная ошибка.'
})

const onRetry = () => {
  if (props.error) {
    clearError({ redirect: undefined })
  }
  location.reload()
}
</script>

<style scoped lang="scss">
.error-page {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  gap: 24px;
  background: #111;
  color: #fff;
  text-align: center;
  padding: 48px 16px;
}

.error-page__title {
  font-size: 42px;
  font-weight: 400;
}

.error-page__message {
  font-size: 20px;
  max-width: 480px;
  line-height: 1.6;
}

.error-page__actions {
  display: flex;
  gap: 16px;
  flex-wrap: wrap;
  justify-content: center;
}

.error-page__button,
.error-page__link {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 12px 24px;
  border-radius: 8px;
  border: 1px solid #ffffff;
  color: #ffffff;
  text-decoration: none;
  font-size: 16px;
  transition: background-color 0.2s ease;
}

.error-page__button {
  background: transparent;
  cursor: pointer;
}

.error-page__button:hover,
.error-page__link:hover {
  background-color: rgba(255, 255, 255, 0.12);
}
</style>

