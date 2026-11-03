<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted, ref, watch } from 'vue'
import TaskList from '@/components/TaskList.vue'
import LoadingSpinner from '@/components/LoadingSpinner.vue'
import type { ITaskRow, ITaskDetail } from '@/types'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'

const taskStore = useTaskStore()
const tasks = ref<ITaskRow[]>([])
const taskDetail = ref<ITaskDetail | null>(null)

const departments: Record<number, string> = { 1: 'HR', 2: 'Sales', 3: 'Marketing' }
const statuses = ['Pending', 'Completed', 'Rejected']

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

const onDetailTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskDetail.value = {
    id: taskStore.PlayableTask?.id ?? -1,
    title: taskStore.PlayableTask?.title ?? '',
    description: taskStore.PlayableTask?.description ?? '',
    user: taskStore.PlayableTask?.user.name ?? '',
    assignedDepartment: taskStore.PlayableTask?.assignedDepartment ?? -1,
    status: taskStore.PlayableTask?.status ?? -1,
  }
  taskStore.openDetailModal()
}
</script>

<template>
  <main class="tasks-page">
    <LoadingSpinner :show="taskStore.listLoading" label="Loading tasks..." />
    <TaskList
      v-if="!taskStore.listLoading"
      :title="'All Tasks'"
      :tasks="tasks"
      :detail-allowed="true"
      @on-detail="onDetailTask"
    />
    <!-- DETAIL MODAL -->
    <Dialog
      class="dialog-root"
      :open="taskStore.detailModalOpen"
      @close="taskStore.closeDetailModal"
    >
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Task Details</DialogTitle>

          <div class="dialog-form" v-if="taskDetail != null">
            <label class="dialog-field">
              <span>Title</span>
              <input
                v-model="taskDetail.title"
                type="text"
                placeholder="Enter task title"
                disabled
              />
            </label>
            <label class="dialog-field">
              <span>Description</span>
              <textarea
                v-model="taskDetail.description"
                placeholder="Enter task description"
                disabled
              ></textarea>
            </label>
            <label class="dialog-field">
              <span>Requested by</span>
              <input v-model="taskDetail.user" type="text" disabled />
            </label>
            <label class="dialog-field">
              <span>Department</span>
              <select v-model="taskDetail.assignedDepartment" disabled>
                <option v-for="(name, id) in departments" :key="id" :value="Number(id)">
                  {{ name }}
                </option>
              </select>
            </label>
            <label class="dialog-field">
              <span>Status</span>
              <select v-model="taskDetail.status" disabled>
                <option v-for="(name, id) in statuses" :key="id" :value="id">{{ name }}</option>
              </select>
            </label>
          </div>

          <div class="dialog-actions">
            <button @click="taskStore.closeDetailModal()">Close</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
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
