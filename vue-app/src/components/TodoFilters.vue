<script setup lang="ts">
import { useTodoStore } from '@/stores/todos'
import type { TodoFilter } from '@/types/todo'

const store = useTodoStore()

const filters: { value: TodoFilter; label: string }[] = [
  { value: 'all', label: 'Tümü' },
  { value: 'active', label: 'Aktif' },
  { value: 'completed', label: 'Tamamlanan' },
]
</script>

<template>
  <div class="filters">
    <span>{{ store.activeCount }} aktif görev</span>
    <div class="buttons">
      <button
        v-for="f in filters"
        :key="f.value"
        type="button"
        :class="{ active: store.filter === f.value }"
        :aria-pressed="store.filter === f.value"
        @click="store.setFilter(f.value)"
      >
        {{ f.label }}
      </button>
    </div>
    <button type="button" :disabled="!store.completedCount" @click="store.clearCompleted()">
      Tamamlananları temizle
    </button>
  </div>
</template>

<style scoped>
.filters {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem;
}
.buttons {
  display: flex;
  gap: 0.25rem;
}
button.active {
  background: var(--primary);
  border-color: var(--primary);
  color: #fff;
}
</style>
