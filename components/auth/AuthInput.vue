<template>
  <label class="field">
    <span class="field__label">
      {{ label }}
    </span>
    <div :class="['field__control', { 'field__control--error': error }]">
      <input
        v-bind="$attrs"
        :type="type"
        class="field__input"
        :value="modelValue"
        @input="onInput"
      >
      <span v-if="error" class="field__icon">!</span>
    </div>
    <div class="field__error">
      {{ error ?? '' }}
    </div>
  </label>
</template>

<script setup lang="ts">
const props = defineProps<{
  label: string
  modelValue: string
  error?: string
  type?: string
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
}>()

const type = computed(() => props.type ?? 'text')

const onInput = (event: Event) => {
  const target = event.target as HTMLInputElement
  emit('update:modelValue', target.value)
}
</script>

<style scoped lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.field__label {
  font-size: 18px;
  color: #fff;
}

.field__control {
  position: relative;
  display: flex;
}

.field__input {
  width: 100%;
  padding: 14px 18px;
  font-size: 18px;
  color: #fff;
  background-color: transparent;
  border: 1px solid #9E9E9E;
  border-radius: 2px;
}

.field__input:focus {
  outline: none;
  border-color: #fff;
}

.field__control--error .field__input {
  border-color: #A05B5B;
}

.field__icon {
  position: absolute;
  right: 16px;
  top: 50%;
  transform: translateY(-50%);
  width: 18px;
  height: 18px;
  color: #A05B5B;
  font-size: 18px;
  border: 1px solid #A05B5B;
  border-radius: 50%;
  display: flex;
  justify-content: center;
  align-items: center;
  font-size: 10px;
}

.field__error {
  height: 11px;
  color: #A05B5B;
  font-size: 10px;
}
</style>

