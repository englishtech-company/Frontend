import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useStore = defineStore('storeId', {
  state: () => {
    const earningChartRef = ref<HTMLDivElement | null>(null)
    const naveHeader = ref<boolean>(false)
    const iconHover = ref<boolean>(false)
    const paginationLength = ref()
    const emaiComposeMenuToggle = ref(false)
    return {
      openChatbox: false,
      seriesType: 'week',
      earningChartRef,
      naveHeader,
      iconHover,
      paginationLength,
      emaiComposeMenuToggle,
    }
  }
})
