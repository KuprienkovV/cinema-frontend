import { h, nextTick } from 'vue'
import { describe, it, expect } from 'vitest'
import { mountSuspended } from '@nuxt/test-utils/runtime'
import DataTable from '~/components/DataTable.vue'

describe('DataTable', () => {
  it('отображает заголовок и данные без слотов', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: {
        itemKey: 'id',
        columns: [
          { key: 'title', label: 'Название', align: 'left' },
          { key: 'rating', label: 'Рейтинг', align: 'center' },
        ],
        items: [{ id: 1, title: 'Мстители', rating: 9.5 }],
        showHeader: true,
      },
    })

    await nextTick()

    expect(wrapper.html()).toContain('Название')
    expect(wrapper.html()).toContain('Рейтинг')
    expect(wrapper.text()).toContain('Мстители')
  })

  it('использует слот для вывода ячейки', async () => {
    const wrapper = await mountSuspended(DataTable, {
      props: {
        itemKey: 'id',
        columns: [
          { key: 'title', label: 'Название', align: 'left' },
          { key: 'actions', label: 'Действия', align: 'center' },
        ],
        items: [{ id: 1, title: 'Интерстеллар' }],
      },
      slots: {
        'cell-actions': ({ item }) =>
          h(
            'button',
            { type: 'button', class: 'action-btn' },
            `Выбрать ${item.title}`
          ),
      },
    })

    expect(wrapper.find('.action-btn').exists()).toBe(true)
    expect(wrapper.find('.action-btn').text()).toBe('Выбрать Интерстеллар')
  })
})

