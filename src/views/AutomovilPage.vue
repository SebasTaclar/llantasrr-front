<template>
  <main class="automovil-page">
    <div class="page-shell">
      <aside class="filters-panel">
        <div class="filters-card">
          <h3>Rango de Precio</h3>

          <label v-for="option in priceRanges" :key="option.value" class="filter-option">
            <input v-model="selectedPriceRange" type="radio" name="price-range" :value="option.value" />
            <span>{{ option.label }}</span>
          </label>

          <hr />

          <label class="filter-group">
            <span class="filter-label">Marca</span>
            <select v-model="selectedBrand">
              <option value="">Todas</option>
              <option v-for="brand in brandOptions" :key="brand" :value="brand">{{ brand }}</option>
            </select>
          </label>

          <label class="filter-group">
            <span class="filter-label">Medida</span>
            <select v-model="selectedMeasure">
              <option value="">Todas</option>
              <option v-for="m in measureOptions" :key="m" :value="m">{{ m }}</option>
            </select>
          </label>

          <label class="filter-group">
            <span class="filter-label">Rin</span>
            <select v-model="selectedRim">
              <option value="">Todos</option>
              <option v-for="r in rimOptions" :key="r" :value="r">{{ r }}</option>
            </select>
          </label>

          <button type="button" class="clear-filters-btn" @click="clearFilters">
            Limpiar Filtros
          </button>
        </div>
      </aside>

      <section class="content-area">
        <header class="hero-card">
          <div class="hero-copy">
            <p class="hero-kicker">Automóvil</p>
            <h1>Llantas para Carro</h1>
            <p class="hero-text">
              Encuentra llantas para automóvil con diseño, agarre y durabilidad para acompañar tu ruta diaria.
            </p>
          </div>

          <div class="hero-visual" :style="{ backgroundImage: `url(https://res.cloudinary.com/dlwzazojt/image/upload/q_auto/f_auto/v1779466200/automovil_x1hom2.png)` }" aria-label="Llantas para automóvil"></div>
        </header>

        <div class="toolbar">
          <div class="search-box">
            <svg viewBox="0 0 24 24" width="18" height="18" aria-hidden="true">
              <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
            </svg>
            <input
              v-model="searchTerm"
              type="search"
              placeholder="Buscar productos..."
              aria-label="Buscar productos"
            />
          </div>

          <label class="sort-box">
            <span>Ordenar por:</span>
            <select v-model="selectedSort">
              <option value="destacados">Destacados</option>
              <option value="nuevos">Más recientes</option>
              <option value="precio-asc">Precio: menor a mayor</option>
              <option value="precio-desc">Precio: mayor a menor</option>
            </select>
          </label>
        </div>

        <p class="results-count">Mostrando {{ filteredProducts.length }} productos</p>

        <div v-if="filteredProducts.length > 0" class="products-grid">
          <article v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="product-media">
              <img
                :src="product.images[0] || fallbackImage"
                :alt="product.name"
                loading="lazy"
                decoding="async"
              />
              <span :class="['status-badge', getStatusClass(product.status)]">
                {{ getStatusText(product.status) }}
              </span>
              <span v-if="product.originalPrice && product.originalPrice > product.price" class="discount-badge">
                -{{ discountPercent(product) }}%
              </span>
            </div>

            <div class="product-body">
              <p class="product-category">Automóvil</p>
              <h3>{{ product.name }}</h3>
              <p class="product-brand">{{ product.description || 'Marca no especificada' }}</p>

              <div class="tech-row">
                <div class="tech-item">
                  <span class="tech-label">Medida</span>
                  <span class="tech-value">{{ getTireMeasure(product) }}</span>
                </div>

                <div class="tech-divider"></div>

                <div class="tech-item">
                  <span class="tech-label">Rin</span>
                  <span class="tech-value tech-rim">{{ getTireRim(product) }}</span>
                </div>
              </div>

              <div class="price-block price-block-centered">
                <span class="current-price">${{ formatPrice(product.price) }} COP</span>
                <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                  ${{ formatPrice(product.originalPrice) }} COP
                </span>
              </div>

              <div class="card-actions">
                <button class="add-btn" type="button" @click="handleAddToCart(product)">
                  <span class="cart-icon">🛒</span>
                  Agregar al carrito
                </button>
                <button class="fav-btn" type="button" aria-label="Favorito">
                  ♡
                </button>
              </div>
            </div>
          </article>
        </div>

        <div v-else class="empty-state">
          <h3>No hay productos para mostrar</h3>
          <p>Prueba con otro filtro de precio o limpia la búsqueda.</p>
          <button type="button" class="clear-filters-btn" @click="clearFilters">
            Limpiar Filtros
          </button>
        </div>
      </section>
    </div>
  </main>
</template>

<script setup lang="ts">
import { computed, onMounted, ref } from 'vue'
import { useCart } from '@/composables/useCart'
import { useProducts, type Product as StoreProduct } from '@/composables/useProducts'

defineOptions({ name: 'AutomovilPage' })

const { addToCart } = useCart()
const { availableProducts, categories, getCategoryById, loadProducts, loadCategories } = useProducts()

const searchTerm = ref('')
const selectedSort = ref<'destacados' | 'nuevos' | 'precio-asc' | 'precio-desc'>('destacados')
const selectedPriceRange = ref('todos')
const selectedBrand = ref('')
const selectedMeasure = ref('')
const selectedRim = ref('')

const fallbackImage = '/images/llantas%20rr%201.jpg'

const priceRanges = [
  { value: 'todos', label: 'Todos' },
  { value: 'menos-100000', label: 'Menos de $100.000 COP' },
  { value: '100000-500000', label: '$100.000 - $500.000 COP' },
  { value: '500000-1000000', label: '$500.000 - $1.000.000 COP' },
  { value: 'mas-1000000', label: 'Más de $1.000.000 COP' },
]

const normalize = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim()

const isAutomovilCategory = (product: StoreProduct) => {
  const categoryName = getCategoryById(product.category)?.name || ''
  const normalized = normalize(categoryName)
  return ['carro', 'automovil', 'automóvil', 'auto', 'vehiculo', 'vehículo'].some((term) => normalized.includes(normalize(term)))
}

const automotiveProducts = computed(() => {
  const hasAutomovilCategories = categories.value.some((category) => isAutomovilCategory({
    id: '0',
    name: '',
    description: '',
    price: 0,
    images: [],
    category: category.id,
    status: 'available',
    createdAt: new Date(),
  }))

  const baseList = availableProducts.value.filter((product) => {
    if (hasAutomovilCategories) {
      return isAutomovilCategory(product)
    }
    return true
  })

  return baseList
})

const matchesPriceRange = (price: number) => {
  switch (selectedPriceRange.value) {
    case 'menos-100000':
      return price < 100000
    case '100000-500000':
      return price >= 100000 && price <= 500000
    case '500000-1000000':
      return price > 500000 && price <= 1000000
    case 'mas-1000000':
      return price > 1000000
    default:
      return true
  }
}

const filteredProducts = computed(() => {
  const term = normalize(searchTerm.value)

  let items = automotiveProducts.value.filter((product) => {
    const matchesText = !term || [
      product.name,
      product.description,
      getCategoryById(product.category)?.name || '',
    ].some((field) => normalize(field).includes(term))

    if (!matchesText) return false
    if (!matchesPriceRange(product.price)) return false
    if (selectedBrand.value && (product.description || '') !== selectedBrand.value) return false
    if (selectedMeasure.value && getTireMeasure(product) !== selectedMeasure.value) return false
    if (selectedRim.value && getTireRim(product) !== selectedRim.value) return false

    return true
  })

  switch (selectedSort.value) {
    case 'precio-asc':
      items = [...items].sort((a, b) => a.price - b.price)
      break
    case 'precio-desc':
      items = [...items].sort((a, b) => b.price - a.price)
      break
    case 'nuevos':
      items = [...items].sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
      break
    default:
      items = [...items].sort((a, b) => {
        if (a.status === 'available' && b.status !== 'available') return -1
        if (a.status !== 'available' && b.status === 'available') return 1
        return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      })
      break
  }

  return items
})

const heroProduct = computed(() => filteredProducts.value[0] || automotiveProducts.value[0])
const heroImage = computed(() => heroProduct.value?.images?.[0] || fallbackImage)

const formatPrice = (value: number) => value.toLocaleString('es-CO')

const getTireMeasure = (product: StoreProduct) => {
  return product.colors?.[0] || 'Medida no especificada'
}

const getTireRim = (product: StoreProduct) => {
  const measure = getTireMeasure(product)
  const normalizedMeasure = measure.toUpperCase().replace(/\s+/g, '')
  const match = normalizedMeasure.match(/R(\d{2,3})/)
  return match ? match[1] : '--'
}

const getStatusText = (status: string) => {
  const map: Record<string, string> = {
    available: 'Disponible',
    'coming-soon': 'Próximamente',
    'out-of-stock': 'Sin Stock',
  }
  return map[status] || 'Disponible'
}

const getStatusClass = (status: string) => {
  const map: Record<string, string> = {
    available: 'available',
    'coming-soon': 'coming-soon',
    'out-of-stock': 'out-of-stock',
  }
  return map[status] || 'available'
}

const discountPercent = (product: StoreProduct) => {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

const clearFilters = () => {
  searchTerm.value = ''
  selectedSort.value = 'destacados'
  selectedPriceRange.value = 'todos'
  selectedBrand.value = ''
  selectedMeasure.value = ''
  selectedRim.value = ''
}

const brandOptions = computed(() => {
  const set = new Set<string>()
  availableProducts.value.forEach((p) => {
    if (p.description) set.add(p.description)
  })
  return Array.from(set).sort()
})

const measureOptions = computed(() => {
  const set = new Set<string>()
  availableProducts.value.forEach((p) => {
    const m = p.colors?.[0]
    if (m) set.add(m)
  })
  return Array.from(set).sort()
})

const rimOptions = computed(() => {
  const set = new Set<string>()
  availableProducts.value.forEach((p) => {
    const r = getTireRim(p)
    if (r && r !== '--') set.add(r)
  })
  return Array.from(set).sort((a, b) => Number(a) - Number(b))
})

const handleAddToCart = (product: StoreProduct) => {
  addToCart(
    {
      id: product.id,
      name: product.name,
      price: product.price,
      image: product.images[0] || fallbackImage,
      category: getCategoryById(product.category)?.name || 'Automóvil',
      description: product.description,
      inStock: product.status === 'available',
      originalPrice: product.originalPrice,
    },
    1
  )
}

onMounted(async () => {
  await loadCategories()
  await loadProducts()
})
</script>

<style scoped>
.automovil-page {
  min-height: 100vh;
  background: linear-gradient(180deg, #f5f3ef 0%, #ede8e1 100%);
  padding: 138px 24px 32px;
  color: #111111;
}

.page-shell {
  max-width: 1400px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 260px minmax(0, 1fr);
  gap: 20px;
}

.filters-panel {
  position: sticky;
  top: 108px;
  align-self: start;
}

.filters-card {
  background: #fff;
  border: 1px solid rgba(17, 17, 17, 0.08);
  border-radius: 18px;
  padding: 22px 18px;
  box-shadow: 0 10px 28px rgba(0, 0, 0, 0.06);
}

.filters-card h3 {
  margin: 0 0 14px;
  font-size: 1.05rem;
  color: #111111;
}

.filter-option {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-bottom: 12px;
  font-size: 0.92rem;
  color: #444;
  cursor: pointer;
}

.filter-option input {
  accent-color: #dc2626;
}

.clear-filters-btn {
  width: 100%;
  margin-top: 10px;
  border: 1px solid rgba(17, 17, 17, 0.16);
  background: #fff;
  color: #111111;
  border-radius: 999px;
  padding: 12px 16px;
  font-weight: 700;
  cursor: pointer;
  transition: all 0.2s ease;
}

.clear-filters-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
}

.content-area {
  min-width: 0;
}

.hero-card {
  background: linear-gradient(135deg, #111111 0%, #1f1f1f 100%);
  color: #fff;
  border-radius: 22px;
  padding: 28px;
  box-shadow: 0 16px 35px rgba(0, 0, 0, 0.12);
  display: grid;
  grid-template-columns: minmax(0, 1.3fr) minmax(240px, 360px);
  align-items: center;
  gap: 20px;
}

.hero-kicker {
  margin: 0 0 8px;
  color: #fca5a5;
  text-transform: uppercase;
  letter-spacing: 0.18em;
  font-size: 0.78rem;
  font-weight: 700;
}

.hero-card h1 {
  margin: 0;
  font-size: clamp(2rem, 3vw, 3.1rem);
  line-height: 1.05;
}

.hero-text {
  margin: 12px 0 0;
  max-width: 560px;
  color: rgba(255, 255, 255, 0.78);
  font-size: 1rem;
  line-height: 1.6;
}

.hero-visual {
  justify-self: end;
  width: 110%;
  max-width: 640px;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.2);
  background-position: center;
  background-repeat: no-repeat;
  background-size: cover;
  min-height: 220px;
}

.toolbar {
  display: flex;
  gap: 14px;
  align-items: center;
  margin: 18px 0 10px;
  flex-wrap: wrap;
}

.search-box {
  flex: 1 1 360px;
  min-width: 240px;
  display: flex;
  align-items: center;
  gap: 10px;
  background: #fff;
  border: 1px solid rgba(17, 17, 17, 0.1);
  border-radius: 999px;
  padding: 12px 16px;
  color: #6b7280;
}

.search-box svg {
  flex: 0 0 auto;
}

.search-box input {
  border: none;
  outline: none;
  width: 100%;
  background: transparent;
  color: #111111;
  font-size: 0.95rem;
}

.sort-box {
  display: flex;
  align-items: center;
  gap: 10px;
  font-size: 0.92rem;
  color: #444;
  margin-left: auto;
}

.sort-box select {
  border: 1px solid rgba(17, 17, 17, 0.14);
  border-radius: 999px;
  background: #fff;
  padding: 10px 14px;
  color: #111111;
  min-width: 180px;
  outline: none;
}

.results-count {
  margin: 12px 0 16px;
  color: #6b7280;
  font-size: 0.92rem;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(260px, 1fr));
  gap: 18px;
}

.product-card {
  background: #fff;
  border-radius: 18px;
  overflow: hidden;
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.08);
  border: 1px solid rgba(17, 17, 17, 0.08);
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.product-media {
  position: relative;
  background: #ffffff;
  aspect-ratio: 1 / 0.88;
  padding: 10px 10px 6px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 50%;
}

.product-media img {
  width: 92%;
  height: 92%;
  object-fit: contain;
  display: block;
}

.status-badge,
.discount-badge {
  position: absolute;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 6px 10px;

}

.status-badge {
  left: 12px;
  bottom: 12px;
  text-transform: uppercase;
}

.status-badge.available {
  background: rgba(34, 197, 94, 0.92);
  color: #fff;
}

.status-badge.coming-soon {
  background: rgba(234, 179, 8, 0.95);
  color: #fff;
}

.status-badge.out-of-stock {
  background: rgba(220, 38, 38, 0.92);
  color: #fff;
}

.discount-badge {
  right: 12px;
  top: 12px;
  background:#dc2626;
  color: #fff;
}

.product-body {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 16px 16px 18px;
  flex: 1;
}

.product-category {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #dc2626;
  font-weight: 700;
}

.product-body h3 {
  margin: 0;
  font-size: 1.08rem;
  line-height: 1.2;
  color: #111111;
  font-weight: 800;
}

.product-brand {
  margin: 0;
  color: #7a7a7a;
  font-size: 0.92rem;
  line-height: 1.35;
}

.tech-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px 0 8px;
  border-top: 1px solid #ececec;
  border-bottom: 1px solid #ececec;
}

.tech-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tech-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: #8b8b8b;
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tech-value {
  font-size: 0.98rem;
  font-weight: 800;
  color: #202020;
}

.tech-rim {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tech-divider {
  width: 1px;
  height: 36px;
  background: #e4e4e4;
}

.price-block {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.price-block-centered {
  margin-top: auto;
  align-items: center;
  text-align: center;
}

.current-price {
  color: #dc2626;
  font-weight: 900;
  font-size: 1.18rem;
}

.original-price {
  color: #8a8f98;
  text-decoration: line-through;
  font-size: 0.9rem;
}

.card-actions {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
}

.card-actions .add-btn {
  flex: 1;
  justify-content: center;
}

.add-btn {
  border: none;
  border-radius: 999px;
  padding: 12px 16px;
  background: #111827;
  color: #fff;
  font-weight: 700;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  transition: transform 0.2s ease, background 0.2s ease;
}

.add-btn:hover {
  background: #1f2937;
  transform: translateY(-1px);
}

.fav-btn {
  width: 42px;
  height: 42px;
  border-radius: 12px;
  border: 1px solid #e5e7eb;
  background: #fff;
  color: #111827;
  cursor: pointer;
  font-size: 1.05rem;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.fav-btn:hover {
  border-color: #dc2626;
  color: #dc2626;
  box-shadow: 0 6px 14px rgba(220, 38, 38, 0.08);
}

.empty-state {
  background: rgba(255, 255, 255, 0.8);
  border: 1px dashed rgba(17, 17, 17, 0.14);
  border-radius: 18px;
  padding: 32px;
  text-align: center;
  color: #444;
}

.empty-state h3 {
  margin: 0 0 8px;
  color: #111111;
}

@media (max-width: 1100px) {
  .page-shell {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: static;
  }

  .filters-card {
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px 16px;
    align-items: start;
  }

  .filters-card h3,
  .clear-filters-btn {
    grid-column: 1 / -1;
  }
}

@media (max-width: 900px) {
  .automovil-page {
    padding: 96px 16px 24px;
  }

  .page-shell {
    grid-template-columns: 1fr;
  }

  .filters-panel {
    position: static;
    width: 100%;
  }



  .filters-card {
    width: 100%;
    padding: 20px;
    grid-template-columns: 1fr;
  }

  .hero-card {
    grid-template-columns: 1fr;
    text-align: left;
  }

  .hero-visual {
    justify-self: center;
    width: 100%;
    max-width: 100%;
  }

  .sort-box {
    width: 100%;
    margin-left: 0;
    justify-content: space-between;
  }

  .sort-box select {
    flex: 1;
    min-width: 0;
  }

  .product-media {
    min-height: 220px;
  }
}

@media (max-width: 640px) {
  .automovil-page {
    padding: 84px 14px 24px;
  }

  .search-box {
    flex: none !important;
  }

  .filters-card {
    grid-template-columns: 1fr;
    gap: 12px;
    padding: 18px;
  }

  .filter-option {
    font-size: 0.95rem;
  }

  .toolbar {
    flex-direction: column;
    align-items: stretch;
  }

  .sort-box {
    flex-direction: column;
    align-items: stretch;
    gap: 10px;
  }

  .sort-box select {
    width: 100%;
  }

  .products-grid {
    grid-template-columns: 1fr;
  }

  .product-media {
    aspect-ratio: auto;
    min-height: 230px;
  }

  .card-actions {
    width: 100%;
    flex-direction: column;
    gap: 10px;
  }

  .add-btn,
  .fav-btn {
    width: 100%;
  }

  .results-count {
    font-size: 0.88rem;
  }
}

@media (max-width: 520px) {
  .automovil-page {
    padding: 80px 12px 20px;
  }

  .hero-card {
    padding: 20px;
    gap: 18px;
  }

  .product-body {
    padding: 14px;
  }

  .hero-kicker {
    font-size: 0.76rem;
  }

  .hero-card h1 {
    font-size: 2.2rem;
  }

  .hero-text {
    font-size: 0.95rem;
  }

  .card-actions {
    gap: 12px;
  }
}
</style>
