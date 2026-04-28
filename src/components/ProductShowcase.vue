<template>
  <section class="showcase-section">
    <div class="container">
      <h2 class="showcase-title">NOVEDADES</h2>

      <div class="showcase-banner" aria-hidden>
        <img src="/images/llantas rr 1.jpg" alt="Banner promociones" />
      </div>

      <p class="showcase-subtitle">Descubre nuestros productos más recientes</p>

      <!-- Sección: Tecnología -->
      <div v-if="technologyProducts.length > 0" class="category-section">
        <h3 class="category-title">📱 Tecnología</h3>
        <div class="products-carousel">
          <div
            v-for="product in technologyProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image" :alt="product.name" class="product-image" />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <span class="product-category">{{ product.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Navidad -->
      <div v-if="christmasProducts.length > 0" class="category-section">
        <h3 class="category-title">🎄 Navidad</h3>
        <div class="products-carousel">
          <div
            v-for="product in christmasProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image" :alt="product.name" class="product-image" />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <span class="product-category">{{ product.category }}</span>
            </div>
          </div>
        </div>
      </div>

      <!-- Sección: Hogar -->
      <div v-if="homeProducts.length > 0" class="category-section">
        <h3 class="category-title">🏠 Hogar</h3>
        <div class="products-carousel">
          <div
            v-for="product in homeProducts"
            :key="product.id"
            class="product-card"
            @click="showProductDetail(product)"
          >
            <div class="product-image-wrapper">
              <img :src="product.image" :alt="product.name" class="product-image" />
            </div>
            <div class="product-info">
              <h4 class="product-name">{{ product.name }}</h4>
              <span class="product-category">{{ product.category }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de detalle del producto -->
    <div v-if="showModal" class="modal-overlay" @click.self="showModal = false">
      <div class="modal-content">
        <div class="modal-header">
          <h3 class="modal-title">{{ selectedProduct?.name }}</h3>
          <button class="modal-close" @click="showModal = false">✕</button>
        </div>
        <div class="modal-body">
          <div class="modal-image">
            <img :src="selectedProduct?.image" :alt="selectedProduct?.name" />
          </div>
          <div class="modal-info">
            <span class="modal-category">{{ selectedProduct?.category }}</span>
            <p class="modal-description">{{ selectedProduct?.description }}</p>
          </div>
        </div>
      </div>
    </div>
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
  category: string
} | null>(null)

// Cargar productos showcase al montar el componente
onMounted(async () => {
  console.log('🌟 [ProductShowcase] Cargando productos showcase...')
  await loadShowcaseProducts()
})

// Mapear los productos del composable al formato que usa el template
const products = computed(() => {
  return showcaseProducts.value.map(product => ({
    id: parseInt(product.id),
    name: product.name,
    description: product.description,
    image: product.image,
    price: product.price,
    category: getCategoryById(product.category)?.name || 'Sin categoría'
  }))
})

// Filtrar productos por categoría principal
const technologyProducts = computed(() => {
  return products.value.filter(p => {
    const cat = p.category.toLowerCase()
    return cat.includes('iphone') || cat.includes('tecnología') ||
           cat.includes('tecnologia') || cat.includes('tech')
  }).slice(0, 6)
})

const christmasProducts = computed(() => {
  return products.value.filter(p => {
    const cat = p.category.toLowerCase()
    return cat.includes('navidad') || cat.includes('christmas') ||
           cat.includes('árbol') || cat.includes('arbol') ||
           cat.includes('bola') || cat.includes('decoración navideña')
  }).slice(0, 6)
})

const homeProducts = computed(() => {
  return products.value.filter(p => {
    const cat = p.category.toLowerCase()
    return cat.includes('hogar') || cat.includes('home') ||
           cat.includes('casa') || cat.includes('decoración') ||
           cat.includes('watch') || cat.includes('accesorio')
  }).slice(0, 6)
})

// Funciones para el modal
const showProductDetail = (product: {
  id: number
  name: string
  description: string
  image: string
  category: string
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
  background: linear-gradient(180deg, #ffffff 0%, #fafafa 100%);
  padding: 3rem 0;
  position: relative;
  overflow: visible;
}

.showcase-section::before { display: none; }

.container {
  max-width: 1400px;
  position: relative;
  z-index: 1;
}

/* Títulos */
.showcase-title {
  font-size: 35px;
  font-weight: 800;
  text-align: center;
  margin-bottom: 0.5rem;
  color: #FFFFFF;
  letter-spacing: -0.02em;
}

.showcase-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.6);
  text-align: center;
  margin-bottom: 4rem;
  animation: fadeIn 1s ease-out;
}

.showcase-banner { display:flex; justify-content:center;  }
.showcase-banner img { width:100%; max-width:1400px; height:300px; border-radius:8px; box-shadow: 0 12px 30px rgba(2,6,23,0.35); display:block }

/* Sección de categoría */
.category-section {
  margin-bottom: 4rem;
  animation: slideIn 0.8s ease-out;
}

.category-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--primary-red);
  margin-bottom: 2rem;
  padding-left: 1rem;
  border-left: 4px solid var(--primary-red);
  text-shadow: 0 2px 10px rgba(220, 38, 38, 0.3);
}

/* Carrusel de productos */
.products-carousel {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
  gap: 2rem;
  padding: 0 1rem;
}

/* Tarjeta de producto */
.product-card {
  background: var(--card-bg);
  border-radius: 12px;
  overflow: hidden;
  cursor: pointer;
  transition: none;
  border: 1px solid var(--border-color);
  backdrop-filter: none;
}

.product-card:hover { transform: none; box-shadow: none; border-color: var(--border-color); }

.product-image-wrapper {
  width: 100%;
  height: 250px;
  overflow: hidden;
  background: linear-gradient(135deg, #1a1a1a 0%, #0a0a0a 100%);
  position: relative;
}

.product-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.4s ease;
}

.product-card:hover .product-image {
  transform: scale(1.1);
}

.product-info {
  padding: 1.25rem;
}

.product-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--white);
  margin: 0 0 0.75rem 0;
  line-height: 1.4;
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
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.9);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
  backdrop-filter: blur(10px);
  animation: fadeIn 0.3s ease;
}

.modal-content {
  background: #1a1a1a;
  border-radius: 24px;
  max-width: 800px;
  width: 90%;
  max-height: 90vh;
  overflow: auto;
  border: 1px solid rgba(220, 38, 38, 0.3);
  box-shadow: 0 25px 50px rgba(0, 0, 0, 0.5);
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 1.5rem 2rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(10, 10, 10, 0.5);
}

.modal-title {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--white);
  margin: 0;
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
}

.modal-close:hover {
  background: rgba(220, 38, 38, 0.2);
  color: var(--primary-red);
  transform: rotate(90deg);
}

.modal-body {
  padding: 2rem;
}

.modal-image {
  width: 100%;
  height: 400px;
  border-radius: 16px;
  overflow: hidden;
  margin-bottom: 2rem;
  background: #0a0a0a;
  display: flex;
  align-items: center;
  justify-content: center;
}

.modal-image img {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.modal-info {
  text-align: center;
}

.modal-category {
  display: inline-block;
  padding: 0.5rem 1rem;
  background: rgba(220, 38, 38, 0.2);
  color: var(--primary-red);
  border-radius: 20px;
  font-size: 0.9rem;
  font-weight: 600;
  margin-bottom: 1rem;
  border: 1px solid rgba(220, 38, 38, 0.4);
}

.modal-description {
  font-size: 1.05rem;
  line-height: 1.7;
  color: rgba(255, 255, 255, 0.8);
  margin: 0;
}

/* Responsive Design */
@media (max-width: 1024px) {
  .products-carousel {
    grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
    gap: 1.5rem;
  }
}

@media (max-width: 768px) {
  .showcase-section {
    padding: 3rem 0;
  }

  .container {
    padding: 0;
  }

  .showcase-title {
    font-size: 2.25rem;
    padding: 0 1.5rem;
  }

  .showcase-subtitle {
    font-size: 1rem;
    margin-bottom: 3rem;
    padding: 0 1.5rem;
  }

  .category-section {
    margin-bottom: 3rem;
  }

  .category-title {
    font-size: 1.5rem;
    padding-left: 1.5rem;
    margin-left: 0;
  }

  /* Carrusel horizontal deslizable en móvil */
  .products-carousel {
    display: flex;
    overflow-x: auto;
    overflow-y: hidden;
    scroll-snap-type: x mandatory;
    -webkit-overflow-scrolling: touch;
    gap: 1rem;
    padding: 0 1.5rem;
    scrollbar-width: none; /* Firefox */
    -ms-overflow-style: none; /* IE/Edge */
  }

  .products-carousel::-webkit-scrollbar {
    display: none; /* Chrome, Safari, Opera */
  }

  .product-card {
    flex: 0 0 280px;
    scroll-snap-align: start;
  }

  .product-image-wrapper {
    height: 280px;
  }

  .modal-content {
    width: 95%;
  }

  .modal-image {
    height: 300px;
  }

  .modal-body {
    padding: 1.5rem;
  }
}

@media (max-width: 480px) {
  .showcase-title {
    font-size: 1.75rem;
  }

  .category-title {
    font-size: 1.25rem;
  }

  .product-card {
    flex: 0 0 260px;
  }

  .product-image-wrapper {
    height: 260px;
  }

  .product-info {
    padding: 1rem;
  }

  .product-name {
    font-size: 1rem;
  }

  .modal-image {
    height: 250px;
  }
}
</style>
