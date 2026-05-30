<template>
  <div v-if="totalPages > 1" class="pagination">
    <button class="btn btn-secondary" :disabled="page === 0" @click="emit('change', page - 1)">
      <ChevronLeft :size="14" />
    </button>

    <template v-for="p in pageButtons" :key="p">
      <span v-if="p === '…'" class="ellipsis">…</span>
      <button
        v-else
        :class="['btn', p === page ? 'btn-primary' : 'btn-secondary']"
        @click="emit('change', p)"
      >
        {{ p + 1 }}
      </button>
    </template>

    <button class="btn btn-secondary" :disabled="page === totalPages - 1" @click="emit('change', page + 1)">
      <ChevronRight :size="14" />
    </button>

    <span class="page-info">{{ t('table.page', { current: page + 1, total: totalPages }) }}</span>
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { ChevronLeft, ChevronRight } from 'lucide-vue-next'

const { t } = useI18n()

const props = defineProps({
  page: { type: Number, required: true },
  totalPages: { type: Number, required: true },
})

const emit = defineEmits(['change'])

const pageButtons = computed(() => {
  const { page, totalPages } = props
  const MAX = 7
  let start = Math.max(0, page - 3)
  let end = Math.min(totalPages - 1, start + MAX - 1)
  if (end - start < MAX - 1) start = Math.max(0, end - MAX + 1)

  const buttons = []
  if (start > 0) { buttons.push(0); if (start > 1) buttons.push('…') }
  for (let p = start; p <= end; p++) buttons.push(p)
  if (end < totalPages - 1) { if (end < totalPages - 2) buttons.push('…'); buttons.push(totalPages - 1) }
  return buttons
})
</script>

<style scoped>
.pagination {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 6px;
  margin-top: 20px;
  flex-wrap: wrap;
}

.ellipsis { color: var(--muted); padding: 0 4px; font-size: 13px; }

.page-info {
  color: var(--muted);
  font-size: 12px;
  padding: 0 8px;
}
</style>
