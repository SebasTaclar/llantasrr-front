<template>
  <section class="brands-section" aria-label="Marcas que ofrecemos">
    <div class="brands-inner">
      <div class="brands-heading">
        <h2 class="brands-title1">MARCAS CON LAS QUE</h2>
        <h2 class="brands-title">TRABAJAMOS</h2>
      </div>

      <div class="brands-viewport" ref="viewportRef" @mouseenter="paused = true" @mouseleave="paused = false" role="list" aria-hidden="false">
        <!-- usar variable CSS para la duración; JS animará el track para evitar problemas de scoping -->
        <div class="brands-track" ref="trackRef" :style="{ '--brands-duration': animationDuration + 's' }">
          <div class="brand-item" v-for="(b, i) in loopBrands" :key="i" role="listitem">
            <img v-if="b.logo" :src="b.logo" :alt="b.name" />
            <div v-else class="brand-fallback">{{ b.name }}</div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, onUnmounted, nextTick } from 'vue'

// Lista de marcas con URLs de logo (usa CDN SimpleIcons cuando esté disponible,
// o placeholders para las que no tengan un icono directo)
const brands = ref([
  { name: 'Michelin', logo: 'https://api.larueda.com.co/imagenes/marcas/Nexen.jpg' },
  { name: 'Ovation', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSG8qA7S-oUmhr2Rj6tT48-x9o1YHkxTeTvmw&s' },
  { name: 'Zeta', logo: 'https://eurollantas.com.co/wp-content/uploads/2025/09/Recurso-63-eurollantas-150x150.jpg' },
  { name: 'Pirelli', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSnPGCZnMi4GN7aS5vi6Ucsxneggdw7zLtiVw&s' },
  { name: 'Bridgestone', logo: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSSoxCocZBb9eAO-ocVt5np9jXqxiwsruhEOg&s' },
  { name: 'Continental', logo: 'https://1000marcas.net/wp-content/uploads/2022/12/Continental-Logo.png' },
  { name: 'Goodyear', logo: 'https://tullanta.com//files/marcas/GOODYEAR.png' },
  { name: 'Hankook', logo: 'https://1000marcas.net/wp-content/uploads/2020/10/Hankook-logo.png' },
  { name: 'Dunlop', logo: 'https://1000marcas.net/wp-content/uploads/2020/03/Dunlop-Logo-1.png' },
  { name: 'Kenda', logo: 'https://marvel-b1-cdn.bc0a.com/f00000000270535/s19532.pcdn.co/wp-content/uploads/2023/06/Kenda-1400-1000x500.jpg' }
])

// Duplicamos la lista para conseguir un bucle continuo sin saltos
const loopBrands = computed(() => [...brands.value, ...brands.value])

// Velocidad del scroll en segundos (mayor -> más lento). Ajustable según número de marcas.
const baseDuration = 20
const animationDuration = Math.max(baseDuration, brands.value.length * 3)

// Animación por JS (requestAnimationFrame) para evitar problemas de scoping con keyframes scoped
const trackRef = ref<HTMLElement | null>(null)
const viewportRef = ref<HTMLElement | null>(null)
const paused = ref(false)

let rafId: number | null = null
let lastTime = 0
let offset = 0
let halfWidth = 0
let speed = 0

const updateSizes = () => {
  if (!trackRef.value) return
  const fullWidth = trackRef.value.scrollWidth
  halfWidth = fullWidth / 2
  speed = halfWidth / animationDuration
  offset = offset % (halfWidth || 1)
}

const step = (time: number) => {
  if (!trackRef.value) return
  if (!lastTime) lastTime = time
  const dt = (time - lastTime) / 1000
  lastTime = time
  if (!paused.value && halfWidth > 0) {
    offset += speed * dt
    if (offset >= halfWidth) offset -= halfWidth
    trackRef.value.style.transform = `translateX(-${offset}px)`
  }
  rafId = window.requestAnimationFrame(step)
}

onMounted(async () => {
  await nextTick()
  updateSizes()
  // esperar a que las imágenes carguen y recalcular
  const imgs = trackRef.value?.querySelectorAll('img') || []
  if (imgs.length) {
    let loaded = 0
    imgs.forEach(imgEl => {
      const img = imgEl as HTMLImageElement
      if (img.complete) {
        loaded++
      } else {
        img.addEventListener('load', () => {
          loaded++
          if (loaded === imgs.length) updateSizes()
        }, { once: true })
        img.addEventListener('error', () => {
          loaded++
          if (loaded === imgs.length) updateSizes()
        }, { once: true })
      }
    })
    if (loaded >= imgs.length) updateSizes()
  }
  rafId = window.requestAnimationFrame(step)
  window.addEventListener('resize', updateSizes)
})

onUnmounted(() => {
  if (rafId !== null) cancelAnimationFrame(rafId)
  window.removeEventListener('resize', updateSizes)
})

defineOptions({ name: 'BrandsCarousel' })
</script>

<style scoped>
.brands-section {
  background: #ffffff;
  padding: 48px 0 36px;
  color: #111;
}
.brands-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: flex;
  flex-direction: column;
  gap: 18px;
  align-items: center;
}
.brands-heading {
  display: flex;
  gap: 12px;
  align-items: center;
  justify-content: center;
  white-space: nowrap;
}

.brands-title,
.brands-title1 {
  font-weight: 800;
  letter-spacing: 1px;
  margin: 0;
  font-size: 32px;
  text-align: center;
}

.brands-title1 { color: #dc2626; }
.brands-title  { color: #030303; }

@media (max-width: 768px) {
  .brands-heading { flex-direction: column; gap: 6px; white-space: normal; text-align: center; }
  .brands-title, .brands-title1 { font-size: 25px; }
}
.brands-viewport {
  width: 100%;
  overflow: hidden;
}
.brands-track {
  display: flex;
  gap: 40px;
  align-items: center;
  width: max-content; /* asegurar ancho real del contenido para que translateX funcione */
  will-change: transform;
  transform: translateX(0);
}
.brand-item {
  flex: 0 0 auto;
  width: 180px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
}
.brand-item img {
  max-height: 64px;
  max-width: 100%;
  object-fit: contain;
}
.brand-fallback {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-weight: 700;
  color: #111;
  background: #fff;
  padding: 6px 12px;
  border-radius: 8px;
  border: 1px solid rgba(0,0,0,0.06);
  box-shadow: 0 6px 18px rgba(0,0,0,0.06);
  width: 100%;
  text-align: center;
}

/* La animación la gestiona JS (requestAnimationFrame) para evitar problemas de scoping */

@media (max-width: 768px) {
  .brand-item { width: 140px; height: 56px }
  .brands-title { font-size: 1.25rem }
}
</style>
