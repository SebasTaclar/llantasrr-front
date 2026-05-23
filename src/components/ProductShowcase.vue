<template>
  <section class="showcase-section">
    <div class="container">
      <h2 class="showcase-title">NOVEDADES</h2>

      <p class="showcase-subtitle">
        {{ showcaseCards.length > 0 ? 'Descubre las novedades o anuncios que estan disponibles para ti' : 'Aún no hay novedades publicadas desde el panel de administración' }}
      </p>

      <div v-if="showcaseCards.length > 0" class="showcase-grid">
        <div
          v-for="product in showcaseCards"
          :key="product.id"
          class="showcase-card"
          @click="showProductDetail(product)"
        >
          <div class="showcase-card-image">
            <img :src="product.image" :alt="product.name" />
          </div>

          <div class="showcase-card-overlay">
            <h3>{{ product.name }}</h3>
          </div>
        </div>
      </div>

      <div v-else class="showcase-empty">
        <p>No hay novedades creadas todavía. Espere nuestras mejores ofertas y anuncios.</p>
      </div>
    </div>

    <!-- Modal de detalle del producto -->
    <Teleport to="body">
      <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
        <div class="modal-content">
          <button class="modal-close" @click="showModal = false">✕</button>

          <div class="modal-visual">
            <span class="modal-badge">Novedad destacada</span>
            <div class="modal-image">
              <img :src="selectedProduct?.image" :alt="selectedProduct?.name" />
            </div>
          </div>

          <div class="modal-body">
            <div class="modal-info">
              <h3 class="modal-title">{{ selectedProduct?.name }}</h3>
              <p class="modal-description">{{ selectedProduct?.description }}</p>
              <p class="modal-contact-text">
                Para conocer más de nuestra novedad o anuncio comunícate con nosotros.
              </p>
              <a href="https://wa.me/573138936332" target="_blank" rel="noreferrer" class="modal-whatsapp-btn">
                WhatsApp
              </a>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </section>
</template>

<script setup lang="ts">
import { computed, ref, onMounted } from 'vue'
import { useProducts } from '@/composables/useProducts'

// Usar el composable de productos para novedades
const { showcaseProducts, getCategoryById, loadShowcaseProducts } = useProducts()

// Estado para el modal
const showModal = ref(false)
const selectedProduct = ref<{
  id: number
  name: string
  description: string
  image: string
  categoryName: string
} | null>(null)

// Cargar productos showcase al montar el componente
onMounted(async () => {
  console.log('🌟 [ProductShowcase] Cargando productos showcase...')
  await loadShowcaseProducts()
})

// Mapear novedades del admin al formato visible en la home.
const showcaseCards = computed(() => {
  return showcaseProducts.value
    .slice()
    .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    .map(product => ({
      id: parseInt(product.id),
      name: product.name,
      description: product.description,
      image: product.image,
      price: product.price,
      categoryName: getCategoryById(product.category)?.name || 'Sin categoría',
      createdAt: product.createdAt
    }))
})

// Funciones para el modal
const showProductDetail = (product: {
  id: number
  name: string
  description: string
  image: string
  categoryName: string
}) => {
  selectedProduct.value = product
  showModal.value = true
}
</script>

<style scoped>
/* Variables de tema - CASA COMERCIAL DE LA LLANTA RR */
:root {
  --primary-red: #DC2626;
  --black: #000000;
  --white: #FFFFFF;
}

/* Animaciones */
@keyframes fadeIn {
  from { opacity: 0; transform: translateY(20px); }
  to { opacity: 1; transform: translateY(0); }
}

@keyframes slideIn {
  from { opacity: 0; transform: translateX(-20px); }
  to { opacity: 1; transform: translateX(0); }
}

/* Contenedor principal - ESTILO OSCURO */
.showcase-section {
  width: 100%;
  background: #ffffff;
  padding: 3rem 0;
  position: relative;
  overflow-x: hidden;
}

.showcase-section::before { display: none; }

.container {
  max-width: 1400px;
  position: relative;
  z-index: 1;
  padding: 0 1.25rem;
  margin: 0 auto;
  box-sizing: border-box;
}

/* Títulos */
.showcase-title {
  font-size: 35px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #fffefe;
  letter-spacing: -0.02em;
}

.showcase-subtitle {
  font-size: 1.1rem;
  color: #f6f6f7;
  text-align: center;
  margin-bottom: 2rem;
  animation: fadeIn 1s ease-out;
}


.showcase-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 260px));
  gap: 1.25rem;
  align-items: stretch;
  justify-content: center;
}

.showcase-card {
  position: relative;
  border-radius: 20px;
  overflow: hidden;
  min-height: 210px;
  aspect-ratio: 1 / 1;
  cursor: pointer;
  background: linear-gradient(135deg, #111827 0%, #0b0b0b 100%);
  box-shadow: 0 14px 30px rgba(15, 23, 42, 0.12);
  transform: translateY(0);
  transition: transform 0.25s ease, box-shadow 0.25s ease;
}
.showcase-card { min-width: 0; width: 100%; }

.showcase-card:hover {
  transform: translateY(-4px);
  box-shadow: 0 18px 36px rgba(15, 23, 42, 0.18);
}

.showcase-card-image {
  position: absolute;
  inset: 0;
}

.showcase-card-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.showcase-card::after {
  content: '';
  position: absolute;
  inset: 0;
  background: linear-gradient(180deg, rgba(0, 0, 0, 0.02) 0%, rgba(0, 0, 0, 0.1) 45%, rgba(0, 0, 0, 0.72) 100%);
}

.showcase-card-overlay {
  position: absolute;
  inset: auto 0 0 0;
  z-index: 1;
  padding: 1rem;
  color: #fff;
}

.showcase-card-badge {
  display: inline-flex;
  align-items: center;
  padding: 0.3rem 0.65rem;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.18);
  border: 1px solid rgba(255, 255, 255, 0.22);
  font-size: 0.72rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.06em;
  margin-bottom: 0.6rem;
}

.showcase-card-overlay h3 {
  margin: 0 0 0.35rem;
  font-size: 1rem;
  line-height: 1.15;
}

.showcase-card-overlay p {
  margin: 0;
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.8);
}

.showcase-empty {
  margin: 0 0 2rem;
  padding: 1.25rem 1.5rem;
  border-radius: 16px;
  border: 1px dashed rgba(220, 38, 38, 0.3);
  color: #6b7280;
  text-align: center;
  background: rgba(249, 250, 251, 0.9);
}

.product-category {
  display: inline-block;
  font-size: 0.85rem;
  color: var(--primary-red);
  background: rgba(220, 38, 38, 0.15);
  padding: 0.35rem 0.75rem;
  border-radius: 12px;
  font-weight: 500;
  border: 1px solid rgba(220, 38, 38, 0.3);
}

/* Modal */
.modal-overlay {
  position: fixed;
  inset: 0;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 2147483647;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
  pointer-events: auto;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 24px;
  max-width: 760px;
  width: min(94vw, 760px);
  max-height: min(88vh, 760px);
  overflow: hidden;
  border: 1px solid rgba(220, 38, 38, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(280px, 0.8fr);
  position: relative;
}

.modal-visual {
  position: relative;
  background: radial-gradient(circle at top, rgba(220, 38, 38, 0.14), rgba(0, 0, 0, 0.9) 70%);
  padding: 1.1rem;
  min-height: 100%;
}

.modal-badge {
  position: absolute;
  top: 16px;
  left: 16px;
  z-index: 2;
  display: inline-flex;
  align-items: center;
  padding: 0.35rem 0.75rem;
  border-radius: 999px;
  background: rgba(34, 204, 125, 0.623);
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: #fff;
  font-size: 0.75rem;
  font-weight: 800;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.modal-close {
  background: none;
  border: none;
  color: rgba(255, 255, 255, 0.6);
  cursor: pointer;
  font-size: 2rem;
  width: 40px;
  height: 40px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  transition: all 0.3s ease;
  position: absolute;
  top: 12px;
  right: 12px;
  z-index: 3;
  background: rgba(0, 0, 0, 0.28);
}

.modal-close:hover {
  background: rgba(220, 38, 38, 0.2);
  color: var(--primary-red);
  transform: rotate(90deg);
}

.modal-image {
  width: 100%;
  height: 100%;
  min-height: 360px;
  border-radius: 16px;
  overflow: hidden;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  max-width: 100%;
  max-height: 100%;
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  align-items: center;
}

.modal-info {
  width: 100%;
}

.modal-description {
  font-size: 1.08rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0 0 1rem;
}

.modal-title {
  font-size: 1.95rem;
  font-weight: 900;
  line-height: 1.1;
  color: #f8fafc;
  margin: 0 0 0.9rem;
  letter-spacing: -0.03em;
}

.modal-contact-text {
  margin: 0 0 1rem;
  font-size: 0.98rem;
  line-height: 1.55;
  color: rgba(255, 255, 255, 0.9);
}

.modal-whatsapp-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.85rem 1.2rem;
  border-radius: 999px;
  background: #25d366;
  color: #fff;
  text-decoration: none;
  font-weight: 800;
  box-shadow: 0 10px 24px rgba(37, 211, 102, 0.25);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .showcase-grid {
    grid-template-columns: repeat(auto-fit, minmax(210px, 1fr));
    gap: 1rem;
  }
}

@media (max-width: 768px) {
  .showcase-section {
    padding: 2.5rem 0;
  }

  .container {
    padding: 0 1rem;
  }

  .showcase-title {
    font-size: 2rem;
    padding: 0;
  }

  .showcase-subtitle {
    font-size: 1rem;
    margin-bottom: 1.5rem;
    padding: 0;
  }

  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }

  .showcase-card {
    min-height: 180px;
    border-radius: 16px;
  }

  .modal-content {
    max-width: 460px;
    width: min(94vw, 460px);
    max-height: min(86vh, 700px);
    grid-template-columns: 1fr;
  }

  .modal-image {
    min-height: 240px;
  }

  .modal-body {
    padding: 1.25rem;
  }
}

@media (max-width: 480px) {
  .showcase-title {
    font-size: 1.75rem;
  }

  /* Móvil: 1 tarjeta por fila para mejor legibilidad */
  .showcase-grid {
    grid-template-columns: 1fr;
    gap: 0.75rem;
  }

  .showcase-card {
    aspect-ratio: 16 / 10;
    min-height: 140px;
  }

  .showcase-card-overlay h3 {
    font-size: 0.95rem;
  }

  .modal-image {
    height: 160px;
  }
}

/* Extra small devices: evitar que 2 columnas quiebren el layout en pantallas muy estrechas */
@media (max-width: 360px) {
  .showcase-grid { grid-template-columns: 1fr; }
  .showcase-card { min-height: 140px; border-radius: 14px }
  .container { padding-left: 0.75rem; padding-right: 0.75rem }
  .showcase-section { padding-left: 0.5rem; padding-right: 0.5rem }

  /* Modal más compacto en móviles ultra-pequeños */
  .modal-content { width: 96vw; grid-template-columns: 1fr; max-height: 92vh }
  .modal-image { min-height: 180px }
  .modal-body { padding: 0.85rem }
  .modal-title { font-size: 1.25rem }
  .modal-close { top: 8px; right: 8px; width: 36px; height: 36px }
}

/* Mejora del modal en móviles: evitar que el contenido quede fuera de pantalla */
@media (max-width: 768px) {
  .modal-overlay {
    padding: 18px;
    align-items: flex-start;
    overflow-y: auto;
  }

  .modal-content {
    width: min(96vw, 520px);
    max-height: 92vh;
    grid-template-columns: 1fr;
    margin-top: 6vh;
    overflow: hidden;
  }

  .modal-body {
    max-height: calc(92vh - 220px);
    overflow-y: auto;
    padding: 1rem 1rem 1.25rem;
  }

  .modal-image { min-height: 180px }
  .modal-title { font-size: 1.35rem }
}

/* Ajustes para que la imagen quede completa dentro del contenedor en móviles */
@media (max-width: 768px) {
  .modal-visual { padding: 0; }
  .modal-image {
    min-height: 160px;
    height: auto;
    max-height: 50vh;
    display: flex;
    align-items: center;
    justify-content: center;
    padding: 8px;
    box-sizing: border-box;
    border-radius: 12px;
    background: transparent;
  }

  .modal-image img {
    width: auto;
    height: auto;
    max-width: 100%;
    max-height: 100%;
    object-fit: contain;
    display: block;
  }
}

@media (max-width: 420px) {
  .modal-image { max-height: 72vh }
  .modal-body { max-height: calc(92vh - 180px) }
}
</style>
