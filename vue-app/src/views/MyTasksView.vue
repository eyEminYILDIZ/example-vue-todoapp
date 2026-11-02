<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted, ref, watch } from 'vue'
import type { ITaskDetail } from '@/types'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import type { ITaskRow } from '@/types'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()
const tasks = ref<ITaskRow[]>([])

onMounted(async () => {
  await taskStore.loadMyTasks()
})

watch(
  () => taskStore.MyTasks,
  () => {
    tasks.value = taskStore.MyTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      user: task.user.name,
      assignedDepartment: task.assignedDepartment,
      status: task.status,
    }))
  },
)

const departments: Record<number, string> = { 1: 'HR', 2: 'Sales', 3: 'Marketing' }
const statuses = ['Pending', 'Completed', 'Rejected']

const taskDetail = ref<ITaskDetail | null>(null)
const onEditTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskDetail.value = {
    id: taskStore.PlayableTask?.id ?? -1,
    title: taskStore.PlayableTask?.title ?? '',
    description: taskStore.PlayableTask?.description ?? '',
    user: taskStore.PlayableTask?.user.name ?? '',
    assignedDepartment: taskStore.PlayableTask?.assignedDepartment ?? -1,
    status: taskStore.PlayableTask?.status ?? -1,
  }
  taskStore.openEditModal()
}

const onDeleteTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openDeleteModal()
}
</script>

<template>
  <main class="tasks-page">
    <div class="flex justify-between items-center">
      <h1>My Tasks</h1>
      <button class="primary" @click="taskStore.openCreateModal()">Create Task</button>
    </div>
    <p v-if="taskStore.listLoading">Loading tasks...</p>
    <TaskList
      v-else
      :title="'My Tasks'"
      :tasks="tasks"
      :create-allowed="true"
      :edit-allowed="true"
      :delete-allowed="true"
      @on-edit="onEditTask"
      @on-delete="onDeleteTask"
    />
    <!-- EDIT MODAL -->
    <Dialog class="dialog-root" :open="taskStore.editModalOpen" @close="taskStore.closeEditModal">
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Edit Task</DialogTitle>

          <div class="dialog-form" v-if="taskDetail != null">
            <label class="dialog-field">
              <span>Title</span>
              <input
                v-model="taskDetail.title"
                type="text"
                placeholder="Enter task title"
                required
              />
            </label>
            <label class="dialog-field">
              <span>Description</span>
              <textarea
                v-model="taskDetail.description"
                placeholder="Enter task description"
                required
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
            <button @click="taskStore.closeEditModal()">Cancel</button>
            <button class="primary" @click="taskStore.editTask(taskDetail!)">Save</button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
    <!-- DELETE MODAL -->
    <Dialog
      class="dialog-root"
      :open="taskStore.deleteModalOpen"
      @close="taskStore.closeDeleteModal"
    >
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Delete Task</DialogTitle>

          <p class="dialog-body">
            Are you sure you want to delete this task? This action cannot be undone.
          </p>

          <div class="dialog-actions">
            <button @click="taskStore.closeDeleteModal()">Cancel</button>
            <button class="primary" @click="taskStore.deleteTask(taskStore.PlayableTask?.id ?? -1)">
              Delete
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
    <!-- CREATE MODAL -->
    <Dialog
      class="dialog-root"
      :open="taskStore.createModalOpen"
      @close="taskStore.closeCreateModal"
    >
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Create Task</DialogTitle>

          <p class="dialog-body">Fill in the details for the new task and save it.</p>

          <div class="dialog-actions">
            <button @click="taskStore.closeCreateModal()">Cancel</button>
            <button class="primary" @click="taskStore.closeCreateModal()">Create</button>
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
