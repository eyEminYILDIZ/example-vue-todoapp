<script setup lang="ts">
import type { ITaskRow } from '@/types'

defineProps<{
  title: string
  tasks: ITaskRow[]
}>()
</script>

<template>
  <div v-if="!tasks || tasks.length === 0">No tasks available.</div>
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
      <tr v-for="task in tasks" :key="task.id">
        <td>{{ task.id }}</td>
        <td>{{ task.title }}</td>
        <td>{{ task.description }}</td>
        <td>{{ task.user }}</td>
        <td>{{ task.assignedDepartment }}</td>
        <td>{{ ['Pending', 'Completed', 'Rejected'][task.status] ?? 'Unknown' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
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
