<script setup lang="ts">
import { InboxIcon } from '@heroicons/vue/24/outline'
import type { ITaskRow } from '@/types'

const props = defineProps<{
  title: string
  tasks: ITaskRow[]
  detailAllowed?: boolean
  editAllowed?: boolean
  deleteAllowed?: boolean
  createAllowed?: boolean
  completeAllowed?: boolean
  rejectAllowed?: boolean
}>()

const emit = defineEmits(['onEdit', 'onDelete', 'onComplete', 'onReject', 'onDetail'])

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
const onDetail = (id: number) => {
  emit('onDetail', id)
}

const departments: Record<number, string> = { 1: 'HR', 2: 'Sales', 3: 'Marketing' }
const statuses = ['Pending', 'Completed', 'Rejected']
</script>

<template>
  <div v-if="!props.tasks || props.tasks.length === 0" class="empty-state" role="status">
    <span class="empty-icon" aria-hidden="true">
      <InboxIcon class="empty-icon-svg" />
    </span>
    <h2>No tasks available</h2>
    <p>There is nothing to show here right now.</p>
  </div>
  <table v-else>
    <thead>
      <tr>
        <th
          v-if="
            props.detailAllowed ||
            props.editAllowed ||
            props.deleteAllowed ||
            props.completeAllowed ||
            props.rejectAllowed
          "
        >
          Actions
        </th>
        <th>ID</th>
        <th>Title</th>
        <!-- <th>Description</th> -->
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
            props.detailAllowed ||
            props.editAllowed ||
            props.deleteAllowed ||
            props.completeAllowed ||
            props.rejectAllowed
          "
        >
          <button @click="onDetail(task.id)" v-if="props.detailAllowed">Detail</button>
          <button @click="onEdit(task.id)" v-if="props.editAllowed">Edit</button>
          <button @click="onDelete(task.id)" v-if="props.deleteAllowed">Delete</button>
          <button @click="onComplete(task.id)" v-if="props.completeAllowed">Complete</button>
          <button @click="onReject(task.id)" v-if="props.rejectAllowed">Reject</button>
        </td>
        <td>{{ task.id }}</td>
        <td>{{ task.title }}</td>
        <!-- <td>{{ task.description }}</td> -->
        <td>{{ task.user }}</td>
        <td>{{ departments[task.assignedDepartment] ?? 'Unknown' }}</td>
        <td>{{ statuses[task.status] ?? 'Unknown' }}</td>
      </tr>
    </tbody>
  </table>
</template>

<style scoped>
.empty-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 3rem 1rem;
  background: var(--surface);
  border: 1px dashed var(--border);
  border-radius: 12px;
  text-align: center;
}

.empty-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 4rem;
  height: 4rem;
  margin-bottom: 1rem;
  border-radius: 50%;
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.empty-icon-svg {
  width: 2rem;
  height: 2rem;
  color: var(--primary);
}

.empty-state h2 {
  font-size: 1.25rem;
  font-weight: 600;
}

.empty-state p {
  margin-top: 0.25rem;
  color: var(--muted);
  font-size: 0.9rem;
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
