<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted, watch } from 'vue'
import { Dialog, DialogPanel, DialogTitle } from '@headlessui/vue'
import type { ITaskRow } from '@/types'
import { ref } from 'vue'
import TaskList from '@/components/TaskList.vue'

const taskStore = useTaskStore()
const tasks = ref<ITaskRow[]>([])

onMounted(async () => {
  await taskStore.loadPendingTasks()
})

watch(
  () => taskStore.PendingTasks,
  () => {
    tasks.value = taskStore.PendingTasks.map((task) => ({
      id: task.id,
      title: task.title,
      description: task.description,
      user: task.user.name,
      assignedDepartment: task.assignedDepartment,
      status: task.status,
    }))
  },
)

const onApproveTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openApproveModal()
}

const onRejectTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openRejectModal()
}
</script>

<template>
  <main class="tasks-page">
    <h1>Pending Tasks</h1>
    <p v-if="taskStore.listLoading">Loading tasks...</p>
    <TaskList
      v-else
      :title="'Pending Tasks'"
      :tasks="tasks"
      :approve-allowed="true"
      :reject-allowed="true"
      @on-approve="onApproveTask"
      @on-reject="onRejectTask"
    />
    <!-- APPROVE MODAL -->
    <Dialog
      class="dialog-root"
      :open="taskStore.approveModalOpen"
      @close="taskStore.closeApproveModal"
    >
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Approve Task</DialogTitle>

          <p class="dialog-body">Are you sure you want to approve this task?</p>

          <div class="dialog-actions">
            <button @click="taskStore.closeApproveModal()">Cancel</button>
            <button
              class="primary"
              @click="taskStore.approveTask(taskStore.PlayableTask?.id ?? -1)"
            >
              Approve
            </button>
          </div>
        </DialogPanel>
      </div>
    </Dialog>
    <!-- REJECT MODAL -->
    <Dialog
      class="dialog-root"
      :open="taskStore.rejectModalOpen"
      @close="taskStore.closeRejectModal"
    >
      <div class="dialog-backdrop" aria-hidden="true" />
      <div class="dialog-container">
        <DialogPanel class="dialog-panel">
          <DialogTitle class="dialog-title">Reject Task</DialogTitle>

          <p class="dialog-body">
            Are you sure you want to reject this task? This action cannot be undone.
          </p>

          <div class="dialog-actions">
            <button @click="taskStore.closeRejectModal()">Cancel</button>
            <button class="primary" @click="taskStore.rejectTask(taskStore.PlayableTask?.id ?? -1)">
              Reject
            </button>
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
