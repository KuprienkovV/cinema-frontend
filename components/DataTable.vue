<template>
  <div class="data-table">
    <div v-if="itemsList.length">
      <div
        v-if="showHeader"
        class="data-table__header"
        :style="gridStyle"
      >
        <div
          v-for="column in columnsList"
          :key="column.key"
          class="cell cell--header"
          :class="['align-' + (column.align ?? 'left')]"
        >
          {{ column.label ?? '' }}
        </div>
      </div>
      <div class="data-table__body">
        <div
          v-for="item in itemsList"
          :key="getItemKey(item)"
          class="data-table__row"
          :style="gridStyle"
        >
          <div
            v-for="column in columnsList"
            :key="column.key"
            class="cell"
            :class="['align-' + (column.align ?? 'left')]"
          >
            <slot :name="`cell-${column.key}`" :item="item">
              {{ getValue(item, column.key) }}
            </slot>
          </div>
        </div>
      </div>
    </div>
    <p v-else class="empty">{{ emptyTextComputed }}</p>
  </div>
</template>

<script setup lang="ts">
import { computed } from 'vue'

type Column = {
  key: string
  label?: string
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

const props = defineProps<{
  items: unknown[]
  columns: Column[]
  itemKey?: string
  emptyText?: string
  showHeader?: boolean
}>()

defineSlots<
  Record<`cell-${string}`, (props: { item: any }) => any> & {
    default?: (props: { item: any }) => any
  }
>()

const itemsList = computed(() => props.items as Array<Record<string, unknown>>)
const columnsList = computed(() => props.columns)
const emptyTextComputed = computed(() => props.emptyText ?? 'Нет данных')
const showHeader = computed(() => props.showHeader !== false)

const gridStyle = computed(() => {
  const template = columnsList.value
    .map((column) => {
      if (!column.width) return '1fr'
      return typeof column.width === 'number' ? `${column.width}px` : column.width
    })
    .join(' ')
  return { gridTemplateColumns: template }
})

const getValue = (item: unknown, key: string) => {
  if (item && typeof item === 'object') {
    return (item as Record<string, unknown>)[key]
  }
  return undefined
}

const getItemKey = (item: Record<string, unknown>) => {
  if (props.itemKey && props.itemKey in item) {
    return String(item[props.itemKey])
  }
  if ('id' in item) {
    return String(item.id)
  }
  return JSON.stringify(item)
}
</script>

<style scoped lang="scss">
.data-table {
  width: 100%;
  color: #ffffff;
}

.data-table__header {
  display: grid;
  border-bottom: 1px solid #a7a7a7;
}

.data-table__body {
  display: flex;
  flex-direction: column;
}

.data-table__row {
  display: grid;
  border-bottom: 1px solid rgba(167, 167, 167, 0.4);
}

.cell {
  padding: 18px 12px;
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
  font-size: 20px;
}

.cell--header {
  font-weight: 400;
  font-size: 20px;
}

.align-left {
  justify-content: flex-start;
  text-align: left;
}

.align-center {
  justify-content: center;
  text-align: center;
}

.align-right {
  justify-content: flex-end;
  text-align: right;
}

:deep(.table-action-button) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 200px;
  padding: 12px 24px;
  border: 1px solid #ffffff;
  border-radius: 8px;
  font-size: 14px;
  color: #ffffff;
  transition: background-color 0.2s ease;
}

:deep(.table-action-button:hover) {
  background-color: rgba(255, 255, 255, 0.12);
}

.empty {
  text-align: center;
  font-size: 24px;
  color: #cccccc;
  padding: 40px 0;
}
</style>

