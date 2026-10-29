<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '@/stores/AuthStore'

const authStore = useAuthStore()
const router = useRouter()
const email = ref('')
const error = ref('')
const loading = ref(false)

const submit = async () => {
  error.value = ''
  loading.value = true
  try {
    await authStore.login(email.value)
    await router.push('/')
  } catch {
    error.value = 'Login failed. Check your email and try again.'
  } finally {
    loading.value = false
  }
}
</script>

<template>
  <form class="login" @submit.prevent="submit">
    <h1>Log In</h1>
    <input v-model="email" type="email" placeholder="Enter your email" required />
    <button type="submit" :disabled="loading">Log In</button>
    <p v-if="error" class="error">{{ error }}</p>
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
