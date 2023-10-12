import { computed, ref } from 'vue'
import { defineStore } from 'pinia'

export const useStateStore = defineStore('state', () => {
  const filter = ref('all')
  const textFilter = ref('')
  const getFilter = computed(() => filter.value)
  const getTextFilter = computed(() => textFilter.value)

  function updatefilter(value: string) {
    filter.value = value
  }

  function updateTextFilter(value: string) {
    textFilter.value = value
  }
  return { filter, getFilter, updatefilter,updateTextFilter, getTextFilter }
})