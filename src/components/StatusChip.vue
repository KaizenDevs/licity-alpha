<template>
  <span v-if="status" :class="`chip chip-${color}`">{{ status }}</span>
  <span v-else class="chip chip-gray">—</span>
</template>

<script setup>
import { computed } from 'vue'
import { statusColor } from '../utils/format.js'

const props = defineProps({ status: String })
const color = computed(() => statusColor(props.status))
</script>

<style scoped>
.chip {
  display: inline-block;
  padding: 2px 8px;
  border-radius: 99px;
  font-size: 11px;
  font-weight: 600;
}

.chip-green  { background: rgba(62,207,142,.15); color: var(--success); }
.chip-yellow { background: rgba(246,173,85,.15);  color: var(--warn);    }
.chip-red    { background: rgba(252,129,129,.15); color: var(--danger);  }
.chip-blue   { background: rgba(79,127,255,.15);  color: var(--accent);  }
.chip-gray   { background: rgba(136,146,176,.12); color: var(--muted);   }
</style>
