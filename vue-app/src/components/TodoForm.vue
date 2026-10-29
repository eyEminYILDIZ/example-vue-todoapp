<script setup lang="ts">
import { computed, reactive, watch } from 'vue'
import type { Priority, Todo, TodoInput } from '@/types/todo'

const props = defineProps<{ todo?: Todo }>()
const emit = defineEmits<{
  submit: [input: TodoInput]
  cancel: []
}>()

const priorities: { value: Priority; label: string }[] = [
  { value: 'low', label: 'Düşük' },
  { value: 'medium', label: 'Orta' },
  { value: 'high', label: 'Yüksek' },
]

const form = reactive<TodoInput>({ title: '', description: '', priority: 'medium' })
const isEdit = computed(() => !!props.todo)
const titleError = computed(() => (form.title.trim() ? '' : 'Başlık zorunludur.'))
let touched = false

watch(
  () => props.todo,
  (todo) => {
    form.title = todo?.title ?? ''
    form.description = todo?.description ?? ''
    form.priority = todo?.priority ?? 'medium'
  },
  { immediate: true },
)

function onSubmit() {
  touched = true
  if (titleError.value) return
  emit('submit', {
    title: form.title.trim(),
    description: form.description.trim(),
    priority: form.priority,
  })
  if (!isEdit.value) {
    form.title = ''
    form.description = ''
    form.priority = 'medium'
    touched = false
  }
}
</script>

<template>
  <form class="todo-form" novalidate @submit.prevent="onSubmit">
    <div class="field">
      <label for="title">Başlık</label>
      <input
        id="title"
        v-model="form.title"
        type="text"
        maxlength="100"
        placeholder="Ne yapılacak?"
        :aria-invalid="touched && !!titleError"
        @input="touched = true"
      />
      <small v-if="touched && titleError" class="error">{{ titleError }}</small>
    </div>

    <div class="field">
      <label for="description">Açıklama</label>
      <textarea
        id="description"
        v-model="form.description"
        rows="2"
        maxlength="300"
        placeholder="İsteğe bağlı"
      />
    </div>

    <div class="field">
      <label for="priority">Öncelik</label>
      <select id="priority" v-model="form.priority">
        <option v-for="p in priorities" :key="p.value" :value="p.value">{{ p.label }}</option>
      </select>
    </div>

    <div class="actions">
      <button type="submit" class="primary">{{ isEdit ? 'Güncelle' : 'Ekle' }}</button>
      <button v-if="isEdit" type="button" @click="emit('cancel')">İptal</button>
    </div>
  </form>
</template>

<style scoped>
.todo-form {
  display: grid;
  gap: 0.75rem;
}
.field {
  display: grid;
  gap: 0.25rem;
}
label {
  font-size: 0.85rem;
  font-weight: 600;
}
input,
textarea,
select {
  padding: 0.5rem 0.65rem;
  border: 1px solid var(--border);
  border-radius: 6px;
  font: inherit;
  background: var(--surface);
  color: inherit;
}
input[aria-invalid='true'] {
  border-color: var(--danger);
}
.error {
  color: var(--danger);
}
.actions {
  display: flex;
  gap: 0.5rem;
}
</style>
