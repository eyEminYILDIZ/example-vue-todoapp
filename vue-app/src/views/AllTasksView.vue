<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted, ref, watch } from 'vue'
import TaskList from '@/components/TaskList.vue'
import type { ITaskRow } from '@/types'

const taskStore = useTaskStore()
const tasks = ref<ITaskRow[]>([])
onMounted(async () => {
  await taskStore.loadAllTasks()
})

watch(
  () => taskStore.AllTasks,
  () => {
    tasks.value = taskStore.AllTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      user: task.user.name,
      assignedDepartment: task.assignedDepartment,
      status: task.status,
    }))
  },
)
</script>

<template>
  <main class="tasks-page">
    <h1>All Tasks</h1>
    <p v-if="taskStore.listLoading">Loading tasks...</p>
    <TaskList v-else :title="'All Tasks'" :tasks="tasks" />
  </main>
</template>

<style scoped>
.tasks-page {
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1rem;
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 0.75rem;
  border-bottom: 1px solid var(--border);
}
</style>
