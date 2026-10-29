import { computed, ref, watch } from 'vue'
import { defineStore } from 'pinia'
import type { Todo, TodoFilter, TodoInput } from '@/types/todo'

const STORAGE_KEY = 'todo-app:todos'

const loadTodos = (): Todo[] => {
  try {
    const raw = localStorage.getItem(STORAGE_KEY)
    return raw ? (JSON.parse(raw) as Todo[]) : []
  } catch {
    return []
  }
}

export const useTodoStore = defineStore('todos', () => {
  const todos = ref<Todo[]>(loadTodos())
  const filter = ref<TodoFilter>('all')

  const filteredTodos = computed(() => {
    switch (filter.value) {
      case 'active':
        return todos.value.filter((t) => !t.completed)
      case 'completed':
        return todos.value.filter((t) => t.completed)
      default:
        return todos.value
    }
  })
  const activeCount = computed(() => todos.value.filter((t) => !t.completed).length)
  const completedCount = computed(() => todos.value.length - activeCount.value)

  const addTodo = (input: TodoInput) => {
    todos.value.unshift({
      id: crypto.randomUUID(),
      ...input,
      completed: false,
      createdAt: Date.now(),
    })
  }

  const updateTodo = (id: string, input: TodoInput) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) Object.assign(todo, input)
  }

  const toggleTodo = (id: string) => {
    const todo = todos.value.find((t) => t.id === id)
    if (todo) todo.completed = !todo.completed
  }

  const removeTodo = (id: string) => {
    todos.value = todos.value.filter((t) => t.id !== id)
  }

  const clearCompleted = () => {
    todos.value = todos.value.filter((t) => !t.completed)
  }

  const setFilter = (value: TodoFilter) => {
    filter.value = value
  }

  watch(todos, (value) => localStorage.setItem(STORAGE_KEY, JSON.stringify(value)), { deep: true })

  return {
    todos,
    filter,
    filteredTodos,
    activeCount,
    completedCount,
    addTodo,
    updateTodo,
    toggleTodo,
    removeTodo,
    clearCompleted,
    setFilter,
  }
})
