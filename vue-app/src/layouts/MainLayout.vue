<script setup lang="ts">
import { ArrowPathIcon, ArrowRightOnRectangleIcon, UserCircleIcon } from '@heroicons/vue/24/solid'
import { useAuthStore } from '@/stores/AuthStore'
import { useTaskStore } from '@/stores/TaskStore'

const authStore = useAuthStore()
const taskStore = useTaskStore()
</script>

<template>
  <div class="layout">
    <nav class="navbar">
      <div class="nav-left">
        <RouterLink to="/" class="brand" aria-label="Home">
          <img src="/favicon.svg" alt="" width="36" height="36" />
        </RouterLink>
        <div class="nav-links">
          <RouterLink to="/" exact-active-class="active">Home</RouterLink>
          <RouterLink to="/all-tasks" active-class="active">All Tasks</RouterLink>
          <RouterLink to="/my-tasks" active-class="active">My Tasks</RouterLink>
          <RouterLink to="/pending-tasks" active-class="active">Pending Tasks</RouterLink>
        </div>
      </div>
      <div class="nav-actions">
        <div class="tooltip-wrap">
          <button
            class="icon-button"
            aria-label="Reset data"
            aria-describedby="reset-tooltip"
            :disabled="taskStore.resetLoading"
            @click="taskStore.resetAPI()"
          >
            <ArrowPathIcon class="icon" :class="{ spinning: taskStore.resetLoading }" />
          </button>
          <span id="reset-tooltip" role="tooltip" class="tooltip">
            <strong>Reset data</strong>
            Restores all tasks to their defaults, then reloads the page. Any changes you made will
            be lost.
          </span>
        </div>
        <div class="nav-user">
          <UserCircleIcon class="avatar" aria-hidden="true" />
          <div class="user-info">
            <span class="user-name">{{ authStore.currentUser?.name }}</span>
            <span class="user-email">{{ authStore.currentUser?.email }}</span>
          </div>
          <div class="tooltip-wrap">
            <button
              class="icon-button"
              aria-label="Log out"
              aria-describedby="logout-tooltip"
              @click="authStore.logout()"
            >
              <ArrowRightOnRectangleIcon class="icon" />
            </button>
            <span id="logout-tooltip" role="tooltip" class="tooltip">
              <strong>Log out</strong>
              Signs you out of {{ authStore.currentUser?.email }} and returns you to the login page.
            </span>
          </div>
        </div>
      </div>
    </nav>
    <RouterView />
  </div>
</template>

<style scoped>
.navbar {
  position: sticky;
  top: 0;
  z-index: 10;
  display: flex;
  flex-wrap: wrap;
  align-items: center;
  justify-content: space-between;
  gap: 0.75rem 1.5rem;
  padding: 0.75rem 1.5rem;
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  box-shadow: 0 1px 3px rgb(0 0 0 / 0.06);
}

.nav-left,
.nav-links,
.nav-actions,
.nav-user {
  display: flex;
  align-items: center;
}

.nav-left {
  gap: 1.25rem;
}

.brand {
  display: flex;
  border-radius: 8px;
}

.brand img {
  display: block;
  width: 2.25rem;
  height: 2.25rem;
}

.nav-links {
  gap: 0.25rem;
}

.nav-actions {
  gap: 1.25rem;
}

.nav-user {
  gap: 0.75rem;
  padding-left: 1.25rem;
  border-left: 1px solid var(--border);
}

.nav-links a {
  padding: 0.45rem 0.9rem;
  border-radius: 6px;
  color: var(--muted);
  font-weight: 500;
  text-decoration: none;
  transition:
    background-color 0.15s,
    color 0.15s;
}

.nav-links a:hover {
  background: var(--bg);
  color: var(--text);
}

.nav-links a.active {
  background: color-mix(in srgb, var(--primary) 10%, transparent);
  color: var(--primary);
  font-weight: 600;
}

.avatar {
  width: 2.25rem;
  height: 2.25rem;
  color: var(--primary);
}

.icon-button {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem;
}

.icon {
  width: 1.25rem;
  height: 1.25rem;
}

.icon.spinning {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.tooltip-wrap {
  position: relative;
}

.tooltip {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  z-index: 20;
  width: 16rem;
  padding: 0.6rem 0.75rem;
  border-radius: 6px;
  background: var(--text);
  color: #fff;
  font-size: 0.8rem;
  line-height: 1.4;
  visibility: hidden;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.15s;
}

.tooltip strong {
  display: block;
  margin-bottom: 0.15rem;
}

.tooltip-wrap:hover .tooltip,
.tooltip-wrap:focus-within .tooltip {
  visibility: visible;
  opacity: 1;
}

.user-info {
  display: flex;
  flex-direction: column;
  line-height: 1.25;
}

.user-name {
  font-size: 0.9rem;
  font-weight: 600;
}

.user-email {
  font-size: 0.75rem;
  color: var(--muted);
}

@media (max-width: 768px) {
  .user-info {
    display: none;
  }

  .nav-user {
    padding-left: 0;
    border-left: none;
  }
}
</style>
