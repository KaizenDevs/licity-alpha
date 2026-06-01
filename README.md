# Licity

Browse Colombian public procurement data (SECOP II) in real time — no backend, no API key, no login required.

**Live:** [licity.kaizendevs.com](https://licity.kaizendevs.com)

---

## What it does

- Search SECOP II procurement processes by keyword, department, and contracting modality
- Sort and paginate results
- View full process details in a modal — including awarded contracts (winner name + value)
- Export results to CSV (up to 2,000 records)
- Switch between Spanish and English UI

All data comes directly from Colombia's open data portal at [datos.gov.co](https://www.datos.gov.co) via the Socrata REST API. Both datasets update daily (automated sync from SECOP II).

---

## Stack

| | |
|---|---|
| Framework | Vue 3 + Vite |
| State | Pinia |
| i18n | vue-i18n (ES / EN) |
| Icons | lucide-vue-next |
| Deploy | GitHub Pages via GitHub Actions |

---

## Local development

```bash
npm install
npm run dev
```

Open `http://localhost:5173`.

---

## Project structure

```
src/
├── config/
│   └── api.js          # API base URL, dataset IDs, field definitions
├── i18n/
│   └── locales/
│       ├── en.json     # English strings
│       └── es.json     # Spanish strings
├── stores/
│   └── secop.js        # Pinia store — fetch, sort, paginate, export
├── utils/
│   └── format.js       # Currency, date, CSV helpers
└── components/
    ├── AppHeader.vue
    ├── FilterBar.vue
    ├── ResultsTable.vue
    ├── StatusChip.vue
    ├── DetailModal.vue
    ├── AppPagination.vue
    └── AppToast.vue
```

---

## Data sources

| Key | Resource ID | Description | Update freq |
|-----|-------------|-------------|-------------|
| `processes` | `p6dx-8zbt` | Active bidding processes (default) | Daily |
| `contracts` | `jbjy-vk9h` | Awarded contracts | Daily |
| `legacy` | `f789-7hwg` | SECOP I legacy processes | — |

### Join key

Processes and contracts link via `id_del_portafolio` (processes) = `proceso_de_compra` (contracts). The detail modal uses this to fetch winner info automatically.

### Changing the active dataset

Edit `src/config/api.js`:

```js
// Switch to awarded contracts instead of active processes
ACTIVE: 'contracts',
```

---

## Detail modal — awarded contracts

When a user opens a process, the modal fires a second API call to `jbjy-vk9h` filtered by `proceso_de_compra = id_del_portafolio`. Results show:

- `proveedor_adjudicado` — winner name
- `valor_del_contrato` — contract value (formatted as COP currency)
- `referencia_del_contrato` — contract reference number

Shows a loading state while fetching, and a "no contracts found" message when the process hasn't been awarded yet.

---

## Adding or removing table columns

All displayed fields are defined in `src/config/api.js` — no component changes needed.

```js
// Add a column to the results table
export const TABLE_FIELDS = [
  { key: 'nombre_del_procedimiento', i18n: 'fields.name',   sortable: true },
  { key: 'your_field_key',           i18n: 'fields.myField', sortable: false },
  // ...
]
```

Then add the translation key to both `src/i18n/locales/en.json` and `es.json`:

```json
"fields": {
  "myField": "My Field Label"
}
```

---

## Higher API rate limits

The Socrata free tier throttles heavy usage. To increase limits:

1. Create a free account at [datos.gov.co](https://www.datos.gov.co)
2. Generate an App Token
3. Add it to `src/config/api.js`:

```js
APP_TOKEN: 'your_token_here',
```

---

## Deployment

Pushing to `main` triggers an automatic deploy via GitHub Actions to GitHub Pages at [licity.kaizendevs.com](https://licity.kaizendevs.com).

To deploy manually:

```bash
npm run build   # outputs to dist/
```

---

## API reference

- **Portal:** https://www.colombiacompra.gov.co  
- **Open Data:** https://www.datos.gov.co  
- **Socrata SoQL docs:** https://dev.socrata.com/docs/queries/
