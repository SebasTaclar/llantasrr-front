<template>
  <section class="llantas-hero">
    <div class="llantas-hero-bg" aria-hidden>
      <div
        v-for="(slide, idx) in bgSlides"
        :key="slide.id"
        class="bg-slide"
        :class="{ active: idx === bgIndex }"
        :style="{ backgroundImage: `url('${slide.url}')` }"
      ></div>
      <div class="bg-overlay"></div>
    </div>

    <div class="hero-inner">

      <div class="hero-content">
        <div class="hero-left" :class="{ 'is-visible': textVisible }">
          <div class="hero-topbar" role="status" aria-live="polite">
            <svg class="truck-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true" focusable="false"><rect x="1" y="3" width="15" height="13" rx="2"></rect><path d="M16 8h5l2 3v5"></path><circle cx="5.5" cy="18.5" r="1.5"></circle><circle cx="18.5" cy="18.5" r="1.5"></circle></svg>
            <div class="badge-text"><strong>Envíos gratis por compra de más de dos artículos</strong><span class="badge-sub"> · Entrega 24-48h</span></div>
          </div>

          <h1 class="hero-title">Encuentra la llanta perfecta para tu vehículo</h1>
          <p class="hero-sub">Calidad, seguridad y precio justo en Colombia</p>

        </div>

        <div class="hero-right" aria-hidden>
          <!-- El contenido principal queda encima del fondo del carrusel -->
        </div>
      </div>
    </div>

    <!-- Búsqueda flotante entre hero y categorías (visible en desktop) -->
    <div class="hero-floating-search" role="search" aria-label="Buscar llantas rápida">
      <div class="floating-top-btns">
        <button type="button" class="toggle-btn" :class="{ active: form.vehicle === 'moto' }" @click="selectVehicle('moto')">Buscar Llantas para Moto</button>
        <button type="button" class="toggle-btn" :class="{ active: form.vehicle === 'carro' }" @click="selectVehicle('carro')">Buscar Llantas para Carro</button>
      </div>

      <form class="floating-search-form" @submit.prevent="onSearch">
        <select v-model="form.vehicle" aria-label="Tipo de vehículo">
          <option value="moto">Moto</option>
          <option value="carro">Carro</option>
        </select>

        <input v-model="form.brand" placeholder="Marca (ej: Pirelli)" aria-label="Marca" />
        <input v-model="form.model" placeholder="Modelo" aria-label="Modelo" />
        <input v-model="form.size" placeholder="Medida (ej: 180/70 R14)" aria-label="Medida" />

        <button class="search-btn floating" type="submit">Buscar ahora</button>
      </form>
    </div>

  </section>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const form = ref({ vehicle: 'moto', brand: '', model: '', size: '' })
const textVisible = ref(false)

const onSearch = () => {
  // Redirigir todas las búsquedas del hero a la página de mantenimiento
  router.push({ path: '/maintenance' })
}

const selectVehicle = (v: string) => {
  form.value.vehicle = v
}

// Carrusel de fondo para toda la sección
const bgSlides = ref([
  { id: 'b1', url: 'https://png.pngtree.com/thumb_back/fh260/background/20230615/pngtree-auto-repair-shops-sale-concept-cast-steel-rims-with-3d-rendered-image_3608088.jpg' },
  { id: 'b2', url: 'https://st4.depositphotos.com/4312111/26583/i/450/depositphotos_265836848-stock-photo-banner-for-car-wheel-business.jpg' },
  { id: 'b3', url: 'https://img.freepik.com/fotos-premium/foto-primer-plano-rueda-coche-estudio-fondo-negro_37416-771.jpg' },
  { id: 'b4', url: 'https://autorinesyllantas.co/img/banner-llantas-pirelli.jpg' },
  {id: 'b5', url: 'https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779466200/automovil_x1hom2.png' },
])

const bgIndex = ref(0)
const bgAutoPlay = ref<ReturnType<typeof setInterval> | null>(null)

const startBgAutoplay = () => {
  stopBgAutoplay()
  bgAutoPlay.value = setInterval(() => {
    bgIndex.value = (bgIndex.value + 1) % bgSlides.value.length
  }, 4500)
}

const stopBgAutoplay = () => {
  if (bgAutoPlay.value) {
    clearInterval(bgAutoPlay.value)
    bgAutoPlay.value = null
  }
}

// Preload y fallback simple
const preloadBackgrounds = () => {
  bgSlides.value.forEach((s, i) => {
    const img = new Image()
    img.src = s.url
    img.onload = () => { /* OK */ }
    img.onerror = () => {
      // si falla una URL, sustituir por la última conocida buena (usar b3 como fallback)
      bgSlides.value[i].url = bgSlides.value[2]?.url || bgSlides.value[0].url
    }
  })
}

onMounted(() => {
  preloadBackgrounds()
  startBgAutoplay()
  // activar animación de entrada del texto con pequeño retardo
  setTimeout(() => {
    textVisible.value = true
  }, 320)
})

onUnmounted(() => {
  stopBgAutoplay()
})

</script>




<style scoped>
.llantas-hero { position: relative; overflow: visible; min-height: 520px; color: #fff; padding-top: 90px; padding-bottom: 48px }
.llantas-hero-bg { position: absolute; inset: 0; z-index: 0; height: 100%; width: 100%; }
.bg-slide { position: absolute; inset: 0; background-size: cover; background-position: center; background-repeat: no-repeat; opacity: 0; transform: scale(1.02); transition: opacity 1s ease, transform 10s ease; filter: brightness(0.50) saturate(0.85) contrast(0.95); will-change: opacity, transform; }
.bg-slide.active { opacity: 1; transform: scale(1); z-index: 0; }
.bg-overlay { position: absolute; inset: 0; background: linear-gradient(180deg, rgba(0,0,0,0.66) 0%, rgba(0,0,0,0.75) 50%, rgba(0,0,0,0.88) 100%); z-index: 1; pointer-events: none; }
.hero-inner { position: relative; max-width: 1200px; margin: 0 auto; padding: 36px; z-index: 2; display:flex; align-items:center; min-height:560px; }

/* Nuevo badge: pill blanco con icono dentro del contenido (menos intrusivo) */
.hero-topbar { display:inline-flex; gap:12px; align-items:center; background: rgba(255,255,255,0.96); color: #111827; padding:8px 14px; border-radius:999px; font-weight:700; box-shadow: 0 8px 26px rgba(0,0,0,0.28); border: 1px solid rgba(0,0,0,0.06); margin-bottom:14px; }
.hero-topbar .truck-icon { color: var(--primary-red); width:18px; height:18px; flex:0 0 18px }
.badge-text { display:flex; gap:8px; align-items:center }
.badge-sub { color:#6b7280; font-weight:600; font-size:0.95rem }
.hero-content { display:flex; gap:20px; align-items:center; justify-content:space-between; flex-wrap:wrap; }
.hero-left { flex:1 1 640px; min-width:260px; max-width:720px; background: rgba(0,0,0,0.20); padding: 28px; border-radius: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.5); backdrop-filter: blur(6px); }
.hero-right { flex:0 0 360px; display:flex; align-items:center; justify-content:center }
.hero-left .hero-topbar,
.hero-left .hero-title,
.hero-left .hero-sub {
  opacity: 0;
  transform: translateY(-80px); /* mayor desplazamiento: entrada desde más arriba */
  transition: opacity 1000ms cubic-bezier(.2,.9,.2,1), transform 1000ms cubic-bezier(.2,.9,.2,1);
  will-change: opacity, transform;
}

.hero-left.is-visible .hero-topbar { opacity: 1; transform: translateY(0); transition-delay: 0.10s }
.hero-left.is-visible .hero-title  { opacity: 1; transform: translateY(0); transition-delay: 0.28s }
.hero-left.is-visible .hero-sub    { opacity: 1; transform: translateY(0); transition-delay: 0.46s }
.hero-title { font-size: clamp(2rem,5vw,3.4rem); margin:0 0 12px; font-weight:900; color:#fff; text-shadow: 0 10px 30px rgba(0,0,0,0.75); line-height:1.04; }
.hero-sub { margin:0 0 18px; color: rgba(255,255,255,0.95); font-size:1.05rem; }
.hero-cta-group { display:flex; gap:12px; margin-bottom:16px }
.cta { padding:14px 22px; border-radius:12px; font-weight:800; cursor:pointer; border:none; transition: transform .15s ease, box-shadow .15s ease; }
.btn-moto { background: linear-gradient(90deg, var(--primary-red), #b91c1c); color:#fff; box-shadow: 0 10px 30px rgba(220,38,38,0.25); }
.btn-moto:hover { transform: translateY(-3px); box-shadow: 0 18px 40px rgba(220,38,38,0.28); }
.btn-carro { background: rgba(255,255,255,0.06); color:#fff; border:1px solid rgba(255,255,255,0.12); }
.btn-carro { background:#111; color:#fff; border:2px solid #dc2626 }
.hero-search { margin-top:8px }
.search-row { display:flex; gap:8px; flex-wrap:wrap }
.search-row select, .search-row input { padding:10px 12px; border-radius:8px; border:1px solid rgba(255,255,255,0.12); background: rgba(255,255,255,0.06); color: #fff; min-width:120px }
.search-btn { background:#dc2626; color:#fff; padding:10px 16px; border-radius:8px; border:none; font-weight:700; box-shadow: 0 8px 24px rgba(220,38,38,0.18) }
.hero-image img { width:100%; height:auto; border-radius:12px; object-fit:cover }

/* Floating search (desktop by default, adapted for mobile below) */
.hero-floating-search { display:none }

@media (min-width: 769px) {
  .hero-floating-search {
    display: block;
    position:relative;
    left: 50%;
    transform: translateX(-50%);
    bottom: -40px;
    z-index: 1200;
    width: min(1100px, 92%);
    background: rgba(7,7,7,0.72);
    border-radius: 14px;
    padding: 18px 20px;
    box-shadow: 0 22px 60px rgba(2,6,23,0.7);
    border: 1px solid rgba(255,255,255,0.06);
  }

  .floating-top-btns { display:flex; gap:14px; justify-content:flex-start; margin-bottom:12px }
  .toggle-btn { flex:1 1 auto; padding:12px 18px; border-radius:999px; font-weight:800; cursor:pointer; background:transparent; color: #fff; border:2px solid rgba(255,255,255,0.08); }
  .toggle-btn.active { background: linear-gradient(90deg,var(--primary-red),#b91c1c); border-color: transparent; box-shadow: 0 10px 30px rgba(220,38,38,0.2); }

  .floating-search-form { display:flex; gap:10px; align-items:center }
  .floating-search-form select,
  .floating-search-form input { flex:1 1 180px; padding:12px 14px; border-radius:10px; border:1px solid rgba(255,255,255,0.08); background: rgba(255,255,255,0.03); color:#fff; }
  .floating-search-form .search-btn.floating { background: linear-gradient(90deg,var(--primary-red),#b91c1c); color:#fff; padding:12px 18px; border-radius:10px; border:none; font-weight:800; box-shadow: 0 10px 30px rgba(220,38,38,0.2); }
}

@media (max-width: 768px) {
  /* Mobile adjustments: show floating search as stacked full-width, reduce hero height */
  /* Ajustado para pantallas pequeñas: banner más compacto */
  .llantas-hero { min-height: 300px; padding-top: calc(var(--navbar-height) + 8px); padding-bottom: 20px }
  .hero-inner { padding: 14px; height: 260px; }
  .hero-left { flex:none; padding: 16px; border-radius: 10px; background: rgba(0,0,0,0.28); text-align: center; display: flex; flex-direction: column; align-items: center }

  /* Topbar full-width and centered on mobile */
  .hero-left .hero-topbar {
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 10px 14px;
    border-radius: 10px;
    margin-bottom: 12px;
    background: rgba(255, 255, 255, 0.185);
    color: #ffffff;
  }

  .hero-left .badge-text { display: block; text-align: center; gap: 6px }
  .hero-left .badge-text strong { display:block; font-size:1rem }
  .hero-left .badge-text .badge-sub { display:block; font-size:0.95rem; color:#df202a; font-weight:800 }

  /* Texto más grande y centrado en móvil */
  .hero-title { font-size: 2.4rem; margin-bottom: 8px }
  .hero-sub { font-size: 1.05rem; margin-bottom: 12px }

  .hero-floating-search { display:block; position:relative; left:auto; transform:none; bottom:0; margin: 12px auto 0; width: calc(100% - 36px); z-index: 1300; background: rgba(7,7,7,0.86); border-radius: 12px; padding: 12px; box-shadow: 0 12px 40px rgba(0,0,0,0.6); border: 1px solid rgba(255,255,255,0.04) }
  .floating-top-btns { display:flex; gap:6px; flex-wrap:wrap; margin-bottom:10px; justify-content:center }
  .toggle-btn { flex:0 0 auto; padding:6px 10px; font-size:13px; border-radius:999px; min-width:120px; max-width:46%; text-align:center }
  .floating-search-form { display:flex; flex-direction:column; gap:10px }
  .floating-search-form select, .floating-search-form input { width:100%; padding:12px 12px; border-radius:8px }
  .floating-search-form .search-btn.floating { width:100%; padding:12px; border-radius:8px }

  .hero-content { flex-direction:column-reverse; align-items:stretch }
  .hero-right { width:100% ; flex:0 0 auto; margin-bottom: 16px }
}

@media (max-width: 768px) {
  /* Remove right column and center everything on small screens */
  .hero-content { flex-direction: column; align-items: center; justify-content: center }
  .hero-right { display: none !important }
  .hero-left { width: 100%; max-width: 720px; margin: 0 auto; text-align: center }
  .hero-inner { display: flex; flex-direction: column; align-items: center; justify-content:flex-start; min-height: 450px; }
}
</style>
