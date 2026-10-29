<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted } from 'vue'

const taskStore = useTaskStore()

onMounted(async () => {
  await taskStore.loadAllTasks()
})
</script>

<template>
  <main class="tasks-page">
    <h1>All Tasks</h1>
    <p v-if="taskStore.isLoading">Loading tasks...</p>
    <table v-else>
      <thead>
        <tr>
          <th>ID</th>
          <th>Title</th>
          <th>Description</th>
          <th>Requested by</th>
          <th>Department</th>
          <th>Status</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="task in taskStore.AllTasks" :key="task.id">
          <td>{{ task.id }}</td>
          <td>{{ task.title }}</td>
          <td>{{ task.description }}</td>
          <td>{{ task.user.name }}</td>
          <td>{{ task.assignedDepartment }}</td>
          <td>{{ ['Pending', 'Completed', 'Rejected'][task.status] ?? 'Unknown' }}</td>
        </tr>
      </tbody>
    </table>
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
