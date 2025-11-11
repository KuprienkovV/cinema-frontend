import { mountSuspended } from '@nuxt/test-utils/runtime'
import { describe, it, expect } from 'vitest'
import SeatGrid from '~/components/SeatGrid.vue'

describe('SeatGrid', () => {
  it('выбирает свободное место', async () => {
    const wrapper = await mountSuspended(SeatGrid, {
      props: {
        rows: 1,
        seatsPerRow: 2,
        modelValue: [],
        interactive: true,
      },
    })

    await wrapper.get('[aria-label="Ряд 1, место 1"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeTruthy()
    expect(wrapper.emitted('update:modelValue')?.[0][0]).toEqual([
      { rowNumber: 1, seatNumber: 1 },
    ])
  })

  it('не выбирает занятое место и эмитит событие', async () => {
    const wrapper = await mountSuspended(SeatGrid, {
      props: {
        rows: 1,
        seatsPerRow: 1,
        modelValue: [],
        bookedSeats: [{ rowNumber: 1, seatNumber: 1 }],
        interactive: true,
      },
    })

    await wrapper.get('[aria-label="Ряд 1, место 1"]').trigger('click')

    expect(wrapper.emitted('update:modelValue')).toBeFalsy()
    expect(wrapper.emitted('booked-seat-click')).toBeTruthy()
  })
})

