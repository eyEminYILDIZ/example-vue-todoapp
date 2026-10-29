<script setup lang="ts">
import { useTodoStore } from '@/stores/todos'
import TodoItem from './TodoItem.vue'

const store = useTodoStore()
</script>

<template>
  <p v-if="!store.filteredTodos.length" class="empty">Gösterilecek görev yok.</p>
  <ul v-else class="todo-list">
    <TodoItem
      v-for="todo in store.filteredTodos"
      :key="todo.id"
      :todo="todo"
      @toggle="store.toggleTodo(todo.id)"
      @remove="store.removeTodo(todo.id)"
      @update="store.updateTodo(todo.id, $event)"
    />
  </ul>
</template>

<style scoped>
.todo-list {
  display: grid;
  gap: 0.5rem;
  margin: 0;
  padding: 0;
  list-style: none;
}
.empty {
  text-align: center;
  color: var(--muted);
}
</style>
