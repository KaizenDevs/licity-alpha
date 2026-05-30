import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { API } from '../config/api.js'

export const useSecopStore = defineStore('secop', () => {
  const rows = ref([])
  const total = ref(0)
  const page = ref(0)
  const loading = ref(false)
  const error = ref(null)

  const sortCol = ref('fecha_de_publicacion_del')
  const sortDir = ref('DESC')

  const filters = ref({
    q: '',
    department: '',
    modality: '',
  })

  const totalPages = computed(() => Math.ceil(total.value / API.PAGE_SIZE))
  const hasResults = computed(() => rows.value.length > 0)

  function buildWhere() {
    const clauses = []
    const { q, department, modality } = filters.value

    if (department) clauses.push(`departamento_entidad='${department.replace(/'/g, "''")}'`)
    if (modality)   clauses.push(`modalidad_de_contratacion='${modality.replace(/'/g, "''")}'`)
    if (q) {
      const safe = q.replace(/'/g, "''")
      clauses.push(`(upper(nombre_del_procedimiento) like upper('%${safe}%') OR upper(nombre_entidad) like upper('%${safe}%'))`)
    }
    return clauses.join(' AND ')
  }

  async function fetch(targetPage = 0) {
    loading.value = true
    error.value = null
    page.value = targetPage

    const datasetId = API.DATASETS[API.ACTIVE]
    const url = `${API.BASE}/${datasetId}.json`

    const params = new URLSearchParams({
      '$limit': API.PAGE_SIZE,
      '$offset': targetPage * API.PAGE_SIZE,
      '$order': `${sortCol.value} ${sortDir.value}`,
    })

    const where = buildWhere()
    if (where) params.set('$where', where)
    if (API.APP_TOKEN) params.set('$$app_token', API.APP_TOKEN)

    const countParams = new URLSearchParams({ '$select': 'count(*) as cnt' })
    if (where) countParams.set('$where', where)
    if (API.APP_TOKEN) countParams.set('$$app_token', API.APP_TOKEN)

    try {
      const [dataRes, countRes] = await Promise.all([
        window.fetch(`${url}?${params}`),
        window.fetch(`${url}?${countParams}`),
      ])

      if (!dataRes.ok) throw new Error(`HTTP ${dataRes.status}`)

      const [data, countData] = await Promise.all([dataRes.json(), countRes.json()])
      rows.value = data
      total.value = parseInt(countData[0]?.cnt ?? 0)
    } catch (e) {
      error.value = e.message
      rows.value = []
      total.value = 0
    } finally {
      loading.value = false
    }
  }

  async function fetchAllForExport() {
    const datasetId = API.DATASETS[API.ACTIVE]
    const url = `${API.BASE}/${datasetId}.json`

    const params = new URLSearchParams({
      '$limit': 2000,
      '$order': `${sortCol.value} ${sortDir.value}`,
    })

    const where = buildWhere()
    if (where) params.set('$where', where)
    if (API.APP_TOKEN) params.set('$$app_token', API.APP_TOKEN)

    const res = await window.fetch(`${url}?${params}`)
    if (!res.ok) throw new Error(`HTTP ${res.status}`)
    return res.json()
  }

  function setSort(col) {
    if (sortCol.value === col) {
      sortDir.value = sortDir.value === 'ASC' ? 'DESC' : 'ASC'
    } else {
      sortCol.value = col
      sortDir.value = 'DESC'
    }
    fetch(0)
  }

  function resetFilters() {
    filters.value = { q: '', department: '', modality: '' }
    rows.value = []
    total.value = 0
    page.value = 0
    error.value = null
  }

  return {
    rows, total, page, loading, error,
    sortCol, sortDir, filters, totalPages, hasResults,
    fetch, fetchAllForExport, setSort, resetFilters,
  }
})
