<script setup lang="ts">
import { ref } from 'vue'
import type { Priority, Todo, TodoInput } from '@/types/todo'
import TodoForm from './TodoForm.vue'

defineProps<{ todo: Todo }>()
const emit = defineEmits<{
  toggle: []
  remove: []
  update: [input: TodoInput]
}>()

const priorityLabels: Record<Priority, string> = {
  low: 'Düşük',
  medium: 'Orta',
  high: 'Yüksek',
}

const editing = ref(false)

function onUpdate(input: TodoInput) {
  emit('update', input)
  editing.value = false
}
</script>

<template>
  <li class="todo-item" :class="{ completed: todo.completed }">
    <TodoForm v-if="editing" :todo="todo" @submit="onUpdate" @cancel="editing = false" />

    <template v-else>
      <input
        type="checkbox"
        :checked="todo.completed"
        :aria-label="`${todo.title} tamamlandı`"
        @change="emit('toggle')"
      />
      <div class="content">
        <span class="title">{{ todo.title }}</span>
        <span v-if="todo.description" class="description">{{ todo.description }}</span>
      </div>
      <span class="badge" :class="todo.priority">{{ priorityLabels[todo.priority] }}</span>
      <button type="button" @click="editing = true">Düzenle</button>
      <button type="button" class="danger" @click="emit('remove')">Sil</button>
    </template>
  </li>
</template>

<style scoped>
.todo-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
.todo-item > :deep(form) {
  flex: 1;
}
.content {
  flex: 1;
  display: grid;
  min-width: 0;
}
.title {
  font-weight: 600;
  overflow-wrap: anywhere;
}
.description {
  font-size: 0.85rem;
  color: var(--muted);
  overflow-wrap: anywhere;
}
.completed .title {
  text-decoration: line-through;
  color: var(--muted);
}
.badge {
  padding: 0.15rem 0.5rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}
.badge.low {
  background: #dcfce7;
  color: #166534;
}
.badge.medium {
  background: #fef9c3;
  color: #854d0e;
}
.badge.high {
  background: #fee2e2;
  color: #991b1b;
}
</style>
