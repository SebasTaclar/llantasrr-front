<template>
  <main class="search-results">
    <section class="hero-mini">
      <div class="container">
        <h1>Resultados de búsqueda</h1>
        <p v-if="summary">Buscando: {{ summary }}</p>
      </div>
    </section>

    <section class="section">
      <ProductStore />
    </section>
  </main>
</template>

<script setup lang="ts">
import { computed } from 'vue'
import { useRoute } from 'vue-router'
import ProductStore from '@/components/ProductStore.vue'

const route = useRoute()

const summary = computed(() => {
  const q = route.query
  // Si viene un parámetro `q` simple (búsqueda libre), mostrarlo primero
  if (q.q) return String(q.q)
  const parts: string[] = []
  if (q.vehicle) parts.push(String(q.vehicle))
  if (q.brand) parts.push(String(q.brand))
  if (q.model) parts.push(String(q.model))
  if (q.size) parts.push(String(q.size))
  return parts.length ? parts.join(' · ') : ''
})

defineOptions({ name: 'SearchResults' })
</script>

<style scoped>
.hero-mini { padding-top: 96px; padding-bottom: 24px; background: linear-gradient(180deg,#000,#0b0b0b); color:#fff }
.hero-mini .container { max-width:1100px; margin:0 auto; padding: 0 18px }
.hero-mini h1 { font-size:2rem; margin:0 0 6px }
.hero-mini p { margin:0; color:#ddd }
</style>
