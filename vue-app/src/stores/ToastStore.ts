import { defineStore } from 'pinia'
import { ref } from 'vue'

export type ToastType = 'success' | 'error' | 'info'

export interface IToast {
  id: number
  type: ToastType
  title: string
  message?: string
  // false while the leave transition plays; the item is removed afterwards
  visible: boolean
}

const DEFAULT_DURATION_MS = 4000

export const useToastStore = defineStore('toast', () => {
  const toasts = ref<IToast[]>([])
  let nextId = 1

  const dismiss = (id: number) => {
    const toast = toasts.value.find((t) => t.id === id)
    if (toast) toast.visible = false
  }

  // called by the container once the leave transition is done
  const remove = (id: number) => {
    toasts.value = toasts.value.filter((t) => t.id !== id)
  }

  const show = (type: ToastType, title: string, message?: string, duration = DEFAULT_DURATION_MS) => {
    const id = nextId++
    toasts.value.push({ id, type, title, message, visible: true })
    if (duration > 0) setTimeout(() => dismiss(id), duration)
    return id
  }

  const success = (title: string, message?: string) => show('success', title, message)
  const error = (title: string, message?: string) => show('error', title, message, 6000)
  const info = (title: string, message?: string) => show('info', title, message)

  return { toasts, show, success, error, info, dismiss, remove }
})
