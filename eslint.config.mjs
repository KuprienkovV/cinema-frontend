import withNuxt from './.nuxt/eslint.config.mjs'

// withNuxt() подтягивает конфиг из @nuxt/eslint-config:
// там уже подключены Vue 3 + Nuxt правила, @typescript-eslint и связанные плагины.
// Ниже мы лишь добавляем поверх точечные правила проекта.

export default withNuxt({
  rules: {
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'nuxt/no-cjs-in-config': 'off'
  }
})