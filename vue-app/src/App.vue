<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const email = ref('')

</script>

<template>
<div id="app">
  <div v-if="authStore.isAuthenticated()">
    Welcome, {{ authStore.currentUser?.name }}
    <button @click="authStore.logout()">Log Out</button>
  </div>
  <div v-else>
    Please log in.
    <input v-model="email" placeholder="Enter your email" />
    <button @click="authStore.login(email)">Log In</button>
  </div>
</div>
</template>

<style scoped>

</style>
