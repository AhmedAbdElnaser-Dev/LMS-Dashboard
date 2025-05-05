import { defineStore } from 'pinia'
import { ref, watch } from 'vue'

export const useSnackbarStore = defineStore('snackbar', () => {
  const queue = ref([])
  const current = ref(null)
  const visible = ref(false)

  function show(message, type = 'info', duration = 3000) {
    queue.value.push({ message, type, duration })
    processQueue()
  }

  function processQueue() {
    if (visible.value || !queue.value.length) return

    current.value = queue.value.shift()
    visible.value = true

    setTimeout(() => {
      visible.value = false
    }, current.value.duration)
  }

  watch(visible, newVal => {
    if (!newVal) {
      processQueue()
    }
  })

  return {
    queue,
    current,
    visible,
    show,
  }
})
