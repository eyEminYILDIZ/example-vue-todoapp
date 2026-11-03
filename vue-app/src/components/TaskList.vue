<script setup lang="ts">
import { computed } from 'vue'
import {
  CheckCircleIcon,
  EyeIcon,
  InboxIcon,
  PencilSquareIcon,
  TrashIcon,
  XCircleIcon,
} from '@heroicons/vue/24/outline'
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
const statusClasses = ['pending', 'completed', 'rejected']

const hasActions = computed(
  () =>
    props.detailAllowed ||
    props.editAllowed ||
    props.deleteAllowed ||
    props.completeAllowed ||
    props.rejectAllowed,
)
</script>

<template>
  <div v-if="!props.tasks || props.tasks.length === 0" class="empty-state" role="status">
    <span class="empty-icon" aria-hidden="true">
      <InboxIcon class="empty-icon-svg" />
    </span>
    <h2>No tasks available</h2>
    <p>There is nothing to show here right now.</p>
  </div>
  <div v-else class="table-wrap">
    <table>
      <thead>
        <tr>
          <th v-if="hasActions">Actions</th>
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
          <td v-if="hasActions">
            <div class="actions">
              <button @click="onDetail(task.id)" v-if="props.detailAllowed">
                <EyeIcon class="btn-icon" />
                Detail
              </button>
              <button @click="onEdit(task.id)" v-if="props.editAllowed">
                <PencilSquareIcon class="btn-icon" />
                Edit
              </button>
              <button class="danger" @click="onDelete(task.id)" v-if="props.deleteAllowed">
                <TrashIcon class="btn-icon" />
                Delete
              </button>
              <button @click="onComplete(task.id)" v-if="props.completeAllowed">
                <CheckCircleIcon class="btn-icon" />
                Complete
              </button>
              <button class="danger" @click="onReject(task.id)" v-if="props.rejectAllowed">
                <XCircleIcon class="btn-icon" />
                Reject
              </button>
            </div>
          </td>
          <td class="id">#{{ task.id }}</td>
          <td class="title">{{ task.title }}</td>
          <!-- <td>{{ task.description }}</td> -->
          <td>{{ task.user }}</td>
          <td>{{ departments[task.assignedDepartment] ?? 'Unknown' }}</td>
          <td>
            <span class="badge" :class="statusClasses[task.status]">
              {{ statuses[task.status] ?? 'Unknown' }}
            </span>
          </td>
        </tr>
      </tbody>
    </table>
  </div>
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

.table-wrap {
  overflow-x: auto;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
}

table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

th,
td {
  padding: 0.85rem 1rem;
  border-bottom: 1px solid var(--border);
}

th {
  background: var(--bg);
  color: var(--muted);
  font-size: 0.75rem;
  font-weight: 600;
  letter-spacing: 0.04em;
  text-transform: uppercase;
  white-space: nowrap;
}

tbody tr {
  transition: background-color 0.15s;
}

tbody tr:hover {
  background: color-mix(in srgb, var(--primary) 4%, transparent);
}

tbody tr:last-child td {
  border-bottom: none;
}

.actions {
  display: flex;
  gap: 0.375rem;
}

.actions button {
  display: inline-flex;
  align-items: center;
  gap: 0.3rem;
  padding: 0.3rem 0.65rem;
  font-size: 0.85rem;
}

.btn-icon {
  width: 1rem;
  height: 1rem;
}

.id {
  color: var(--muted);
  font-variant-numeric: tabular-nums;
}

.title {
  font-weight: 500;
}

.badge {
  display: inline-block;
  padding: 0.15rem 0.6rem;
  border-radius: 999px;
  font-size: 0.8rem;
  font-weight: 500;
  background: var(--bg);
  color: var(--muted);
}

.badge.pending {
  background: #fef3c7;
  color: #92400e;
}

.badge.completed {
  background: #dcfce7;
  color: #166534;
}

.badge.rejected {
  background: #fee2e2;
  color: #991b1b;
}
</style>
