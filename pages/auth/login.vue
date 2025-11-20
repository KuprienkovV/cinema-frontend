<template>
  <div class="auth-page">
    <AuthForm
      mode="login"
      title="Вход"
      :submitting="submitting"
      :submit-error="submitError"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import AuthForm from '~/components/auth/AuthForm.vue'
import { toApiError } from '~/utils/errors'

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const toast = useToast()
const submitting = ref(false)
const submitError = ref('')
const { session, isAuthenticated } = useAuthSession()

if (isAuthenticated.value) {
  await navigateTo('/movies')
}

const handleSubmit = async (payload: { username: string; password: string }) => {
  submitError.value = ''
  submitting.value = true
  try {
    await $fetch('/api/auth/login', {
      method: 'POST',
      body: payload,
    })
    toast.success({
      title: 'Успех',
      message: 'Вы успешно вошли в систему.',
    })
    session.value = { authenticated: true }
    const redirect = route.query.redirect as string | undefined
    await navigateTo(redirect || '/movies')
  } catch (error: unknown) {
    const apiError = toApiError(
      error,
      'Не удалось выполнить вход. Проверьте данные и попробуйте снова.'
    )
    submitError.value = apiError.message
  } finally {
    submitting.value = false
  }
}
</script>

<style scoped lang="scss">
.auth-page {
  width: 100%;
  height: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
}
</style>