<template>
  <div class="auth-page">
    <AuthForm
      mode="register"
      title="Регистрация"
      :submitting="submitting"
      :submit-error="submitError"
      @submit="handleSubmit"
    />
  </div>
</template>

<script setup lang="ts">
import AuthForm from '~/components/auth/AuthForm.vue'

definePageMeta({
  layout: 'default',
})

const toast = useToast()
const submitting = ref(false)
const submitError = ref('')

const handleSubmit = async (payload: {
  username: string
  password: string
  passwordConfirmation?: string
}) => {
  submitError.value = ''
  submitting.value = true
  try {
    await $fetch('/api/auth/register', {
      method: 'POST',
      body: {
        username: payload.username,
        password: payload.password,
      },
    })
    toast.success({
      title: 'Успех',
      message: 'Вы успешно зарегистрировались.',
    })
    await refreshNuxtData('auth-session')
    await navigateTo('/movies')
  } catch (error: any) {
    submitError.value =
      error?.data?.message ?? 'Не удалось выполнить регистрацию. Попробуйте позже.'
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