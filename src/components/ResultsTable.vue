<template>
  <!-- Loading -->
  <div v-if="store.loading" class="spinner-wrap">
    <div class="spinner" />
    <span>{{ t('table.loading') }}</span>
  </div>

  <!-- Empty -->
  <div v-else-if="searched && !store.hasResults" class="empty">
    <Inbox :size="40" :stroke-width="1.25" class="empty__icon" />
    <h3>{{ t('table.noResults') }}</h3>
    <p>{{ t('table.noResultsHint') }}</p>
  </div>

  <!-- Table -->
  <template v-else-if="store.hasResults">
    <div class="toolbar">
      <span class="count">{{ t('table.found', { n: store.total.toLocaleString('es-CO') }) }}</span>
      <div class="spacer" />
      <button class="btn btn-success" :disabled="exporting" @click="emit('export')">
        <Download :size="13" style="margin-right:4px;vertical-align:-1px" />
        {{ t('table.export') }}
      </button>
    </div>

    <div class="table-wrap">
      <table>
        <thead>
          <tr>
            <th
              v-for="col in TABLE_FIELDS"
              :key="col.key"
              :class="sortClass(col.key)"
              @click="col.sortable && store.setSort(col.key)"
            >
              {{ t(col.i18n) }}
              <span v-if="col.sortable" class="sort-icon" />
            </th>
            <th>{{ t('table.detail') }}</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="(row, i) in store.rows" :key="i">
            <td :title="row.nombre_del_procedimiento">{{ truncate(row.nombre_del_procedimiento, 60) }}</td>
            <td :title="row.nombre_entidad">{{ truncate(row.nombre_entidad, 40) }}</td>
            <td>{{ row.departamento_entidad || '—' }}</td>
            <td>{{ shortModality(row.modalidad_de_contratacion) }}</td>
            <td class="value-cell">{{ formatCurrency(row.valor_total_adjudicacion) }}</td>
            <td><StatusChip :status="row.estado_del_procedimiento" /></td>
            <td>{{ formatDate(row.fecha_de_publicacion_del) }}</td>
            <td>
              <button class="btn btn-secondary btn-sm" @click="emit('detail', i)">
                {{ t('table.detail') }}
              </button>
            </td>
          </tr>
        </tbody>
      </table>
    </div>
  </template>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { useSecopStore } from '../stores/secop.js'
import { TABLE_FIELDS } from '../config/api.js'
import { formatCurrency, formatDate, truncate } from '../utils/format.js'
import StatusChip from './StatusChip.vue'
import { Inbox, Download } from 'lucide-vue-next'

const { t } = useI18n()
const store = useSecopStore()

defineProps({
  searched: Boolean,
  exporting: Boolean,
})

const emit = defineEmits(['detail', 'export'])

function sortClass(col) {
  if (store.sortCol !== col) return ''
  return store.sortDir === 'ASC' ? 'asc' : 'desc'
}

const MODALITY_SHORT = {
  'Licitación Pública': 'Licitación',
  'Selección Abreviada': 'S. Abreviada',
  'Concurso de Méritos': 'C. Méritos',
  'Contratación Directa': 'C. Directa',
  'Mínima Cuantía': 'Mín. Cuantía',
  'Asociación Público Privada': 'APP',
}

function shortModality(m) {
  return MODALITY_SHORT[m] ?? m ?? '—'
}
</script>

<style scoped>
.spinner-wrap {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 60px;
  flex-direction: column;
  gap: 12px;
  color: var(--muted);
}

.spinner {
  width: 32px;
  height: 32px;
  border: 3px solid var(--border);
  border-top-color: var(--accent);
  border-radius: 50%;
  animation: spin 0.7s linear infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }

.empty {
  text-align: center;
  padding: 60px 20px;
  color: var(--muted);
}

.empty__icon { color: var(--muted); margin-bottom: 12px; }
.empty h3 { font-size: 16px; margin-bottom: 6px; color: var(--text); }

.toolbar {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 16px;
  flex-wrap: wrap;
}

.count { color: var(--muted); font-size: 12px; }
.spacer { flex: 1; }

.table-wrap {
  overflow-x: auto;
  border: 1px solid var(--border);
  border-radius: var(--radius);
  background: var(--surface);
}

table {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}

thead th {
  background: var(--surface2);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.4px;
  padding: 10px 14px;
  text-align: left;
  border-bottom: 1px solid var(--border);
  cursor: pointer;
  user-select: none;
}

thead th:hover { color: var(--text); }

.sort-icon {
  display: inline-block;
  margin-left: 4px;
  opacity: 0.4;
}

.sort-icon::after { content: '↕'; }
th.asc .sort-icon::after { content: '↑'; opacity: 1; }
th.desc .sort-icon::after { content: '↓'; opacity: 1; }

tbody tr {
  border-bottom: 1px solid var(--border);
  transition: background 0.1s;
}

tbody tr:last-child { border-bottom: none; }
tbody tr:hover { background: var(--surface2); }

tbody td {
  padding: 10px 14px;
  font-size: 13px;
  max-width: 280px;
  overflow: hidden;
  text-overflow: ellipsis;
}

.value-cell {
  font-variant-numeric: tabular-nums;
  color: var(--success);
  font-weight: 600;
}

.btn-sm { padding: 4px 10px; font-size: 11px; }
</style>
