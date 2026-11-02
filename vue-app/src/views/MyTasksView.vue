<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted, ref } from 'vue'
import { Dialog, DialogPanel, DialogTitle, DialogDescription } from '@headlessui/vue'
import type { ITaskRow } from '@/types'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()
const tasks = ref<ITaskRow[]>([])

onMounted(async () => {
  await taskStore.loadMyTasks()
  tasks.value = taskStore.MyTasks.map((task) => ({
    id: task.id,
    title: task.title,
    description: task.description,
    user: task.user.name,
    assignedDepartment: task.assignedDepartment,
    status: task.status,
  }))
})

const onEditTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openEditModal()
}

const onDeleteTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openDeleteModal()
}
</script>

<template>
  <main class="tasks-page">
    <h1>My Tasks</h1>
    <p v-if="taskStore.editModalOpen">Editing task...</p>
    <p v-if="taskStore.deleteModalOpen">Deleting task...</p>
    <p v-if="taskStore.listLoading">Loading tasks...</p>
    <TaskList
      v-else
      :title="'My Tasks'"
      :tasks="tasks"
      :create-allowed="true"
      :edit-allowed="true"
      :delete-allowed="true"
      v-on:on-edit="onEditTask"
      v-on:on-delete="onDeleteTask"
    />
    <br />
    <br />
    <!-- EDIT -->
    <Dialog class="dialog-root" :open="taskStore.editModalOpen" @close="taskStore.closeEditModal">
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Edit Task</DialogTitle>
          <DialogDescription class="dialog-description">
            This will allow you to edit the selected task
          </DialogDescription>

          <p class="dialog-body">
            Are you sure you want to edit this task? Make the necessary changes and save them.
          </p>

          <div class="dialog-actions">
            <button @click="taskStore.closeEditModal()">Cancel</button>
            <button class="primary" @click="taskStore.closeEditModal()">Save</button>
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
