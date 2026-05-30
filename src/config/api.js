// SECOP II – Socrata open data API
// Swap DATASET_ID to change the source dataset
export const API = {
  BASE: 'https://www.datos.gov.co/resource',

  DATASETS: {
    // Active bidding processes (used by default)
    processes: 'p6dx-8zbt',
    // Awarded contracts
    contracts: 'jbjy-vk9h',
    // Legacy SECOP I processes
    legacy: 'f789-7hwg',
  },

  // Active dataset
  ACTIVE: 'processes',

  PAGE_SIZE: 50,

  // Optional: add a free app token from datos.gov.co for higher rate limits
  APP_TOKEN: '',
}

// Fields displayed in the results table (order matters)
export const TABLE_FIELDS = [
  { key: 'nombre_del_procedimiento', i18n: 'fields.name',       sortable: true  },
  { key: 'nombre_entidad',           i18n: 'fields.entity',     sortable: true  },
  { key: 'departamento_entidad',     i18n: 'fields.department', sortable: true  },
  { key: 'modalidad_de_contratacion',i18n: 'fields.modality',   sortable: true  },
  { key: 'valor_total_adjudicacion', i18n: 'fields.value',      sortable: true  },
  { key: 'estado_del_procedimiento', i18n: 'fields.status',     sortable: true  },
  { key: 'fecha_de_publicacion_del', i18n: 'fields.published',  sortable: true  },
]

// Fields shown in the detail modal
export const DETAIL_FIELDS = [
  { key: 'nombre_entidad',                i18n: 'fields.entity',        full: false },
  { key: 'nit_entidad',                   i18n: 'fields.nit',           full: false },
  { key: 'departamento_entidad',          i18n: 'fields.department',    full: false },
  { key: 'ciudad_entidad',                i18n: 'fields.city',          full: false },
  { key: 'modalidad_de_contratacion',     i18n: 'fields.modality',      full: false },
  { key: 'estado_del_procedimiento',      i18n: 'fields.status',        full: false },
  { key: 'valor_total_adjudicacion',      i18n: 'fields.value',         full: false, format: 'currency' },
  { key: 'precio_base',                   i18n: 'fields.budget',        full: false, format: 'currency' },
  { key: 'moneda',                        i18n: 'fields.currency',      full: false },
  { key: 'referencia_del_proceso',        i18n: 'fields.reference',     full: false },
  { key: 'fecha_de_publicacion_del',      i18n: 'fields.published',     full: false, format: 'date' },
  { key: 'fecha_limite_de_recepcion_de_1',i18n: 'fields.deadline',      full: false, format: 'date' },
  { key: 'fecha_de_adjudicacion',         i18n: 'fields.awarded',       full: false, format: 'date' },
  { key: 'objeto_del_contrato_a_celebrar',i18n: 'fields.object',        full: true  },
  { key: 'urlproceso',                    i18n: 'fields.url',           full: true,  format: 'url'  },
]

// Departments for filter dropdown
export const DEPARTMENTS = [
  'Amazonas','Antioquia','Arauca','Atlántico','Bogotá D.C.','Bolívar','Boyacá',
  'Caldas','Caquetá','Casanare','Cauca','Cesar','Chocó','Córdoba','Cundinamarca',
  'Guainía','Guaviare','Huila','La Guajira','Magdalena','Meta','Nariño',
  'Norte de Santander','Putumayo','Quindío','Risaralda','San Andrés','Santander',
  'Sucre','Tolima','Valle del Cauca','Vaupés','Vichada',
]

// Contracting modalities for filter dropdown
export const MODALITIES = [
  'Licitación Pública',
  'Selección Abreviada',
  'Concurso de Méritos',
  'Contratación Directa',
  'Mínima Cuantía',
  'Asociación Público Privada',
]
