<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-links">
        <RouterLink to="/" exact-active-class="active">Home</RouterLink>
        <RouterLink to="/all-tasks" active-class="active">All Tasks</RouterLink>
        <RouterLink to="/my-tasks" active-class="active">My Tasks</RouterLink>
        <RouterLink to="/pending-tasks" active-class="active">Pending Tasks</RouterLink>
      </div>
      <div class="nav-user">
        <span>{{ authStore.currentUser?.name }} ({{ authStore.currentUser?.email }})</span>
        <button @click="authStore.logout()">Log Out</button>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0.75rem 1.5rem;
  border-bottom: 1px solid var(--border, #ddd);
}
.nav-links,
.nav-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}
.nav-links a.active {
  font-weight: bold;
  text-decoration: underline;
}
</style>
