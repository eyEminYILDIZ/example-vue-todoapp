<script setup lang="ts">
import { useTaskStore } from '@/stores/TaskStore'
import { onMounted } from 'vue'

const taskStore = useTaskStore()

onMounted(async () => {
  await taskStore.loadAllTasks()
})
</script>

<template>
  <div class="home">
    <h1>All Tasks</h1>
    <p v-if="taskStore.isLoading">Loading tasks...</p>
    <div v-else>
      <ul>
        <li v-for="task in taskStore.AllTasks" :key="task.id">{{ task.title }}</li>
      </ul>
    </div>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 4rem auto;
}
</style>
