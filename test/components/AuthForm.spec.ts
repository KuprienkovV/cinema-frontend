import { nextTick } from 'vue'
import { describe, it, expect, beforeEach, vi } from 'vitest'
import { mountSuspended, mockNuxtImport } from '@nuxt/test-utils/runtime'
import AuthForm from '~/components/auth/AuthForm.vue'

const toastMock = {
  success: vi.fn(),
  error: vi.fn(),
  info: vi.fn(),
  warning: vi.fn(),
  question: vi.fn(),
}

mockNuxtImport('useToast', () => () => toastMock)

describe('AuthForm', () => {
  beforeEach(() => {
    Object.values(toastMock).forEach((fn) => fn.mockReset())
  })

  it('показывает ошибки валидации для пустой формы', async () => {
    const wrapper = await mountSuspended(AuthForm, {
      props: {
        mode: 'login',
        title: 'Вход',
      },
    })

    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.text()).toContain('Минимум 8 символов')
  })

  it('эмитит submit для валидных данных', async () => {
    const wrapper = await mountSuspended(AuthForm, {
      props: {
        mode: 'login',
        title: 'Вход',
      },
    })

    await wrapper.get('input[name="username"]').setValue('Username1')
    await wrapper.get('input[name="password"]').setValue('Password1')
    await wrapper.find('form').trigger('submit.prevent')

    expect(wrapper.emitted('submit')).toBeTruthy()
    expect(wrapper.emitted('submit')?.[0][0]).toMatchObject({
      username: 'Username1',
      password: 'Password1',
    })
  })

  it('показывает toast при submitError', async () => {
    await mountSuspended(AuthForm, {
      props: {
        mode: 'login',
        title: 'Вход',
        submitError: 'Ошибка входа',
      },
    })

    await nextTick()

    expect(toastMock.error).toHaveBeenCalledWith({
      title: 'Ошибка',
      message: 'Ошибка входа',
    })
  })
})

