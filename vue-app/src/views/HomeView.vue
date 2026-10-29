<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
</script>

<template>
  <div class="home">
    <h1>Home</h1>
    <p>Welcome, {{ authStore.currentUser?.name }}</p>
  </div>
</template>

<style scoped>
.home {
  max-width: 600px;
  margin: 4rem auto;
}
</style>
