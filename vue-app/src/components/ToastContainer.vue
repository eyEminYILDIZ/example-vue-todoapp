<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'
import {
  CheckCircleIcon,
  ExclamationCircleIcon,
  InformationCircleIcon,
} from '@heroicons/vue/24/outline'
import { XMarkIcon } from '@heroicons/vue/20/solid'
import { useToastStore, type ToastType } from '@/stores/ToastStore'

const toastStore = useToastStore()

const icons = {
  success: CheckCircleIcon,
  error: ExclamationCircleIcon,
  info: InformationCircleIcon,
}

const panelColors: Record<ToastType, string> = {
  success: 'border-green-500 bg-green-50',
  error: 'border-red-500 bg-red-50',
  info: 'border-blue-500 bg-blue-50',
}

const iconColors: Record<ToastType, string> = {
  success: 'text-green-500',
  error: 'text-(--danger)',
  info: 'text-(--primary)',
}
</script>

<template>
  <div
    aria-live="polite"
    class="pointer-events-none fixed inset-0 z-[60] flex flex-col items-center justify-end gap-3 px-4 py-6 sm:p-6"
  >
    <TransitionRoot
      v-for="toast in toastStore.toasts"
      :key="toast.id"
      appear
      :show="toast.visible"
      enter="transform transition duration-300 ease-out"
      enter-from="translate-y-2 opacity-0"
      enter-to="translate-y-0 opacity-100"
      leave="transition duration-200 ease-in"
      leave-from="opacity-100"
      leave-to="opacity-0"
      @after-leave="toastStore.remove(toast.id)"
    >
      <div
        role="status"
        class="pointer-events-auto w-full max-w-sm rounded-xl border-2 p-4 shadow-2xl ring-4 ring-black/5"
        :class="panelColors[toast.type]"
      >
        <div class="flex items-start gap-3">
          <component
            :is="icons[toast.type]"
            class="size-6 shrink-0"
            :class="iconColors[toast.type]"
            aria-hidden="true"
          />
          <div class="min-w-0 flex-1 text-sm">
            <p class="font-medium">{{ toast.title }}</p>
            <p v-if="toast.message" class="mt-1 text-(--muted)">{{ toast.message }}</p>
          </div>
          <button
            type="button"
            class="!border-0 !p-0 text-(--muted) hover:text-(--text)"
            @click="toastStore.dismiss(toast.id)"
          >
            <span class="sr-only">Close</span>
            <XMarkIcon class="size-5" aria-hidden="true" />
          </button>
        </div>
      </div>
    </TransitionRoot>
  </div>
</template>
