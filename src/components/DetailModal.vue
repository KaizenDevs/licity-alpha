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
                  v-if="resolveUrl(row[field.key])"
                  :href="resolveUrl(row[field.key])"
                  target="_blank"
                  rel="noopener noreferrer"
                  class="detail-link"
                >
                  {{ t('modal.openSecop') }}
                  <ExternalLink :size="12" style="vertical-align:-1px;margin-left:3px" />
                </a>
                <span v-if="resolveUrl(row[field.key])" class="detail-note">
                  <Info :size="11" style="vertical-align:-1px;margin-right:3px" />{{ t('modal.loginNote') }}
                </span>
                <span v-else>—</span>
              </p>
              <p v-else-if="field.format === 'currency'">{{ formatCurrencyFull(row[field.key]) }}</p>
              <p v-else-if="field.format === 'date'">{{ formatDate(row[field.key]) }}</p>
              <p v-else>{{ row[field.key] || '—' }}</p>
            </div>
          </template>
        </div>

        <div class="winner-section">
          <h3 class="winner-title">{{ t('modal.winnerTitle') }}</h3>
          <p v-if="contractsLoading" class="winner-loading">{{ t('modal.winnerLoading') }}</p>
          <p v-else-if="!contracts.length" class="winner-empty">{{ t('modal.winnerNone') }}</p>
          <div v-else class="winner-list">
            <div v-for="(c, i) in contracts" :key="i" class="winner-card">
              <div class="winner-card__name">{{ c.proveedor_adjudicado || '—' }}</div>
              <div class="winner-card__meta">
                <span class="winner-card__value">{{ formatCurrencyFull(c.valor_del_contrato) }}</span>
                <span v-if="c.referencia_del_contrato" class="winner-card__ref">{{ c.referencia_del_contrato }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Teleport>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { onMounted, onUnmounted, watch, ref } from 'vue'
import { X, ExternalLink, Info } from 'lucide-vue-next'
import { DETAIL_FIELDS, API } from '../config/api.js'
import { formatCurrencyFull, formatDate } from '../utils/format.js'

function resolveUrl(val) {
  if (!val) return null
  if (typeof val === 'string') return val
  return val.url ?? null
}

const { t } = useI18n()
const props = defineProps({ row: Object })
const emit = defineEmits(['close'])

const contracts = ref([])
const contractsLoading = ref(false)

watch(() => props.row, async (row) => {
  contracts.value = []
  if (!row?.id_del_portafolio) return
  contractsLoading.value = true
  try {
    const id = row.id_del_portafolio.replace(/'/g, "''")
    const params = new URLSearchParams({
      '$where': `proceso_de_compra='${id}'`,
      '$select': 'proveedor_adjudicado,valor_del_contrato,referencia_del_contrato,tipo_de_contrato',
      '$limit': 20,
    })
    if (API.APP_TOKEN) params.set('$$app_token', API.APP_TOKEN)
    const res = await fetch(`${API.BASE}/${API.DATASETS.contracts}.json?${params}`)
    if (res.ok) contracts.value = await res.json()
  } finally {
    contractsLoading.value = false
  }
}, { immediate: true })

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

.detail-note {
  display: block;
  margin-top: 5px;
  color: var(--muted);
  font-size: 11px;
}

.winner-section {
  margin-top: 24px;
  padding-top: 20px;
  border-top: 1px solid var(--border);
}

.winner-title {
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  color: var(--muted);
  margin-bottom: 12px;
}

.winner-loading,
.winner-empty {
  font-size: 13px;
  color: var(--muted);
}

.winner-list {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.winner-card {
  background: var(--surface-alt, rgba(0,0,0,.04));
  border: 1px solid var(--border);
  border-radius: 8px;
  padding: 12px 14px;
}

.winner-card__name {
  font-size: 14px;
  font-weight: 600;
  color: var(--text);
  margin-bottom: 4px;
}

.winner-card__meta {
  display: flex;
  gap: 12px;
  flex-wrap: wrap;
  align-items: center;
}

.winner-card__value {
  font-size: 13px;
  color: var(--accent);
  font-weight: 600;
}

.winner-card__ref {
  font-size: 11px;
  color: var(--muted);
}
</style>
