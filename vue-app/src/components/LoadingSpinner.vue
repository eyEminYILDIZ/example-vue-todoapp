<script setup lang="ts">
import { TransitionRoot } from '@headlessui/vue'

withDefaults(defineProps<{ show: boolean; label?: string }>(), { label: 'Loading...' })
</script>

<template>
  <TransitionRoot
    :show="show"
    appear
    enter="transition-opacity duration-200 ease-out"
    enter-from="opacity-0"
    enter-to="opacity-100"
    leave="transition-opacity duration-150 ease-in"
    leave-from="opacity-100"
    leave-to="opacity-0"
    as="div"
    role="status"
    aria-live="polite"
    class="pointer-events-none fixed inset-0 z-50 flex items-center justify-center"
  >
    <div class="flex flex-col items-center gap-3">
      <svg
        class="size-12 animate-spin text-(--primary)"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        aria-hidden="true"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
        <path
          class="opacity-75"
          fill="currentColor"
          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
        />
      </svg>
      <span class="text-sm text-(--muted)">{{ label }}</span>
    </div>
  </TransitionRoot>
</template>
