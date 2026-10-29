<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <div class="user-section">
      <p>Welcome, {{ authStore.currentUser?.name }}</p>
      <button @click="authStore.logout()">Log Out</button>
    </div>
    <router-link to="/all-tasks">View All Tasks</router-link>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 4rem auto;
}
.user-section {
  margin: 2rem;
  padding: 1rem;
  gap: 1rem;
  display: flex;
  align-items: center;
  justify-content: flex-end;
}
</style>
