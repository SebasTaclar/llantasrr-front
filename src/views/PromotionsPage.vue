<template>
  <main class="promotions-page">
    <section class="hero-mini">
      <div class="container">
        <h1>Promociones</h1>
        <p>Ofertas especiales para moto y carro. Últimas unidades disponibles.</p>
      </div>
    </section>

    <section class="section">
      <PromotionsRR />
    </section>

    <section class="section">
      <ProductStore />
    </section>
  </main>
</template>

<script setup lang="ts">
import PromotionsRR from '@/components/PromotionsRR.vue'
import ProductStore from '@/components/ProductStore.vue'

defineOptions({ name: 'PromotionsPage' })
</script>

<style scoped>
.hero-mini { padding-top: 96px; padding-bottom: 24px; background: linear-gradient(180deg,#000,#0b0b0b); color:#fff }
.hero-mini .container { max-width:1100px; margin:0 auto; padding: 0 18px }
.hero-mini h1 { font-size:2rem; margin:0 0 6px }
.hero-mini p { margin:0; color:#ddd }
</style>
