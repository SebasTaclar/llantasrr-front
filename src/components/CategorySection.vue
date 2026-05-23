<template>
  <section class="category-section">
    <div class="container">
      <h2 class="section-title">CATEGORÍAS PRINCIPALES</h2>

      <div class="services-section">
        <h3 class="services-title">Servicios</h3>

        <div class="service-cards">
          <article v-for="s in services" :key="s.title" class="service-card">
            <div class="service-media" aria-hidden="true">
              <img :src="s.image" :alt="s.title" loading="lazy" class="service-media-img" />
            </div>

            <div class="service-info">
              <div class="service-title">{{ s.title }}</div>
              <p class="service-desc">{{ s.desc }}</p>
              <button class="btn" type="button" @click="openServiceModal(s)">Ver más</button>
            </div>
          </article>
        </div>
      </div>
    </div>

    <teleport to="body">
      <transition name="modal-fade">
        <div v-if="activeModal" class="modal-overlay" @click.self="closeModal">
          <div class="service-modal" role="dialog" aria-modal="true" :aria-label="activeModal.title">
            <button class="modal-close" type="button" @click="closeModal" aria-label="Cerrar modal">✕</button>

            <div class="modal-content">
              <h3>{{ activeModal.title }}</h3>
              <p class="modal-desc">{{ activeModal.desc }}</p>

              <template v-if="activeModal.slug === 'compra-llantas'">
                <p class="modal-note">Elige una categoría y encuentra todo lo que necesitas.</p>
                <div class="modal-filters">
                  <RouterLink to="/automovil" class="modal-filter-btn">Automóvil</RouterLink>
                  <RouterLink to="/moto" class="modal-filter-btn">Moto</RouterLink>
                  <RouterLink to="/carro" class="modal-filter-btn">Camioneta</RouterLink>
                  <RouterLink to="/maintenance" class="modal-filter-btn">Camión / Bus</RouterLink>
                  <RouterLink to="/maintenance" class="modal-filter-btn">Agrícola</RouterLink>
                  <RouterLink to="/maintenance" class="modal-filter-btn">Montacarga</RouterLink>
                </div>
              </template>

              <template v-else>
                <div class="contact-box">
                  <strong>Contáctanos</strong>
                  <p>Escríbenos para asesoría rápida y agendar tu servicio.</p>
                  <div class="contact-actions">
                    <a href="https://wa.me/573138936332" target="_blank" rel="noreferrer" class="contact-btn contact-btn-dark">WhatsApp</a>
                  </div>
                </div>
              </template>
            </div>
          </div>
        </div>
      </transition>
    </teleport>
  </section>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { RouterLink } from 'vue-router'

type ServiceItem = {
  title: string
  desc: string
  slug: string
  image: string
}

const services: ServiceItem[] = [
  {
    title: 'Cambio de llantas',
    desc: 'Retiro y reemplazo rápido de llantas con herramientas profesionales.',
    slug: 'cambio-llantas',
    image: 'https://www.edenred.mx/hs-fs/hubfs/Media%20Source%202024%20(im%C3%A1genes%20blog)/Julio-2024/Cada-cu%C3%A1nto-debes-hacer-cambio-de-llantas/cuando-debo-cambiar-las-llantas-de-un-vehiculo.png?width=600&height=343&name=cuando-debo-cambiar-las-llantas-de-un-vehiculo.png'
  },
  {
    title: 'Instalación de llantas',
    desc: 'Montaje y ajuste de llantas nuevas garantizando seguridad y ajuste.',
    slug: 'instalacion-llantas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTLYG_Irnzlxdn4UQPFhXoNpapt31LOEJIfTw&s'
  },
  {
    title: 'Alineación y balanceo',
    desc: 'Alineación precisa y balanceo para una conducción estable y segura.',
    slug: 'alineacion-balanceo',
    image: 'https://s7d1.scene7.com/is/image/bridgestone/consumer-content-article-banner-servicios-alineacion-balanceo'
  },
  {
    title: 'Compra de llantas',
    desc: 'Encuentra y compra llantas según medida, marca y vehículo.',
    slug: 'compra-llantas',
    image: 'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcSY_6i-02-CUjTzS9k4vbAy1KkTNaX7lVaW5Q&s'
  }
]

const motoCategories = ['Ciudad', 'Doble propósito', 'Alto cilindraje', 'Trabajo']
const carroCategories = ['Automóvil', 'Camioneta / SUV', 'Deportivo', 'Todo terreno']

const activeModal = ref<ServiceItem | null>(null)

const openServiceModal = (service: ServiceItem) => {
  activeModal.value = service
}

const closeModal = () => {
  activeModal.value = null
}

defineOptions({ name: 'CategorySection' })
</script>

<style scoped>
.category-section { padding: 32px 0; background: #0b0b0b; color: #fff }
.container { max-width: 1100px; margin: 0 auto; padding: 0 18px; box-sizing: border-box }
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
.service-cards { display:grid; grid-template-columns: repeat(4, 1fr); gap:20px; margin-bottom: 18px }
.service-card { background: #fff; color:#111; border-radius:12px; padding:0 0 12px; display:flex; flex-direction:column; align-items:center; text-align:center; border:1px solid rgba(0,0,0,0.06); box-shadow: 0 6px 18px rgba(0,0,0,0.06) }
.service-card { min-width: 0 }
.service-media { width:100%; aspect-ratio: 16 / 10; border-radius:12px 12px 0 0; display:flex; align-items:center; justify-content:center; margin-bottom:14px; background: linear-gradient(180deg, rgba(0,0,0,0.03), rgba(0,0,0,0.01)); overflow: hidden }
.service-media-img { width: 100%; height: 100%; object-fit: cover; }
.service-card { text-decoration: none }
.service-card:focus { outline: 3px solid rgba(255,59,48,0.18); outline-offset: 4px }
.service-title { font-weight:800; font-size:1rem; margin-bottom:8px }
.service-desc { font-size:0.95rem; color:#666; margin:0 0 12px; line-height:1.3; max-width:220px }
.btn { background:#ff3b30; color:#fff; padding:8px 18px; border-radius:22px; border:none; cursor:pointer; font-weight:700 }
.btn:hover { opacity:0.95; transform: translateY(-2px) }

.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.72);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
  z-index: 2000;
}

.service-modal {
  width: min(460px, 100%);
  background: #111111;
  color: #fff;
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 18px;
  box-shadow: 0 24px 80px rgba(0, 0, 0, 0.5);
  overflow: hidden;
  position: relative;
}

.modal-content {
  padding: 20px 18px 18px;
}

.modal-content h3 {
  margin: 0 0 8px;
  font-size: 1.2rem;
}

.modal-desc {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
  font-size: 0.95rem;
}

.modal-note {
  margin: 0 0 12px;
  color: #fca5a5;
  font-size: 0.9rem;
}

.modal-filters {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.modal-filter-btn,
.contact-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  border-radius: 999px;
  padding: 10px 12px;
  font-size: 0.88rem;
  font-weight: 700;
}

.modal-filter-btn {
  background: #fff;
  color: #111111;
}

.contact-box {
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  padding-top: 14px;
}

.contact-box strong {
  display: block;
  margin-bottom: 6px;
}

.contact-box p {
  margin: 0 0 12px;
  color: rgba(255, 255, 255, 0.78);
  line-height: 1.45;
  font-size: 0.92rem;
}

.contact-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.contact-btn {
  background: #ff3b30;
  color: #fff;
  border: 1px solid transparent;
}

.contact-btn-dark {
  background: transparent;
  border-color: rgba(255, 255, 255, 0.14);
}

.modal-close {
  position: absolute;
  top: 10px;
  right: 10px;
  width: 34px;
  height: 34px;
  border-radius: 999px;
  border: none;
  background: rgba(255, 255, 255, 0.12);
  color: #fff;
  cursor: pointer;
  z-index: 2;
}

.modal-fade-enter-active,
.modal-fade-leave-active {
  transition: opacity 0.18s ease;
}

.modal-fade-enter-from,
.modal-fade-leave-to {
  opacity: 0;
}

@media (max-width: 900px) { .service-cards { grid-template-columns: repeat(2, 1fr) } }
@media (max-width: 520px) {
  /* servicios: 2 tarjetas por fila en móvil, diseño más compacto y consistente */
  .service-cards { grid-template-columns: repeat(2, 1fr); gap:12px }
  /* evita que contenido largo provoque overflow en grid items */
  .service-card { min-width: 0 }
  .service-card .service-media { width:100%; height:110px; border-radius:10px; margin-bottom:10px }
  .service-card .service-title { font-size:0.90rem }
  .service-card .service-desc { font-size:0.70rem; max-width:100% }
  .service-card .btn { padding:8px 14px; font-size:14px }

  /* tarjetas inferiores: 2 por fila en móvil */
  .cards { grid-template-columns: repeat(2, 1fr); gap:10px }
  .card { padding:12px }
  /* aseguro que el contenedor no desborde el viewport */
  .container { padding-left:12px; padding-right:12px }
  .category-section { overflow-x: hidden }
}

@media (max-width: 768px) {
  .category-groups { flex-direction:column }
  .section-title { font-size: 25px }
}
</style>
