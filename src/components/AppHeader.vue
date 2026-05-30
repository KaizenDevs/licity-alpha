<template>
  <header class="header">
    <div class="header__brand">
      <span class="header__logo">Licity</span>
      <span class="header__subtitle">{{ t('app.subtitle') }}</span>
    </div>
    <div class="header__actions">
      <span class="badge">{{ t('app.live') }}</span>
      <button
        class="lang-toggle"
        :title="locale === 'es' ? 'Switch to English' : 'Cambiar a Español'"
        @click="toggleLocale"
      >
        {{ locale === 'es' ? 'EN' : 'ES' }}
      </button>
    </div>
  </header>
</template>

<script setup>
import { useI18n } from 'vue-i18n'

const { t, locale } = useI18n()

function toggleLocale() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
}
</script>

<style scoped>
.header {
  background: var(--surface);
  border-bottom: 1px solid var(--border);
  padding: 14px 24px;
  display: flex;
  align-items: center;
  gap: 12px;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header__brand { display: flex; flex-direction: column; gap: 2px; }

.header__logo {
  font-size: 18px;
  font-weight: 700;
  color: var(--accent);
  letter-spacing: -0.5px;
}

.header__subtitle { color: var(--muted); font-size: 12px; }

.header__actions {
  margin-left: auto;
  display: flex;
  align-items: center;
  gap: 8px;
}

.badge {
  background: var(--accent2);
  color: #fff;
  font-size: 11px;
  padding: 2px 8px;
  border-radius: 99px;
  font-weight: 600;
}

.lang-toggle {
  background: var(--surface2);
  border: 1px solid var(--border);
  color: var(--muted);
  font-size: 11px;
  font-weight: 700;
  padding: 3px 10px;
  border-radius: 6px;
  cursor: pointer;
  transition: color 0.15s, border-color 0.15s;
}

.lang-toggle:hover {
  color: var(--text);
  border-color: var(--accent);
}
</style>
