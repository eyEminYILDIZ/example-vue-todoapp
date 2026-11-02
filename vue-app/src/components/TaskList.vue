<script setup lang="ts">
import type { ITaskRow } from '@/types'

const props = defineProps<{
  title: string
  tasks: ITaskRow[]
  editAllowed?: boolean
  deleteAllowed?: boolean
  createAllowed?: boolean
  completeAllowed?: boolean
  rejectAllowed?: boolean
}>()

const emit = defineEmits(['onEdit', 'onDelete', 'onComplete', 'onReject'])

const onEdit = (id: number) => {
  emit('onEdit', id)
}
const onDelete = (id: number) => {
  emit('onDelete', id)
}
const onComplete = (id: number) => {
  emit('onComplete', id)
}
const onReject = (id: number) => {
  emit('onReject', id)
}
</script>

<template>
  <div v-if="!props.tasks || props.tasks.length === 0">No tasks available.</div>
  <table v-else>
    <thead>
      <tr>
        <th
          v-if="
            props.editAllowed || props.deleteAllowed || props.completeAllowed || props.rejectAllowed
          "
        >
          Actions
        </th>
        <th>ID</th>
        <th>Title</th>
        <th>Description</th>
        <th>Requested by</th>
        <th>Department</th>
        <th>Status</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="task in props.tasks" :key="task.id">
        <td
          class="flex gap-1"
          v-if="
            props.editAllowed || props.deleteAllowed || props.completeAllowed || props.rejectAllowed
          "
        >
          <button @click="onEdit(task.id)" v-if="props.editAllowed">Edit</button>
          <button @click="onDelete(task.id)" v-if="props.deleteAllowed">Delete</button>
          <button @click="onComplete(task.id)" v-if="props.completeAllowed">Complete</button>
          <button @click="onReject(task.id)" v-if="props.rejectAllowed">Reject</button>
        </td>
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
