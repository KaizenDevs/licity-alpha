<template>
  <Teleport to="body">
    <div v-if="row" class="overlay" @click.self="emit('close')">
      <div class="modal" role="dialog" aria-modal="true">
        <div class="modal__header">
          <h2>{{ row.nombre_del_procedimiento || '—' }}</h2>
          <button class="modal__close" :aria-label="t('modal.close')" @click="emit('close')">
            <X :size="18" />
          </button>
        </div>

        <div class="detail-grid">
          <template v-for="field in DETAIL_FIELDS" :key="field.key">
            <div :class="['detail-item', field.full ? 'full' : '']">
              <label>{{ t(field.i18n) }}</label>
              <p v-if="field.format === 'url'">
                <a
                  v-if="row[field.key]"
                  :href="row[field.key]"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="detail-link"
                >
                  {{ t('modal.openSecop') }}
                  <ExternalLink :size="12" style="vertical-align:-1px;margin-left:3px" />
                </a>
                <span v-else>—</span>
              </p>
              <p v-else-if="field.format === 'currency'">{{ formatCurrencyFull(row[field.key]) }}</p>
              <p v-else-if="field.format === 'date'">{{ formatDate(row[field.key]) }}</p>
              <p v-else>{{ row[field.key] || '—' }}</p>
            </div>
          </template>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted } from 'vue'
import { X, ExternalLink } from 'lucide-vue-next'
import { DETAIL_FIELDS } from '../config/api.js'
import { formatCurrencyFull, formatDate } from '../utils/format.js'

const { t } = useI18n()
const props = defineProps({ row: Object })
const emit = defineEmits(['close'])

function onKeydown(e) {
  if (e.key === 'Escape') emit('close')
}

onMounted(() => document.addEventListener('keydown', onKeydown))
onUnmounted(() => document.removeEventListener('keydown', onKeydown))
</script>

<style scoped>
.overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, .6);
  z-index: 200;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 20px;
}

.modal {
  background: var(--surface);
  border: 1px solid var(--border);
  border-radius: 12px;
  padding: 28px;
  max-width: 700px;
  width: 100%;
  max-height: 90vh;
  overflow-y: auto;
}

.modal__header {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 24px;
}

.modal__header h2 {
  flex: 1;
  font-size: 15px;
  line-height: 1.5;
  color: var(--text);
}

.modal__close {
  flex-shrink: 0;
  background: none;
  border: none;
  color: var(--muted);
  cursor: pointer;
  padding: 2px;
  display: flex;
  align-items: center;
  transition: color 0.15s;
}

.modal__close:hover { color: var(--text); }

.detail-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 16px;
}

@media (max-width: 500px) { .detail-grid { grid-template-columns: 1fr; } }

.detail-item label {
  display: block;
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  margin-bottom: 4px;
}

.detail-item p {
  color: var(--text);
  font-size: 13px;
  line-height: 1.6;
  word-break: break-word;
  white-space: pre-wrap;
}

.detail-item.full { grid-column: 1 / -1; }

.detail-link {
  color: var(--accent);
  text-decoration: none;
  font-size: 13px;
}

.detail-link:hover { text-decoration: underline; }
</style>
