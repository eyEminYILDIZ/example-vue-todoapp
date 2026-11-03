<script setup lang="ts">
import { ClipboardDocumentCheckIcon, EnvelopeIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/AuthStore'
import { ref } from 'vue'

const authStore = useAuthStore()
const email = ref('mary@company.com')
</script>

<template>
  <main class="login-page">
    <form class="login" @submit.prevent="authStore.login(email)">
      <div class="logo" aria-hidden="true">
        <ClipboardDocumentCheckIcon class="logo-icon" />
      </div>
      <h1>Welcome</h1>
      <p class="subtitle">Log in with your company email to manage your department's tasks.</p>

      <label class="field">
        <span>Email</span>
        <div class="input-wrap">
          <EnvelopeIcon class="input-icon" aria-hidden="true" />
          <input
            v-model="email"
            type="email"
            placeholder="name@company.com"
            autocomplete="email"
            required
          />
        </div>
      </label>

      <button class="primary submit" type="submit" :disabled="authStore.isLoading">
        {{ authStore.isLoading ? 'Logging in...' : 'Log In' }}
      </button>

      <p v-if="authStore.errorText" class="error" role="alert">{{ authStore.errorText }}</p>
    </form>
  </main>
</template>

<style scoped>
.login-page {
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  padding: 1rem;
}

.login {
  display: flex;
  flex-direction: column;
  width: 100%;
  max-width: 400px;
  padding: 2.5rem 2rem;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  box-shadow: 0 10px 30px rgb(0 0 0 / 0.08);
}

.logo {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 3.5rem;
  height: 3.5rem;
  margin: 0 auto 1rem;
  border-radius: 12px;
  background: color-mix(in srgb, var(--primary) 10%, transparent);
}

.logo-icon {
  width: 2rem;
  height: 2rem;
  color: var(--primary);
}

h1 {
  font-size: 1.75rem;
  font-weight: 700;
  text-align: center;
}

.subtitle {
  margin: 0.5rem 0 1.5rem;
  color: var(--muted);
  font-size: 0.9rem;
  text-align: center;
}

.field {
  display: flex;
  flex-direction: column;
  gap: 0.35rem;
  font-size: 0.875rem;
  font-weight: 500;
}

.input-wrap {
  position: relative;
}

.input-icon {
  position: absolute;
  top: 50%;
  left: 0.75rem;
  width: 1.1rem;
  height: 1.1rem;
  color: var(--muted);
  transform: translateY(-50%);
  pointer-events: none;
}

input {
  width: 100%;
  padding: 0.6rem 0.75rem 0.6rem 2.5rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  background: var(--surface);
  color: var(--text);
  font: inherit;
  font-weight: 400;
}

input:focus {
  border-color: var(--primary);
  outline: 3px solid color-mix(in srgb, var(--primary) 25%, transparent);
}

.submit {
  margin-top: 1.25rem;
  padding: 0.65rem 0.8rem;
  font-weight: 600;
}

.error {
  margin-top: 1rem;
  padding: 0.6rem 0.75rem;
  border: 1px solid color-mix(in srgb, var(--danger) 30%, transparent);
  border-radius: 6px;
  background: color-mix(in srgb, var(--danger) 8%, transparent);
  color: var(--danger);
  font-size: 0.875rem;
}
</style>
