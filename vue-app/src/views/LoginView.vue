<script setup lang="ts">
import { useAuthStore } from '@/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const email = ref('mary@company.com')
</script>

<template>
  <form class="login" @submit.prevent="authStore.login(email)">
    <h1>Log In</h1>
    <input v-model="email" type="email" placeholder="Enter your email" required />
    <button type="submit" :disabled="authStore.isLoading">Log In</button>
    <p v-if="authStore.errorText" class="error">{{ authStore.errorText }}</p>
  </form>
</template>

<style scoped>
.login {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
  max-width: 320px;
  margin: 4rem auto;
}
.error {
  color: crimson;
}
</style>
