<template>
  <Teleport to="body">
    <Transition name="toast">
      <div
        v-if="visible"
        :class="['toast', error ? 'toast--error' : '']"
        role="status"
        aria-live="polite"
      >
        <CheckCircle v-if="!error" :size="15" class="toast__icon" />
        <AlertCircle v-else :size="15" class="toast__icon" />
        {{ message }}
      </div>
    </Transition>
  </Teleport>
</template>

<script setup>
import { ref, watch } from 'vue'
import { CheckCircle, AlertCircle } from 'lucide-vue-next'

const props = defineProps({
  message: String,
  error: Boolean,
  trigger: Number,
})

const visible = ref(false)
let timer = null

watch(() => props.trigger, () => {
  if (!props.message) return
  visible.value = true
  clearTimeout(timer)
  timer = setTimeout(() => { visible.value = false }, 3500)
})
</script>

<style scoped>
.toast {
  position: fixed;
  bottom: 24px;
  right: 24px;
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 10px 16px;
  font-size: 13px;
  z-index: 300;
  display: flex;
  align-items: center;
  gap: 8px;
  max-width: 340px;
  box-shadow: 0 4px 24px rgba(0,0,0,.3);
}

.toast--error { border-color: var(--danger); }

.toast__icon { flex-shrink: 0; }
.toast:not(.toast--error) .toast__icon { color: var(--success); }
.toast--error .toast__icon { color: var(--danger); }

.toast-enter-active, .toast-leave-active { transition: all 0.25s ease; }
.toast-enter-from, .toast-leave-to { transform: translateY(16px); opacity: 0; }
</style>
