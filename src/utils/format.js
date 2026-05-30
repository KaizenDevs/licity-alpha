export function formatCurrency(value) {
  if (!value) return '—'
  const n = parseFloat(value)
  if (isNaN(n)) return '—'
  if (n >= 1e9) return '$ ' + (n / 1e9).toFixed(1) + ' B'
  if (n >= 1e6) return '$ ' + (n / 1e6).toFixed(1) + ' M'
  return '$ ' + n.toLocaleString('es-CO')
}

export function formatCurrencyFull(value) {
  if (!value) return '—'
  const n = parseFloat(value)
  if (isNaN(n)) return '—'
  return '$ ' + n.toLocaleString('es-CO', { minimumFractionDigits: 0 })
}

export function formatDate(value) {
  if (!value) return '—'
  try {
    return new Date(value).toLocaleDateString('es-CO', {
      day: '2-digit', month: 'short', year: 'numeric',
    })
  } catch {
    return value
  }
}

export function statusColor(status) {
  if (!status) return 'gray'
  const s = status.toLowerCase()
  if (s.includes('adjudicado')) return 'green'
  if (s.includes('activo') || s.includes('publicado')) return 'blue'
  if (s.includes('cerrado')) return 'yellow'
  if (s.includes('cancelado') || s.includes('desierto')) return 'red'
  return 'gray'
}

export function truncate(str, max) {
  if (!str) return '—'
  return str.length > max ? str.slice(0, max) + '…' : str
}

export function exportCSV(rows, columns) {
  const header = columns.join(',')
  const lines = rows.map(r =>
    columns.map(c => `"${String(r[c] ?? '').replace(/"/g, '""')}"`).join(',')
  )
  return [header, ...lines].join('\n')
}
