<template>
  <form class="auth-form" @submit.prevent="handleSubmit">
    <h2 class="auth-form__title">{{ title }}</h2>

    <div class="auth-form__fields">
      <AuthInput
        label="Логин"
        name="username"
        autocomplete="username"
        placeholder="Введите логин"
        :model-value="form.username"
        :error="errors.username"
        @update:model-value="updateField('username', $event)"
      />

      <AuthInput
        label="Пароль"
        name="password"
        type="password"
        autocomplete="current-password"
        placeholder="Введите пароль"
        :model-value="form.password"
        :error="errors.password"
        @update:model-value="updateField('password', $event)"
      />

      <AuthInput
        v-if="mode === 'register'"
        label="Подтвердите пароль"
        name="passwordConfirmation"
        type="password"
        autocomplete="new-password"
        placeholder="Повторите пароль"
        :model-value="form.passwordConfirmation ?? ''"
        :error="errors.passwordConfirmation"
        @update:model-value="updateField('passwordConfirmation', $event)"
      />
    </div>

    <button class="auth-form__submit" type="submit" :disabled="submitting">
      <span v-if="!submitting">{{ mode === 'login' ? 'Войти' : 'Зарегистрироваться' }}</span>
      <span v-else>Отправка…</span>
    </button>

    <p class="auth-form__hint">
      <span>{{ hintText }}</span>
      <NuxtLink class="auth-form__link" :to="hintLink">
        {{ hintLinkText }}
      </NuxtLink>
    </p>
  </form>
</template>

<script setup lang="ts">
import { z } from 'zod'
import AuthInput from '~/components/auth/AuthInput.vue'

const loginSchema = z.object({
  username: z
    .string()
    .min(8, 'Минимум 8 символов'),
  password: z
    .string()
    .min(8, 'Минимум 8 символов')
    .regex(/[A-Z]/, 'Нужна заглавная буква')
    .regex(/\d/, 'Нужна цифра'),
})

const registerSchema = loginSchema.extend({
  passwordConfirmation: z.string(),
}).superRefine((data, ctx) => {
  if (data.password !== data.passwordConfirmation) {
    ctx.addIssue({
      code: z.ZodIssueCode.custom,
      path: ['passwordConfirmation'],
      message: 'Пароль не совпадает',
    })
  }
})

type LoginForm = z.infer<typeof loginSchema>
type RegisterForm = z.infer<typeof registerSchema>

const props = defineProps<{
  mode: 'login' | 'register'
  title: string
  submitting?: boolean
  submitError?: string
}>()

const emit = defineEmits<{
  (e: 'submit', payload: LoginForm | RegisterForm): void
}>()

const form = reactive({
  username: '',
  password: '',
  passwordConfirmation: '',
})

const errors = reactive<Record<string, string>>({})

const schema = computed(() => (props.mode === 'login' ? loginSchema : registerSchema))

const hintText = computed(() =>
  props.mode === 'login'
    ? 'Если у вас нет аккаунта'
    : 'Если вы уже зарегистрированы'
)

const hintLink = computed(() =>
  props.mode === 'login'
    ? '/auth/register'
    : '/auth/login'
)

const hintLinkText = computed(() =>
  props.mode === 'login'
    ? 'зарегистрируйтесь'
    : 'войдите'
)

const updateField = (field: string, value: string) => {
  ;(form as Record<string, string>)[field] = value
  errors[field] = ''
}

const handleSubmit = () => {
  Object.keys(errors).forEach((key) => (errors[key] = ''))

  const parsed = schema.value.safeParse(form)
  if (!parsed.success) {
    Object.entries(parsed.error.flatten().fieldErrors).forEach(([key, messages]) => {
      if (messages?.length) {
        errors[key] = messages[0]
      }
    })
    return
  }

  emit('submit', parsed.data)
}

const toast = useToast()
watch(
  () => props.submitError,
  (val) => {
    if (val) {
      toast.error({ title: 'Ошибка', message: val })
    }
  },
  { immediate: true }
)
</script>

<style scoped lang="scss">
.auth-form {
  width: 420px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 32px;
}

.auth-form__title {
  font-size: 48px;
  font-weight: 400;
  color: #ffffff;
  margin-bottom: 12px;
}

.auth-form__fields {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.auth-form__submit {
  width: 100%;
  padding: 12px 0;
  font-size: 20px;
  color: #ffffff;
  background-color: transparent;
  border: 1px solid #ffffff;
  border-radius: 4px;
  transition: background-color 0.15s ease;
}

.auth-form__submit:hover {
  background-color: rgba(255, 255, 255, 0.08);
}

.auth-form__submit:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.auth-form__submit-error {
  width: 100%;
  text-align: center;
  color: #ff6b6b;
  font-size: 16px;
}

.auth-form__hint {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 4px;
  font-size: 18px;
  color: #ffffff;
}

.auth-form__link {
  color: #ffffff;
  text-decoration: underline;
}
</style>

