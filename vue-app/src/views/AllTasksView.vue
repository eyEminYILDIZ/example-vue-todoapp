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

const onDetailTask = async (taskId: number) => {
  await taskStore.loadTask(taskId)
  taskStore.openDetailModal()
}
</script>

<template>
  <main class="tasks-page">
    <h1>All Tasks</h1>
    <p v-if="taskStore.listLoading">Loading tasks...</p>
    <TaskList
      v-else
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

          <p class="dialog-body"><strong>Title:</strong> {{ taskStore.PlayableTask?.title }}</p>
          <p class="dialog-body">
            <strong>Description:</strong> {{ taskStore.PlayableTask?.description }}
          </p>
          <p class="dialog-body">
            <strong>Requested by:</strong> {{ taskStore.PlayableTask?.user?.name }}
          </p>
          <p class="dialog-body">
            <strong>Department:</strong> {{ taskStore.PlayableTask?.assignedDepartment }}
          </p>
          <p class="dialog-body">
            <strong>Status:</strong>
            {{ ['Pending', 'Completed', 'Rejected'][taskStore.PlayableTask?.status] ?? 'Unknown' }}
          </p>

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
