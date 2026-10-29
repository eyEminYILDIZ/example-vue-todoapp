import { beforeEach, describe, expect, it } from 'vitest'
import { createPinia, setActivePinia } from 'pinia'
import { useTodoStore } from '../todos'

const input = { title: 'Test', description: '', priority: 'medium' as const }

describe('todo store', () => {
  beforeEach(() => {
    localStorage.clear()
    setActivePinia(createPinia())
  })

  it('adds a todo', () => {
    const store = useTodoStore()
    store.addTodo(input)
    expect(store.todos).toHaveLength(1)
    expect(store.todos[0]!.completed).toBe(false)
  })

  it('updates a todo', () => {
    const store = useTodoStore()
    store.addTodo(input)
    store.updateTodo(store.todos[0]!.id, { ...input, title: 'Yeni' })
    expect(store.todos[0]!.title).toBe('Yeni')
  })

  it('removes a todo', () => {
    const store = useTodoStore()
    store.addTodo(input)
    store.removeTodo(store.todos[0]!.id)
    expect(store.todos).toHaveLength(0)
  })

  it('filters and clears completed todos', () => {
    const store = useTodoStore()
    store.addTodo(input)
    store.addTodo(input)
    store.toggleTodo(store.todos[0]!.id)
    store.setFilter('completed')
    expect(store.filteredTodos).toHaveLength(1)
    store.setFilter('active')
    expect(store.filteredTodos).toHaveLength(1)
    store.clearCompleted()
    expect(store.todos).toHaveLength(1)
  })
})
