<script setup lang="ts">
import { computed, onMounted } from 'vue'
import { useAuthStore } from '@/stores/AuthStore'
import { useTaskStore } from '@/stores/TaskStore'
import LoadingSpinner from '@/components/LoadingSpinner.vue'

const authStore = useAuthStore()
const taskStore = useTaskStore()

const PENDING = 0
const COMPLETED = 1
const REJECTED = 2

onMounted(async () => {
  // Errors are already reported by the store (toast + console).
  await Promise.allSettled([
    taskStore.loadAllTasks(),
    taskStore.loadMyTasks(),
    taskStore.loadPendingTasks(),
  ])
})

const countByStatus = (status: number) =>
  taskStore.AllTasks.filter((task) => task.status === status).length

const cards = computed(() => [
  { label: 'Total tasks', value: taskStore.AllTasks.length, hint: 'All departments' },
  { label: 'Pending', value: countByStatus(PENDING), hint: 'Waiting to be handled' },
  { label: 'Completed', value: countByStatus(COMPLETED), hint: 'Done' },
  { label: 'Rejected', value: countByStatus(REJECTED), hint: 'Turned down' },
  { label: 'My tasks', value: taskStore.MyTasks.length, hint: 'Requested by you' },
  {
    label: 'Awaiting my department',
    value: taskStore.PendingTasks.length,
    hint: 'Pending tasks assigned to your department',
  },
])
</script>

<template>
  <div class="home">
    <p class="welcome">
      Welcome, <strong>{{ authStore.currentUser?.name }}</strong>
    </p>

    <LoadingSpinner :show="taskStore.listLoading" label="Loading statistics..." />

    <section class="stats" aria-label="Task statistics">
      <article v-for="card in cards" :key="card.label" class="stat-card">
        <span class="stat-label">{{ card.label }}</span>
        <strong class="stat-value">{{ card.value }}</strong>
        <span class="stat-hint">{{ card.hint }}</span>
      </article>
    </section>
  </div>
</template>

<style scoped>
.home {
  max-width: 1000px;
  margin: 4rem auto;
  padding: 0 1rem;
}

.welcome {
  font-size: 2.25rem;
  line-height: 1.3;
  color: var(--muted);
}

.welcome strong {
  color: var(--primary);
  font-weight: 700;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1rem;
  margin-top: 1.5rem;
}

.stat-card {
  --accent: var(--primary);
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  padding: 1rem 1.25rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-left: 4px solid var(--accent);
  border-radius: 8px;
}

.stat-label {
  font-size: 0.875rem;
  color: var(--muted);
}

.stat-value {
  font-size: 2rem;
  line-height: 1.2;
  color: var(--accent);
}

.stat-hint {
  font-size: 0.8rem;
  color: var(--muted);
}
</style>
