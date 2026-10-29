<script setup lang="ts">
import { useTodoStore } from '@/stores/todos'
import TodoFilters from '@/components/TodoFilters.vue'
import TodoForm from '@/components/TodoForm.vue'
import TodoList from '@/components/TodoList.vue'

const store = useTodoStore()
</script>

<template>
  <main class="app">
    <h1>Todo Uygulaması</h1>
    <section class="card">
      <h2>Yeni görev</h2>
      <TodoForm @submit="store.addTodo($event)" />
    </section>
    <section class="card">
      <TodoFilters />
    </section>
    <TodoList />
  </main>
</template>

<style scoped>
.app {
  display: grid;
  gap: 1rem;
  max-width: 720px;
  margin: 0 auto;
  padding: 2rem 1rem;
}
h1,
h2 {
  margin: 0;
}
h2 {
  font-size: 1.1rem;
  margin-bottom: 0.75rem;
}
.card {
  padding: 1rem;
  border: 1px solid var(--border);
  border-radius: 8px;
  background: var(--surface);
}
</style>
