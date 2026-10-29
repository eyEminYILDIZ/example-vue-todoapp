export type Priority = 'low' | 'medium' | 'high'

export type TodoFilter = 'all' | 'active' | 'completed'

export interface Todo {
  id: string
  title: string
  description: string
  priority: Priority
  completed: boolean
  createdAt: number
}

export type TodoInput = Pick<Todo, 'title' | 'description' | 'priority'>
