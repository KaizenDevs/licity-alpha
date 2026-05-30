<template>
  <div class="filters">
    <div class="field">
      <label>{{ t('filters.search') }}</label>
      <input
        v-model="store.filters.q"
        type="text"
        :placeholder="t('filters.searchPlaceholder')"
        @keydown.enter="emit('search')"
      />
    </div>

    <div class="field">
      <label>{{ t('filters.department') }}</label>
      <select v-model="store.filters.department">
        <option value="">{{ t('filters.allDepartments') }}</option>
        <option v-for="d in DEPARTMENTS" :key="d" :value="d">{{ d }}</option>
      </select>
    </div>

    <div class="field">
      <label>{{ t('filters.modality') }}</label>
      <select v-model="store.filters.modality">
        <option value="">{{ t('filters.allModalities') }}</option>
        <option v-for="m in MODALITIES" :key="m" :value="m">{{ m }}</option>
      </select>
    </div>

    <div class="filter-actions">
      <button class="btn btn-primary" :disabled="store.loading" @click="emit('search')">
        {{ t('filters.apply') }}
      </button>
      <button class="btn btn-secondary" @click="emit('reset')">
        {{ t('filters.reset') }}
      </button>
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSecopStore } from '../stores/secop.js'
import { DEPARTMENTS, MODALITIES } from '../config/api.js'

const { t } = useI18n()
const store = useSecopStore()
const emit = defineEmits(['search', 'reset'])
</script>

<style scoped>
.filters {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 20px;
  display: grid;
  grid-template-columns: 1fr 1fr 1fr auto;
  gap: 12px;
  margin-bottom: 20px;
  align-items: end;
}

@media (max-width: 768px) {
  .filters { grid-template-columns: 1fr; }
}

.field label {
  display: block;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
  margin-bottom: 6px;
}

.field input,
.field select {
  width: 100%;
  background: var(--surface2);
  border: 1px solid var(--border);
  border-radius: 6px;
  color: var(--text);
  padding: 9px 12px;
  font-size: 13px;
  outline: none;
  transition: border-color 0.15s;
}

.field input:focus,
.field select:focus { border-color: var(--accent); }

.field select option { background: var(--surface2); }

.filter-actions {
  display: flex;
  gap: 8px;
  align-items: flex-end;
}
</style>
