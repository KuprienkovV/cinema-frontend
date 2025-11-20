<template>
<div v-if="rows && seatsPerRow" class="seat-grid" :style="gridTemplateStyle">
    <div class="seat-grid__corner"/>
    <div
      v-for="seatNumber in seatNumbers"
      :key="`col-${seatNumber}`"
      class="seat-grid__col-number"
    >
      {{ seatNumber }}
    </div>

    <template v-for="rowNumber in rowNumbers" :key="`row-${rowNumber}`">
      <div class="seat-grid__row-label">ряд {{ rowNumber }}</div>

      <button
        v-for="seatNumber in seatNumbers"
        :key="`seat-${rowNumber}-${seatNumber}`"
        type="button"
        class="seat"
        :class="seatClass(rowNumber, seatNumber)"
        :aria-pressed="isSelected(rowNumber, seatNumber)"
        :aria-label="`Ряд ${rowNumber}, место ${seatNumber}`"
        @click="onSeatClick(rowNumber, seatNumber)"
      />
    </template>
  </div>
</template>

<script setup lang="ts">
import type { Seat } from '~/types/api'

const props = defineProps<{
  rows: number
  seatsPerRow: number
  bookedSeats?: Seat[]
  modelValue: Seat[]
  interactive?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: Seat[]): void
  (e: 'booked-seat-click', seat: Seat): void
}>()

const rowNumbers = computed(() => Array.from({ length: props.rows }, (_, i) => i + 1))
const seatNumbers = computed(() => Array.from({ length: props.seatsPerRow }, (_, i) => i + 1))

const gridTemplateStyle = computed(() => ({
  gridTemplateColumns: `80px repeat(${props.seatsPerRow}, 48px)`,
}))

const bookedSet = computed(() => {
  const set = new Set<string>()
  props.bookedSeats?.forEach((seat) => set.add(`${seat.rowNumber}-${seat.seatNumber}`))
  return set
})

const selectedSet = computed(() => {
  const set = new Set<string>()
  props.modelValue.forEach((seat) => set.add(`${seat.rowNumber}-${seat.seatNumber}`))
  return set
})

const seatClass = (rowNumber: number, seatNumber: number) => {
  const key = `${rowNumber}-${seatNumber}`
  return {
    'seat--booked': bookedSet.value.has(key),
    'seat--selected': selectedSet.value.has(key),
    'seat--interactive': props.interactive,
  }
}

const isSelected = (rowNumber: number, seatNumber: number) =>
  selectedSet.value.has(`${rowNumber}-${seatNumber}`)

const onSeatClick = (rowNumber: number, seatNumber: number) => {
  const key = `${rowNumber}-${seatNumber}`
  const seat = { rowNumber, seatNumber }

  if (bookedSet.value.has(key)) {
    emit('booked-seat-click', seat)
    return
  }

  if (!props.interactive) {
    return
  }

  const next = [...props.modelValue]
  const index = next.findIndex(
    (existing) =>
      existing.rowNumber === rowNumber && existing.seatNumber === seatNumber
  )

  if (index >= 0) {
    next.splice(index, 1)
  } else {
    next.push(seat)
  }

  emit('update:modelValue', next)
}
</script>

<style scoped lang="scss">
.seat-grid {
  display: grid;
  grid-auto-rows: 48px;
  column-gap: 12px;
  row-gap: 16px;
  justify-items: center;
  color: #ffffff;
}

.seat-grid__corner {
  width: 100%;
  height: 100%;
}

.seat-grid__col-number,
.seat-grid__row-label {
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 18px;
}

.seat-grid__row-label {
  justify-content: flex-start;
  width: 100%;
  padding-left: 8px;
}

.seat {
  width: 42px;
  height: 42px;
  border: 1px solid #ffffff;
  border-radius: 6px;
  background-color: transparent;
  cursor: pointer;
  transition: background-color 0.2s ease;
}

.seat--interactive:hover:not(.seat--booked) {
  background-color: rgba(21, 65, 99, 0.4);
}

.seat--booked {
  background-color: #b76969;
  cursor: not-allowed;
}

.seat--selected {
  background-color: #154163;
}

.seat:not(.seat--interactive):not(.seat--booked) {
  cursor: default;
}
</style>

