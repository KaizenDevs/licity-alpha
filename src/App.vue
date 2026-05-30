<template>
  <AppHeader />

  <main class="main">
    <FilterBar @search="onSearch" @reset="onReset" />
    <ResultsTable
      :searched="searched"
      :exporting="exporting"
      @detail="openDetail"
      @export="onExport"
    />
    <AppPagination
      :page="store.page"
      :total-pages="store.totalPages"
      @change="onPageChange"
    />
  </main>

  <DetailModal :row="activeRow" @close="activeRow = null" />

  <AppToast :message="toast.message" :error="toast.error" :trigger="toast.trigger" />
</template>

<script setup>
import { ref } from 'vue'
import { useSecopStore } from './stores/secop.js'
import { exportCSV } from './utils/format.js'
import AppHeader from './components/AppHeader.vue'
import FilterBar from './components/FilterBar.vue'
import ResultsTable from './components/ResultsTable.vue'
import AppPagination from './components/AppPagination.vue'
import DetailModal from './components/DetailModal.vue'
import AppToast from './components/AppToast.vue'
import { useI18n } from 'vue-i18n'

const { t } = useI18n()
const store = useSecopStore()

const searched = ref(false)
const activeRow = ref(null)
const exporting = ref(false)

const toast = ref({ message: '', error: false, trigger: 0 })

function showToast(message, error = false) {
  toast.value = { message, error, trigger: Date.now() }
}

async function onSearch() {
  searched.value = true
  await store.fetch(0)
  if (store.error) showToast(store.error, true)
}

function onReset() {
  searched.value = false
  store.resetFilters()
}

async function onPageChange(page) {
  await store.fetch(page)
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

function openDetail(idx) {
  activeRow.value = store.rows[idx] ?? null
}

const CSV_COLUMNS = [
  'nombre_del_procedimiento','nombre_entidad','departamento_entidad',
  'ciudad_entidad','modalidad_de_contratacion','estado_del_procedimiento',
  'valor_total_adjudicacion','precio_base','moneda','referencia_del_proceso',
  'fecha_de_publicacion_del','fecha_limite_de_recepcion_de_1','fecha_de_adjudicacion',
  'objeto_del_contrato_a_celebrar','urlproceso',
]

async function onExport() {
  exporting.value = true
  showToast(t('export.downloading'))
  try {
    const data = await store.fetchAllForExport()
    const csv = exportCSV(data, CSV_COLUMNS)
    const blob = new Blob(['﻿' + csv], { type: 'text/csv;charset=utf-8' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `secop_${Date.now()}.csv`
    a.click()
    URL.revokeObjectURL(url)
    showToast(t('export.done', { n: data.length }))
  } catch (e) {
    showToast(t('export.error', { msg: e.message }), true)
  } finally {
    exporting.value = false
  }
}

// Load initial results on mount
onSearch()
</script>

<style>
*, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

:root {
  --bg:       #0f1117;
  --surface:  #1a1d27;
  --surface2: #22263a;
  --border:   #2e3350;
  --accent:   #4f7fff;
  --accent2:  #7b5ea7;
  --text:     #e2e8f0;
  --muted:    #8892b0;
  --success:  #3ecf8e;
  --warn:     #f6ad55;
  --danger:   #fc8181;
  --radius:   8px;
}

body {
  background: var(--bg);
  color: var(--text);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 14px;
  min-height: 100vh;
}

.main {
  max-width: 1300px;
  margin: 0 auto;
  padding: 24px 16px;
}

/* Global button styles */
.btn {
  display: inline-flex;
  align-items: center;
  padding: 8px 16px;
  border-radius: 6px;
  border: none;
  font-size: 13px;
  font-weight: 600;
  cursor: pointer;
  transition: opacity 0.15s, transform 0.1s;
  font-family: inherit;
}

.btn:active { transform: scale(0.97); }
.btn:disabled { opacity: 0.4; cursor: not-allowed; transform: none; }

.btn-primary  { background: var(--accent);   color: #fff; }
.btn-secondary { background: var(--surface2); color: var(--text); border: 1px solid var(--border); }
.btn-success  { background: var(--success);  color: #0d1f17; }
</style>
