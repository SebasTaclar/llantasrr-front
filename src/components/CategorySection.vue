<template>
  <section class="category-section">
    <div class="container">
      <h2 class="section-title">CATEGORIAS PRINCIPALES</h2>

      <div class="services-section">
        <h3 class="services-title">Servicios</h3>

        <div class="service-cards">
          <div v-for="s in services" :key="s.title" class="service-card">
            <div class="service-media" :aria-hidden="true">
              <svg viewBox="0 0 64 64" xmlns="http://www.w3.org/2000/svg" :style="{ color: s.color }" width="72" height="72" role="img">
                <circle cx="32" cy="32" r="20" fill="none" stroke="currentColor" stroke-width="3" opacity="0.95"/>
                <circle cx="32" cy="32" r="8" fill="none" stroke="currentColor" stroke-width="3" opacity="0.95"/>
                <line x1="32" y1="12" x2="32" y2="52" stroke="currentColor" stroke-width="2" opacity="0.9" />
                <line x1="12" y1="32" x2="52" y2="32" stroke="currentColor" stroke-width="2" opacity="0.9" />
                <line x1="18" y1="18" x2="46" y2="46" stroke="currentColor" stroke-width="2" opacity="0.9" />
                <line x1="46" y1="18" x2="18" y2="46" stroke="currentColor" stroke-width="2" opacity="0.9" />
              </svg>
            </div>

            <div class="service-info">
              <div class="service-title">{{ s.title }}</div>
              <p class="service-desc">{{ s.desc }}</p>
              <button class="btn" @click="$router.push({ path: '/maintenance' })">Ver más</button>
            </div>
          </div>
        </div>
      </div>

      <div class="category-groups">
        <div class="group">
          <h3>Moto</h3>
          <div class="cards">
            <div v-for="c in motoCategories" :key="c" class="card" @click="$router.push({ path: '/maintenance' })">
              <div class="card-body">
                <div class="card-title">{{ c }}</div>
                <div class="card-sub">Selección recomendada</div>
              </div>
            </div>
          </div>
        </div>

        <div class="group">
          <h3>Carro</h3>
          <div class="cards">
            <div v-for="c in carroCategories" :key="c" class="card" @click="$router.push({ path: '/maintenance' })">
              <div class="card-body">
                <div class="card-title">{{ c }}</div>
                <div class="card-sub">Encuentra la mejor llanta</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
const services = [
  {
    title: 'Cambio de llantas',
    desc: 'Retiro y reemplazo rápido de llantas con herramientas profesionales.',
    slug: 'cambio-llantas',
    color: '#e94b35'
  },
  {
    title: 'Instalación de llantas',
    desc: 'Montaje y ajuste de llantas nuevas garantizando seguridad y ajuste.',
    slug: 'instalacion-llantas',
    color: '#ff8a50'
  },
  {
    title: 'Alineación y balanceo',
    desc: 'Alineación precisa y balanceo para una conducción estable y segura.',
    slug: 'alineacion-balanceo',
    color: '#4a90e2'
  }
]

const motoCategories = ['Ciudad', 'Doble propósito', 'Alto cilindraje', 'Trabajo']
const carroCategories = ['Automóvil', 'Camioneta / SUV', 'Deportivo', 'Todo terreno']

defineOptions({ name: 'CategorySection' })
</script>

<style scoped>
.category-section { padding: 32px 0; background: #0b0b0b; color: #fff }
.container { max-width: 1100px; margin: 0 auto; padding: 0 18px }
.section-title { font-size: 35px; font-weight: 800; margin-bottom: 16px; text-align: center }
.category-groups { display:flex; gap:20px; flex-wrap:wrap }
.group { flex:1 1 320px }
.cards { display:grid; grid-template-columns: repeat(auto-fill, minmax(180px, 1fr)); gap:12px }
.card { background: linear-gradient(180deg, rgba(255,255,255,0.02), rgba(255,255,255,0.01)); padding: 16px; border-radius:10px; cursor:pointer; border:1px solid rgba(255,255,255,0.04) }
.card:hover { transform: translateY(-6px); box-shadow: 0 12px 30px rgba(0,0,0,0.6) }
.card-title { font-weight:700; font-size:1rem }
.card-sub { font-size:0.85rem; color: #cfcfcf }

.services-section { margin-bottom: 28px }
.services-title { font-size: 20px; margin-bottom: 12px; color: #fff; text-align: center;}
.service-cards { display:grid; grid-template-columns: repeat(3, 1fr); gap:18px; margin-bottom: 18px }
.service-card { background: #fff; color:#111; border-radius:12px; padding:16px; display:flex; flex-direction:column; align-items:center; text-align:center; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.service-media { width:110px; height:110px; border-radius:10px; display:flex; align-items:center; justify-content:center; margin-bottom:12px; background: linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01)) }
.service-title { font-weight:800; font-size:1rem; margin-bottom:8px }
.service-desc { font-size:0.95rem; color:#666; margin:0 0 12px; line-height:1.3; max-width:220px }
.btn { background:#ff3b30; color:#fff; padding:8px 18px; border-radius:22px; border:none; cursor:pointer; font-weight:700 }
.btn:hover { opacity:0.95; transform: translateY(-2px) }

@media (max-width: 900px) { .service-cards { grid-template-columns: repeat(2, 1fr) } }
@media (max-width: 520px) {
  /* servicios: columna única, pero las primeras 3 más compactas */
  .service-cards { grid-template-columns: 1fr }
  .service-card { padding:14px }
  .service-card:nth-child(-n+3) {
    padding:10px;
  }
  .service-card:nth-child(-n+3) .service-media {
    width:80px;
    height:80px;
  }
  .service-card:nth-child(-n+3) .service-title { font-size:0.95rem }
  .service-card:nth-child(-n+3) .service-desc { font-size:0.85rem; max-width:180px }
  .service-card .btn { padding:8px 14px; font-size:14px }

  /* tarjetas inferiores: 2 por fila en móvil */
  .cards { grid-template-columns: repeat(2, 1fr); gap:10px }
  .card { padding:12px }
}

@media (max-width: 768px) {
  .category-groups { flex-direction:column }
  .section-title { font-size: 25px }
}
</style>
