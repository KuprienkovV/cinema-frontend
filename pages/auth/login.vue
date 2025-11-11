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

definePageMeta({
  layout: 'default',
})

const route = useRoute()
const toast = useToast()
const submitting = ref(false)
const submitError = ref('')
const session = useState<{ authenticated: boolean }>('auth-session')

if (session.value?.authenticated) {
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
  } catch (error: any) {
    submitError.value =
      error?.data?.message ?? 'Не удалось выполнить вход. Проверьте данные и попробуйте снова.'
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