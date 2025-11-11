<template>
    <DataTable
      :items="cinemas"
      :columns="columns"
      item-key="id"
      empty-text="Нет доступных кинотеатров"
      :show-header="true"
    >
      <template #cell-name="{ item }: { item: Cinema }">
        <span class="cinema-name">{{ item.name }}</span>
      </template>
      <template #cell-address="{ item }: { item: Cinema }">
        {{ item.address }}
      </template>
      <template #cell-actions="{ item }: { item: Cinema }">
        <NuxtLink class="table-action-button" :to="`/cinemas/${item.id}/sessions`">
          Посмотреть сеансы
        </NuxtLink>
      </template>
    </DataTable>
</template>

<script setup lang="ts">
import type { Cinema } from '~/types/api'
import { useCinemasStore } from '~/stores/cinemas'

definePageMeta({
  title: 'Кинотеатры',
})

const cinemasStore = useCinemasStore()
const { cinemas } = storeToRefs(cinemasStore)

await useAsyncData('cinemas-list', () => cinemasStore.fetchCinemas())

interface TableColumn {
  key: string
  label?: string
  align?: 'left' | 'center' | 'right'
  width?: string | number
}

const columns: TableColumn[] = [
  { key: 'name', label: 'Кинотеатр', align: 'left' },
  { key: 'address', label: 'Адрес', align: 'left' },
  { key: 'actions', label: '', align: 'center', width: 220 },
]
</script>

<style scoped lang="scss">

.cinema-name {
  font-size: 22px;
  font-weight: 400;
}
</style>
