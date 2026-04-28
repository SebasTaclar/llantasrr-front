<template>
  <main class="page-main">
    <section class="hero-mini">
      <div class="container">
        <h1>Llantas para Moto</h1>
        <p>Encuentra llantas para ciudad, doble propósito, alto cilindraje y trabajo.</p>
      </div>
    </section>

    <section class="section">
      <CategorySection />
    </section>

    <section class="section">
      <ProductShowcase />
    </section>

    <section class="section">
      <ProductStore />
    </section>
  </main>
</template>

<script setup lang="ts">
import CategorySection from '@/components/CategorySection.vue'
import ProductShowcase from '@/components/ProductShowcase.vue'
import ProductStore from '@/components/ProductStore.vue'

defineOptions({ name: 'MotoPage' })
</script>

<style scoped>
.hero-mini { padding-top: 96px; padding-bottom: 24px; background: linear-gradient(180deg,#000,#0b0b0b); color:#fff }
.hero-mini .container { max-width:1100px; margin:0 auto; padding: 0 18px }
.hero-mini h1 { font-size:2rem; margin:0 0 6px }
.hero-mini p { margin:0; color:#ddd }
</style>
