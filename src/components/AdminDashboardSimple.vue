<template>
  <div class="admin-dashboard">
    <div class="dashboard-header">
      <h1 class="dashboard-title">
        <span class="icon">⚙️</span>
        Panel de Administración - CASA COMERCIAL DE LA LLANTA RR
      </h1>
      <p class="dashboard-subtitle">Gestiona productos, categorías y configuraciones</p>
    </div>

    <!-- Estadísticas rápidas -->
    <div class="stats-grid">
      <div class="stat-card">
        <div class="stat-icon">📦</div>
        <div class="stat-content">
          <div class="stat-number">{{ products.length }}</div>
          <div class="stat-label">Productos</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">🏷️</div>
        <div class="stat-content">
          <div class="stat-number">{{ categories.length }}</div>
          <div class="stat-label">Categorías</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">✅</div>
        <div class="stat-content">
          <div class="stat-number">{{ availableProductsCount }}</div>
          <div class="stat-label">Disponibles</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon">💰</div>
        <div class="stat-content">
          <div class="stat-number">${{ totalValue.toLocaleString() }}</div>
          <div class="stat-label">Valor Total</div>
        </div>
      </div>
    </div>

    <!-- Navegación por pestañas -->
    <div class="tabs-container">
      <div class="tabs">
        <button
          v-for="tab in tabs"
          :key="tab.id"
          type="button"
          :class="['tab', { active: activeTab === tab.id } ]"
          @click="selectTab(tab.id)"
        >
          <span class="tab-icon">{{ tab.icon }}</span>
          {{ tab.name }}
        </button>
      </div>
    </div>

    <!-- Contenido de las pestañas -->
    <div class="tab-content">
      <!-- Pestaña de Productos -->
      <div v-if="activeTab === 'products'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Productos</h2>
          <button class="btn btn-primary" @click="openProductForm()">
            <span class="btn-icon">➕</span>
            Nuevo Producto
          </button>
        </div>

        <!-- Barra de búsqueda para productos -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
            </svg>
            <input
              type="search"
              v-model="searchProducts"
              placeholder="Buscar productos por nombre..."
              aria-label="Buscar productos"
              class="search-input"
            />
            <button v-if="searchProducts" class="search-clear" @click.prevent="searchProducts = ''" aria-label="Limpiar búsqueda">X</button>
          </div>

          <!-- Selector por categoría para productos -->
          <div class="category-filter-wrapper">
            <select v-model="selectedProductCategory" class="form-input category-select" aria-label="Filtrar por categoría">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>

        <!-- Lista de productos -->
        <div class="products-grid">
          <div v-for="product in filteredProducts" :key="product.id" class="product-card">
            <div class="product-image">
              <img v-if="product.images && product.images.length > 0" :src="product.images[0]" :alt="product.name" />
              <div v-else class="no-image">📷</div>
              <span :class="['status-badge', product.status]">{{ getStatusText(product.status) }}</span>
              <span v-if="product.originalPrice && product.originalPrice > product.price" class="discount-badge">
                -{{ getDiscountPercent(product) }}%
              </span>
            </div>
            <div class="product-info">
              <p class="product-category">Automóvil</p>
              <h3>{{ product.name }}</h3>
              <p class="product-brand">{{ getProductBrand(product) }}</p>

              <div class="tech-row">
                <div class="tech-item">
                  <span class="tech-label">Medida</span>
                  <span class="tech-value">{{ getProductMeasure(product) }}</span>
                </div>

                <div class="tech-divider"></div>

                <div class="tech-item">
                  <span class="tech-label">Rin</span>
                  <span class="tech-value tech-rim">{{ getProductRim(product) }}</span>
                </div>
              </div>

              <div class="price-block price-block-centered">
                <span class="current-price">${{ product.price.toLocaleString() }} COP</span>
                <span v-if="product.originalPrice && product.originalPrice > product.price" class="original-price">
                  ${{ product.originalPrice.toLocaleString() }} COP
                </span>
              </div>

              <div class="product-actions">
                <button class="btn btn-sm btn-secondary" @click="editProduct(product)">✏️ Editar</button>
                <button class="btn btn-sm btn-danger" @click="deleteProductConfirm(product.id)">🗑️ Eliminar</button>
              </div>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredProducts.length === 0 && !searchProducts" class="empty-state">
          <div class="empty-icon">📦</div>
          <h3>No hay productos</h3>
          <p>Comienza agregando tu primer producto</p>
          <button class="btn btn-primary" @click="openProductForm()">
            Crear Primer Producto
          </button>
        </div>
        <div v-else-if="filteredProducts.length === 0 && searchProducts" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay productos que coincidan con "{{ searchProducts }}"</p>
          <button class="btn btn-secondary" @click="searchProducts = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Categorías -->
      <div v-if="activeTab === 'categories'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Categorías</h2>
          <button class="btn btn-primary" @click="showCategoryForm = true">
            <span class="btn-icon">➕</span>
            Nueva Categoría
          </button>
        </div>

        <!-- Barra de búsqueda para categorías -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
            </svg>
            <input
              type="search"
              v-model="searchCategories"
              placeholder="Buscar categorías por nombre..."
              aria-label="Buscar categorías"
              class="search-input"
            />
            <button v-if="searchCategories" class="search-clear" @click.prevent="searchCategories = ''" aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>

        <!-- Lista de categorías -->
        <div class="categories-list">
          <div v-for="category in filteredCategories" :key="category.id" class="category-item">
            <div class="category-info">
              <h3>{{ category.name }}</h3>
              <p>{{ category.description }}</p>
              <span class="category-count">{{ getProductsInCategory(category.id) }} productos</span>
            </div>
            <div class="category-actions">
              <button class="btn btn-sm btn-secondary" @click="editCategory(category)">✏️</button>
              <button class="btn btn-sm btn-danger" @click="handleDeleteCategory(category.id)">🗑️</button>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredCategories.length === 0 && !searchCategories" class="empty-state">
          <div class="empty-icon">🏷️</div>
          <h3>No hay categorías</h3>
          <p>Crea categorías para organizar tus productos</p>
          <button class="btn btn-primary" @click="showCategoryForm = true">
            Crear Primera Categoría
          </button>
        </div>
        <div v-else-if="filteredCategories.length === 0 && searchCategories" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay categorías que coincidan con "{{ searchCategories }}"</p>
          <button class="btn btn-secondary" @click="searchCategories = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Novedades (ProductShowcase) -->
      <div v-if="activeTab === 'showcase'" class="content-section">
        <div class="section-header">
          <h2>Gestión de Novedades</h2>
          <button class="btn btn-primary" @click="showShowcaseForm = true">
            <span class="btn-icon">✨</span>
            Nueva Novedad
          </button>
        </div>

        <!-- Barra de búsqueda para novedades -->
        <div class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
            </svg>
            <input
              type="search"
              v-model="searchShowcase"
              placeholder="Buscar novedades por nombre..."
              aria-label="Buscar novedades"
              class="search-input"
            />
            <button v-if="searchShowcase" class="search-clear" @click.prevent="searchShowcase = ''" aria-label="Limpiar búsqueda">X</button>
          </div>

          <!-- Selector por categoría para novedades -->
          <div class="category-filter-wrapper">
            <select v-model="selectedShowcaseCategory" class="form-input category-select" aria-label="Filtrar novedades por categoría">
              <option value="">Todas las categorías</option>
              <option v-for="cat in categories" :key="cat.id" :value="cat.id">{{ cat.name }}</option>
            </select>
          </div>
        </div>

        <!-- Lista de productos showcase -->
        <div class="showcase-grid">
          <div v-for="product in filteredShowcase" :key="product.id" class="showcase-card">
            <div class="showcase-image">
              <img :src="product.image" :alt="product.name" />
            </div>
            <div class="showcase-info">
              <h3>{{ product.name }}</h3>
              <p class="showcase-description">{{ product.description }}</p>
              <div class="showcase-meta">
                <span class="showcase-category">{{ getCategoryById(product.category)?.name || 'Sin categoría' }}</span>
                <span class="showcase-status available">
                  Disponible
                </span>
              </div>
            </div>
            <div class="showcase-actions">
              <button class="btn btn-sm btn-secondary" @click="editShowcaseProduct(product)">✏️</button>
              <button class="btn btn-sm btn-danger" @click="deleteShowcaseConfirm(product.id)">🗑️</button>
            </div>
          </div>
        </div>

        <!-- Estado vacío o sin resultados -->
        <div v-if="filteredShowcase.length === 0 && !searchShowcase" class="empty-state">
          <div class="empty-icon">✨</div>
          <h3>No hay novedades</h3>
          <p>Agrega productos destacados para mostrar en la sección de novedades</p>
          <button class="btn btn-primary" @click="showShowcaseForm = true">
            Crear Primera Novedad
          </button>
        </div>
        <div v-else-if="filteredShowcase.length === 0 && searchShowcase" class="empty-state">
          <div class="empty-icon">🔍</div>
          <h3>No se encontraron resultados</h3>
          <p>No hay novedades que coincidan con "{{ searchShowcase }}"</p>
          <button class="btn btn-secondary" @click="searchShowcase = ''">
            Limpiar búsqueda
          </button>
        </div>
      </div>

      <!-- Pestaña de Resumen de Compras -->
      <div v-if="activeTab === 'sales'" class="content-section">
        <div class="section-header">
          <h2>Resumen de Compras</h2>
          <button @click="loadPurchases" class="btn-secondary" :disabled="isLoadingSales">
            {{ isLoadingSales ? 'Cargando...' : 'Actualizar' }}
          </button>
        </div>

        <!-- Barra de búsqueda para compras -->
        <div v-if="!isLoadingSales && !salesError && sales.length > 0" class="search-bar">
          <div class="search-input-wrapper">
            <svg class="search-icon" viewBox="0 0 24 24" width="20" height="20" aria-hidden="true">
              <path fill="currentColor" d="M10 2a8 8 0 1 1 0 16 8 8 0 0 1 0-16zm8.707 17.293-4.387-4.387a9 9 0 1 0-1.414 1.414l4.387 4.387a1 1 0 0 0 1.414-1.414z"/>
            </svg>
            <input
              type="search"
              v-model="searchSales"
              placeholder="Buscar por cliente o producto..."
              aria-label="Buscar compras"
              class="search-input"
            />
            <button v-if="searchSales" class="search-clear" @click.prevent="searchSales = ''" aria-label="Limpiar búsqueda">X</button>
          </div>
        </div>

        <!-- Estado de carga -->
        <div v-if="isLoadingSales" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando compras...</p>
        </div>

        <!-- Error -->
        <div v-else-if="salesError" class="error-state">
          <div class="error-icon">⚠️</div>
          <p>{{ salesError }}</p>
          <button @click="loadPurchases" class="btn-primary">Reintentar</button>
        </div>

        <!-- Contenido -->
        <div v-else>
          <!-- Estadísticas de ventas -->
          <div class="sales-stats">
            <div class="stat-card">
              <div class="stat-icon">💰</div>
              <div class="stat-content">
                <div class="stat-number">${{ totalRevenue.toLocaleString() }}</div>
                <div class="stat-label">Ingresos Totales</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">⏳</div>
              <div class="stat-content">
                <div class="stat-number">{{ pendingSales }}</div>
                <div class="stat-label">Ventas Pendientes</div>
              </div>
            </div>
            <div class="stat-card">
              <div class="stat-icon">📈</div>
              <div class="stat-content">
                <div class="stat-number">{{ totalSalesCount }}</div>
                <div class="stat-label">Total Ventas</div>
              </div>
            </div>
          </div>

          <!-- Tabla de ventas -->
          <div class="sales-table-container" v-if="sales.length > 0">
            <table class="sales-table">
              <thead>
                <tr>
                  <th>Cliente</th>
                  <th>Productos</th>
                  <th>Cantidad</th>
                  <th>Total</th>
                  <th>Estado</th>
                  <th>Fecha</th>
                </tr>
              </thead>
              <tbody>
                <tr v-for="sale in filteredSales" :key="sale.id" class="sale-row">
                  <td>
                    <div class="customer-info">
                      <div class="customer-name">{{ sale.customerName }}</div>
                      <div class="customer-email">{{ sale.customerEmail }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="product-info">
                      <!-- Un solo producto -->
                      <div v-if="sale.items && sale.items.length === 1" class="single-product">
                        <div class="product-name">{{ sale.items[0].productName }}</div>
                        <div v-if="sale.items[0].selectedColor" class="product-color">
                          <span class="color-dot" :style="{ backgroundColor: getColorHex(sale.items[0].selectedColor) }"></span>
                          {{ sale.items[0].selectedColor }}
                        </div>
                      </div>

                      <!-- Múltiples productos -->
                      <div v-else-if="sale.items && sale.items.length > 1" class="multiple-products">
                        <div class="products-summary">
                          <span class="products-badge">{{ sale.items.length }} productos</span>
                        </div>
                        <details class="products-details">
                          <summary class="products-toggle">Ver detalles</summary>
                          <ul class="products-list">
                            <li v-for="(item, idx) in sale.items" :key="idx" class="product-item">
                              <span class="item-name">{{ item.productName }}</span>
                              <span class="item-quantity">x{{ item.quantity }}</span>
                              <span v-if="item.selectedColor" class="item-color">
                                <span class="color-dot-small" :style="{ backgroundColor: getColorHex(item.selectedColor) }"></span>
                                {{ item.selectedColor }}
                              </span>
                            </li>
                          </ul>
                        </details>
                      </div>

                      <!-- Fallback -->
                      <div v-else class="product-name">{{ sale.productName }}</div>
                    </div>
                  </td>
                  <td>
                    <div class="quantity-info">
                      <span class="quantity-badge">{{ sale.quantity }}</span>
                      <span v-if="sale.items && sale.items.length > 1" class="quantity-label">unidades totales</span>
                    </div>
                  </td>
                  <td>
                    <span class="amount">${{ sale.totalAmount.toLocaleString() }}</span>
                  </td>
                  <td>
                    <span :class="['status-badge', sale.status]">
                      {{ getSaleStatusText(sale.status) }}
                    </span>
                  </td>
                  <td>
                    <span class="date">{{ formatDate(sale.date) }}</span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <!-- Estado vacío -->
          <div v-else class="empty-state">
            <div class="empty-icon">📊</div>
            <h3>No hay ventas registradas</h3>
            <p>Las ventas aparecerán aquí cuando los clientes realicen compras</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal de Producto -->
    <div v-if="showProductForm" class="modal-overlay" @click="closeProductForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingProduct ? 'Editar Producto' : 'Nuevo Producto' }}</h3>
          <button class="modal-close" @click="closeProductForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveProduct">
            <div class="form-group">
              <label>Nombre del Producto *</label>
              <input v-model="productForm.name" type="text" class="form-input" required placeholder="Ej: iPhone 15 Pro" />
            </div>

            <div class="form-group">
              <label>Marca *</label>
              <select v-model="productForm.description" class="form-input" required>
                <option value="">Seleccionar marca</option>
                <option v-for="brand in brandOptions" :key="brand" :value="brand">
                  {{ brand }}
                </option>
              </select>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Precio *</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="productForm.price" type="number" class="form-input" step="1000" min="0" required placeholder="0" />
                </div>
              </div>
              <div class="form-group">
                <label>Precio Original (descuento)</label>
                <div class="price-input">
                  <span class="currency">$</span>
                  <input v-model.number="productForm.originalPrice" type="number" class="form-input" step="1000" min="0" placeholder="0" />
                </div>
              </div>
            </div>

            <div class="form-row">
              <div class="form-group">
                <label>Categoría *</label>
                <select v-model="productForm.category" class="form-input" required>
                  <option value="">Seleccionar categoría</option>
                  <option v-for="category in categories" :key="category.id" :value="category.id">
                    {{ category.name }}
                  </option>
                </select>
              </div>
              <div class="form-group">
                <label>Estado de Disponibilidad *</label>
                <select v-model="productForm.status" class="form-input" required>
                  <option value="available">✅ Disponible</option>
                  <option value="out-of-stock">❌ Sin Stock</option>
                  <option value="coming-soon">🔜 Próximamente</option>
                </select>
              </div>
            </div>

            <!-- Medida de la llanta -->
            <div class="form-group">
              <label>Medida de la Llanta *</label>
              <div class="tire-size-field">
                <input
                  v-model="productForm.tireMeasure"
                  type="text"
                  class="form-input"
                  required
                  placeholder="Ej: 205/55R16"
                />
                <div v-if="detectedRimLabel" class="tire-size-hint">
                  {{ detectedRimLabel }}
                </div>
              </div>
            </div>

            <!-- Subida de imagen -->
            <div class="form-group">
              <label>Imagen del Producto *</label>

              <!-- Campo URL: múltiples URLs con previews -->
              <div class="image-input-section">
                <div class="url-rows">
                  <div v-for="(url, i) in productForm.images" :key="i" class="url-row">
                    <input
                      type="url"
                      class="form-input"
                      :placeholder="`https://ejemplo.com/imagen-${i + 1}.jpg`"
                      :value="url"
                      @input="(e) => { productForm.images[i] = (e.target as HTMLInputElement).value; updateImagePreview(); }"
                    />
                    <button type="button" class="remove-url" @click="removeSingleImage(i)" aria-label="Eliminar URL">✕</button>
                  </div>
                </div>
                <div class="add-url-row">
                  <button type="button" class="btn btn-secondary" @click="addImageUrlRow">+ Agregar otra URL</button>
                </div>

                <div v-if="visibleProductImages.length > 0" class="images-preview-grid">
                  <div v-for="(image, idx) in visibleProductImages" :key="`${image}-${idx}`" class="image-preview-item">
                    <img :src="image" :alt="`Preview ${idx + 1}`" />
                    <button type="button" class="remove-single-image" @click.stop="removeSingleImageByVisibleIndex(idx)">✕</button>
                    <span class="image-index">{{ idx + 1 }}</span>
                    <div class="image-actions">
                      <button
                        type="button"
                        class="img-action-btn"
                        @click.stop="setPrimaryImageByVisibleIndex(idx)"
                        title="Hacer principal"
                      >Hacer principal</button>
                    </div>
                    <span v-if="idx === 0" class="principal-badge">Principal</span>
                  </div>
                </div>
              </div>
            </div>

            <!-- Información adicional -->
            <div v-if="productForm.originalPrice && productForm.originalPrice > productForm.price" class="discount-info">
              <span class="discount-badge">
                💰 Descuento: {{ Math.round(((productForm.originalPrice - productForm.price) / productForm.originalPrice) * 100) }}%
              </span>
            </div>

            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeProductForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="!isFormValid">
                {{ editingProduct ? 'Actualizar Producto' : 'Crear Producto' }}
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Categoría -->
    <div v-if="showCategoryForm" class="modal-overlay" @click="closeCategoryForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingCategory ? 'Editar Categoría' : 'Nueva Categoría' }}</h3>
          <button class="modal-close" @click="closeCategoryForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveCategory">
            <div class="form-group">
              <label>Nombre de la Categoría</label>
              <input v-model="categoryForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción</label>
              <textarea v-model="categoryForm.description" class="form-input" rows="3"></textarea>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeCategoryForm">Cancelar</button>
              <button type="submit" class="btn btn-primary">{{ editingCategory ? 'Actualizar' : 'Crear' }}</button>
            </div>
          </form>
        </div>
      </div>
    </div>

    <!-- Modal de Novedad -->
    <div v-if="showShowcaseForm" class="modal-overlay" @click="closeShowcaseForm">
      <div class="modal" @click.stop>
        <div class="modal-header">
          <h3>{{ editingShowcaseProduct ? 'Editar Novedad' : 'Nueva Novedad' }}</h3>
          <button class="modal-close" @click="closeShowcaseForm">✕</button>
        </div>
        <div class="modal-body">
          <form @submit.prevent="saveShowcaseProduct">
            <div class="form-group">
              <label>Nombre de la novedad *</label>
              <input v-model="showcaseForm.name" type="text" class="form-input" required />
            </div>
            <div class="form-group">
              <label>Descripción de la novedad*</label>
              <textarea v-model="showcaseForm.description" class="form-input" rows="3" required></textarea>
            </div>
            <!-- Campo de precio oculto - siempre será 0 para novedades -->
            <div class="form-group" style="display: none;">
              <label>Precio</label>
              <input v-model.number="showcaseForm.price" type="number" class="form-input" min="0" step="1000" />
            </div>
            <div class="form-group">
              <label>Imagen del Producto *</label>

              <div class="image-input-section">
                <div class="url-rows">
                  <div v-for="(url, i) in showcaseForm.images" :key="i" class="url-row">
                    <input
                      type="url"
                      class="form-input"
                      :placeholder="`https://ejemplo.com/imagen-${i + 1}.jpg`"
                      :value="url"
                      @input="(e) => { showcaseForm.images[i] = (e.target as HTMLInputElement).value; updateShowcaseImagePreview(); }"
                    />
                    <button type="button" class="remove-url" @click="removeShowcaseImageUrl(i)" aria-label="Eliminar URL">✕</button>
                  </div>
                </div>

                <div class="add-url-row">
                  <button type="button" class="btn btn-secondary" @click="addShowcaseImageUrlRow">+ Agregar otra URL</button>
                </div>

                <div v-if="visibleShowcaseImages.length > 0" class="images-preview-grid">
                  <div v-for="(image, idx) in visibleShowcaseImages" :key="`${image}-${idx}`" class="image-preview-item">
                    <img :src="image" :alt="`Preview ${idx + 1}`" />
                    <button type="button" class="remove-single-image" @click.stop="removeShowcaseImageByVisibleIndex(idx)">✕</button>
                    <span class="image-index">{{ idx + 1 }}</span>
                    <div class="image-actions">
                      <button
                        type="button"
                        class="img-action-btn"
                        @click.stop="setPrimaryShowcaseImageByVisibleIndex(idx)"
                        title="Hacer principal"
                      >Hacer principal</button>
                    </div>
                    <span v-if="idx === 0" class="principal-badge">Principal</span>
                  </div>
                </div>
              </div>
            </div>
            <div class="form-group">
              <label>Categoría *</label>
              <select v-model="showcaseForm.category" class="form-input" required>
                <option value="">Seleccionar categoría</option>
                <option v-for="category in categories" :key="category.id" :value="category.id">
                  {{ category.name }}
                </option>
              </select>
            </div>
            <div class="form-actions">
              <button type="button" class="btn btn-secondary" @click="closeShowcaseForm">Cancelar</button>
              <button type="submit" class="btn btn-primary" :disabled="isSavingShowcase || !showcaseFormValid">
                <span v-if="isSavingShowcase">Guardando...</span>
                <span v-else>{{ editingShowcaseProduct ? 'Actualizar' : 'Crear' }}</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue'
import { useProducts, type ShowcaseProduct } from '@/composables/useProducts'
import type { Product } from '@/types/ProductType'
import type { Category, CreateCategoryRequest } from '@/types/CategoryType'
import { paymentService } from '@/services/api/paymentService'
import type { Purchase, ProductPaymentItem } from '@/services/api/paymentService'

// Tipos
interface Sale {
  id: string
  productId: string
  productName: string
  customerName: string
  customerEmail: string
  quantity: number
  unitPrice: number
  totalAmount: number
  status: 'completed' | 'pending' | 'cancelled'
  date: Date
  selectedColor?: string
  items?: ProductPaymentItem[] // Items detallados de la compra
}

// Estado reactivo (persistente)
const ACTIVE_TAB_KEY = 'admin_active_tab'
const activeTab = ref<string>(localStorage.getItem(ACTIVE_TAB_KEY) || 'products')
const showProductForm = ref(false)
const showCategoryForm = ref(false)
const showShowcaseForm = ref(false)
const editingProduct = ref<Product | null>(null)
const editingCategory = ref<Category | null>(null)
const editingShowcaseProduct = ref<ShowcaseProduct | null>(null)
const imagePreview = ref('')

// Variables para búsqueda
const searchProducts = ref('')
const searchCategories = ref('')
const searchShowcase = ref('')
const searchSales = ref('')
// Filtros por categoría (vacío = todas)
const selectedProductCategory = ref<string>('')
const selectedShowcaseCategory = ref<string>('')

// Usar el composable de productos
const {
  regularProducts, // Productos regulares (sin showcase) - para mostrar en sección Productos
  showcaseProducts,
  categories,
  availableProducts,
  addProduct,
  updateProduct,
  deleteProduct,
  loadShowcaseProducts,
  addShowcaseProduct,
  updateShowcaseProduct,
  deleteShowcaseProduct,
  getCategoryById,
  loadCategories,
  loadProducts,
  addCategory,
  updateCategory,
  deleteCategory
} = useProducts()

// Alias para compatibilidad: usar regularProducts en la vista de productos
const products = regularProducts

// Cargar categorías y productos desde el backend al montar el componente
onMounted(async () => {
  console.log('🔄 Cargando categorías y productos al montar el componente...')
  await loadCategories()
  await loadProducts()
  await loadShowcaseProducts()
  await loadPurchases()
  console.log('✅ Categorías cargadas:', categories.value)
  console.log('✅ Productos cargados:', products.value)
  console.log('✅ Productos showcase cargados:', showcaseProducts.value)
})

// Watcher para debug: observar cambios en categorías
watch(categories, (newCategories) => {
  console.log('🔔 [Watch] Categorías cambiaron:', newCategories.length, newCategories)
}, { deep: true })

// Sales / Purchases data
const sales = ref<Sale[]>([])
const isLoadingSales = ref(false)
const salesError = ref('')

// Transform Purchase to Sale format
const transformPurchaseToSale = (purchase: Purchase): Sale => {
  const firstItem = purchase.items?.[0]
  const itemCount = purchase.items?.length || 0
  const totalQuantity = purchase.items?.reduce((sum, item) => sum + item.quantity, 0) || 0

  // Generar nombre descriptivo del producto
  let productName = 'Múltiples productos'
  if (itemCount === 1) {
    productName = firstItem?.productName || 'Producto desconocido'
  } else if (itemCount > 1) {
    productName = `${itemCount} productos diferentes`
  }

  return {
    id: purchase.id.toString(),
    productId: '', // No longer available from API
    productName: productName,
    customerName: purchase.buyerName,
    customerEmail: purchase.buyerEmail,
    quantity: totalQuantity, // Suma total de cantidades
    unitPrice: firstItem?.unitPrice || 0,
    totalAmount: purchase.amount, // Use amount directly from API
    status: mapPurchaseStatus(purchase.status),
    date: new Date(purchase.createdAt),
    selectedColor: firstItem?.selectedColor,
    // Información adicional para mostrar detalles
    items: purchase.items
  }
}

// Map purchase status to sale status
const mapPurchaseStatus = (status: string): 'completed' | 'pending' | 'cancelled' => {
  const upperStatus = status.toUpperCase()
  if (upperStatus === 'COMPLETED' || upperStatus === 'APPROVED') return 'completed'
  if (upperStatus === 'CANCELLED' || upperStatus === 'REJECTED') return 'cancelled'
  return 'pending'
}

// Load purchases from API
const loadPurchases = async () => {
  isLoadingSales.value = true
  salesError.value = ''
  try {
    console.log('📦 Cargando compras desde API...')
    const response = await paymentService.getAllPurchases()
    console.log('📦 Respuesta completa de compras:', response)

    if (response.success && response.data) {
      console.log('📦 Purchases raw data:', response.data.purchases)
      sales.value = response.data.purchases.map((purchase) => {
        console.log('📦 Transformando purchase:', {
          id: purchase.id,
          amount: purchase.amount,
          items: purchase.items
        })
        return transformPurchaseToSale(purchase)
      })
      console.log('✅ Compras transformadas:', sales.value)
    } else {
      salesError.value = 'No se pudieron cargar las compras'
      console.error('❌ Error en respuesta de compras:', response)
    }
  } catch (error) {
    salesError.value = 'Error al cargar las compras'
    console.error('❌ Error cargando compras:', error)
  } finally {
    isLoadingSales.value = false
  }
}

// Formularios
const productForm = ref({
  name: '',
  description: '',
  price: 0,
  originalPrice: 0,
  images: [] as string[],
  category: '',
  status: 'available' as 'available' | 'out-of-stock' | 'coming-soon',
  colors: [] as string[],
  tireMeasure: ''
})

const visibleProductImages = computed(() =>
  productForm.value.images.filter((image) => image.trim().length > 0)
)

const brandOptions = [
  'Michelin',
  'Goodyear',
  'Pirelli',
  'Bridgestone',
  'Continental',
  'Hankook',
  'Yokohama',
  'Toyo',
  'Kumho',
  'Nexen',
  'Sailun',
  'Triangle'
]

const extractRimLabel = (measure: string) => {
  const normalizedMeasure = measure.toUpperCase().replace(/\s+/g, '')
  const match = normalizedMeasure.match(/R(\d{2,3})/)
  if (!match) return ''
  return `Rin ${match[1]}`
}

const detectedRimLabel = computed(() => extractRimLabel(productForm.value.tireMeasure))

const getProductBrand = (product: Product) => product.description || 'Marca no especificada'

const getProductMeasure = (product: Product) => product.colors?.[0] || 'Medida no especificada'

const getProductRim = (product: Product) => {
  const rimLabel = extractRimLabel(getProductMeasure(product))
  return rimLabel || '--'
}

const getDiscountPercent = (product: Product) => {
  if (!product.originalPrice || product.originalPrice <= product.price) return 0
  return Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
}

const categoryForm = ref<CreateCategoryRequest>({
  name: '',
  description: ''
})

const showcaseForm = ref({
  name: '',
  description: '',
  price: 0,
  images: [''] as string[],
  category: ''
})

const visibleShowcaseImages = computed(() =>
  showcaseForm.value.images.filter((image) => image.trim().length > 0)
)

// Estado de guardado de showcase (evita clicks múltiples y sensación de "bloqueo")
const isSavingShowcase = ref(false)

// Validación rápida del formulario de novedad (precio no requerido - siempre será 0)
const showcaseFormValid = computed(() => {
  return (
    showcaseForm.value.name.trim().length > 0 &&
    showcaseForm.value.description.trim().length > 0 &&
    showcaseForm.value.images.some((image) => image.trim().length > 0) &&
    showcaseForm.value.category.trim().length > 0
  )
})

// Pestañas
const tabs = [
  { id: 'products', name: 'Productos', icon: '📦' },
  { id: 'categories', name: 'Categorías', icon: '🏷️' },
  { id: 'showcase', name: 'Novedades', icon: '✨' },
  { id: 'sales', name: 'Resumen de Compras', icon: '📊' }
]

// Computed
const availableProductsCount = computed(() =>
  availableProducts.value.length
)

const totalValue = computed(() =>
  sales.value
    .filter(sale => sale.status === 'completed')
    .reduce((sum, sale) => sum + sale.totalAmount, 0)
)

// Computed para estadísticas de ventas
const completedSales = computed(() =>
  sales.value.filter(s => s.status === 'completed')
)

const totalRevenue = computed(() =>
  completedSales.value.reduce((sum, s) => sum + s.totalAmount, 0)
)

const pendingSales = computed(() =>
  sales.value.filter(s => s.status === 'pending').length
)

const totalSalesCount = computed(() => sales.value.length)

// Computed properties para búsqueda y filtrado
const filteredProducts = computed(() => {
  let items = products.value

  // Filtrar por búsqueda de texto
  if (searchProducts.value.trim()) {
    const searchLower = searchProducts.value.toLowerCase().trim()
    items = items.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    )
  }

  // Filtrar por categoría seleccionada (si aplica)
  if (selectedProductCategory.value && selectedProductCategory.value.trim() !== '') {
    items = items.filter(p => String(p.category) === String(selectedProductCategory.value))
  }

  return items
})

const filteredCategories = computed(() => {
  if (!searchCategories.value.trim()) {
    return categories.value
  }
  const searchLower = searchCategories.value.toLowerCase().trim()
  return categories.value.filter(category =>
    category.name.toLowerCase().includes(searchLower) ||
    category.description?.toLowerCase().includes(searchLower)
  )
})

const filteredShowcase = computed(() => {
  let items = showcaseProducts.value

  // Filtrar por búsqueda de texto
  if (searchShowcase.value.trim()) {
    const searchLower = searchShowcase.value.toLowerCase().trim()
    items = items.filter(product =>
      product.name.toLowerCase().includes(searchLower) ||
      product.description?.toLowerCase().includes(searchLower)
    )
  }

  // Filtrar por categoría seleccionada
  if (selectedShowcaseCategory.value && selectedShowcaseCategory.value.trim() !== '') {
    items = items.filter(p => String(p.category) === String(selectedShowcaseCategory.value))
  }

  return items
})

const filteredSales = computed(() => {
  if (!searchSales.value.trim()) {
    return sales.value
  }
  const searchLower = searchSales.value.toLowerCase().trim()
  return sales.value.filter(sale =>
    sale.customerName.toLowerCase().includes(searchLower) ||
    sale.customerEmail.toLowerCase().includes(searchLower) ||
    sale.productName.toLowerCase().includes(searchLower) ||
    // Buscar también en los items individuales
    (sale.items && sale.items.some(item =>
      item.productName.toLowerCase().includes(searchLower)
    ))
  )
})

// Helper para convertir nombres de colores a hex
const getColorHex = (colorName: string): string => {
  const colorMap: Record<string, string> = {
    'naranja cósmico': '#ff5e00',
    'naranja cosmico': '#ff5e00',
    'azul profundo': '#003d5c',
    'plata': '#c0c0c0',
    'silver': '#c0c0c0',
    'azul': '#1976d2',
    'blue': '#1976d2',
    'negro': '#000000',
    'black': '#000000',
    'blanco': '#ffffff',
    'white': '#ffffff',
    'azul neblina': '#a8c7dd',
    'dorado claro': '#f7e7a1',
    'azul cielo': '#87ceeb',
    'rosa': '#ff69b4',
    'pink': '#ff69b4',
    'amarillo': '#ffeb3b',
    'yellow': '#ffeb3b',
    'verde': '#4caf50',
    'green': '#4caf50',
    'púrpura': '#9c27b0',
    'purpura': '#9c27b0',
    'purple': '#9c27b0',
    'morado': '#9c27b0',
    'oro': '#ffd700',
    'gold': '#ffd700'
  }

  const normalized = colorName.toLowerCase().trim()
  return colorMap[normalized] || '#9e9e9e' // Gris por defecto
}

// Cambio de pestaña con persistencia
const selectTab = (tabId: string) => {
  activeTab.value = tabId
  try {
    localStorage.setItem(ACTIVE_TAB_KEY, tabId)
  } catch (e) {
    console.warn('No se pudo persistir la pestaña activa', e)
  }
}

// Métodos
const getStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'available': 'Disponible',
    'out-of-stock': 'Sin Stock',
    'coming-soon': 'Próximamente'
  }
  return statusMap[status] || status
}

const getSaleStatusText = (status: string) => {
  const statusMap: Record<string, string> = {
    'completed': 'Completada',
    'pending': 'Pendiente',
    'cancelled': 'Cancelada'
  }
  return statusMap[status] || status
}

const formatDate = (date: Date) => {
  return date.toLocaleDateString('es-CO', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const getProductsInCategory = (categoryId: string) => {
  return products.value.filter(p => p.category === categoryId).length
}

const editProduct = (product: Product) => {
  editingProduct.value = product
  productForm.value = {
    name: product.name,
    description: product.description,
    price: product.price,
    originalPrice: product.originalPrice || 0,
    images: product.images ? [...product.images] : [],
    category: product.category,
    status: product.status,
    colors: product.colors ? [...product.colors] : [],
    tireMeasure: product.colors && product.colors.length > 0 ? product.colors[0] : ''
  }
  productForm.value.images = product.images && product.images.length > 0 ? [...product.images] : ['']
  imagePreview.value = visibleProductImages.value[0] || ''
  showProductForm.value = true
}

const openProductForm = () => {
  if (productForm.value.images.length === 0) {
    productForm.value.images = ['']
  }
  if (!productForm.value.tireMeasure) {
    productForm.value.tireMeasure = ''
  }
  showProductForm.value = true
}

const editCategory = (category: Category) => {
  editingCategory.value = category
  categoryForm.value = {
    name: category.name,
    description: category.description || '' // Manejar descripción opcional
  }
  showCategoryForm.value = true
}

const deleteProductConfirm = (id: string) => {
  if (confirm('¿Estás seguro de eliminar este producto?')) {
    deleteProduct(id)
  }
}

// Función wrapper para eliminar categoría con confirmación
const handleDeleteCategory = async (id: string) => {
  const productsCount = getProductsInCategory(id)

  let confirmMessage = '¿Estás seguro de eliminar esta categoría?'

  if (productsCount > 0) {
    confirmMessage = `⚠️ ADVERTENCIA: Esta categoría tiene ${productsCount} producto${productsCount > 1 ? 's' : ''} asociado${productsCount > 1 ? 's' : ''}.\n\n` +
      `Si eliminas esta categoría, ${productsCount > 1 ? 'estos productos' : 'este producto'} quedará${productsCount > 1 ? 'n' : ''} sin categoría asignada.\n\n` +
      `¿Estás seguro de que deseas continuar?`
  }

  if (confirm(confirmMessage)) {
    await deleteCategory(Number(id))
  }
}

// Funciones para showcase products
const editShowcaseProduct = (product: ShowcaseProduct) => {
  editingShowcaseProduct.value = product
  showcaseForm.value = {
    name: product.name,
    description: product.description,
    price: 5000, // Siempre 0 para novedades
    images: [product.image],
    category: product.category
  }
  imagePreview.value = product.image
  showShowcaseForm.value = true
}

const deleteShowcaseConfirm = async (id: string) => {
  if (confirm('¿Estás seguro de eliminar esta novedad?')) {
    try {
      await deleteShowcaseProduct(id)
      console.log('✅ Producto showcase eliminado')
    } catch (error) {
      console.error('❌ Error eliminando producto showcase:', error)
      alert('Error al eliminar la novedad')
    }
  }
}

const saveShowcaseProduct = async () => {
  if (isSavingShowcase.value) return
  if (!showcaseFormValid.value) {
    alert('Por favor completa todos los campos requeridos de la novedad.')
    return
  }
  try {
    isSavingShowcase.value = true

    // Asegurar que el precio siempre sea 0 para novedades
    showcaseForm.value.price = 5000

    const cleanedImages = showcaseForm.value.images.map((image) => image.trim()).filter((image) => image.length > 0)
    if (cleanedImages.length === 0) {
      alert('Agrega al menos una URL de imagen para la novedad.')
      return
    }

    if (editingShowcaseProduct.value) {
      // Actualizar novedad existente - mostrar confirmación
      const confirmMessage = `¿Estás seguro de que deseas actualizar la novedad "${editingShowcaseProduct.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
      if (!confirm(confirmMessage)) {
        isSavingShowcase.value = false
        return
      }
      await updateShowcaseProduct(editingShowcaseProduct.value.id, {
        ...showcaseForm.value,
        image: cleanedImages[0]
      })
      console.log('✅ Producto showcase actualizado')
    } else {
      await addShowcaseProduct({
        ...showcaseForm.value,
        image: cleanedImages[0]
      })
      console.log('✅ Producto showcase agregado')
    }
    closeShowcaseForm()
  } catch (e: unknown) {
    console.error('❌ Error guardando producto showcase:', e)
    const msg = typeof e === 'object' && e && 'message' in e ? (e as { message?: string }).message : undefined
    alert(msg || 'Ocurrió un problema al guardar la novedad.')
  } finally {
    isSavingShowcase.value = false
  }
}

const closeShowcaseForm = () => {
  showShowcaseForm.value = false
  editingShowcaseProduct.value = null
  imagePreview.value = ''
  showcaseForm.value = {
    name: '',
    description: '',
    price: 0,
    images: [''],
    category: ''
  }
}

// Computed para validación de formulario
const isFormValid = computed(() => {
  return productForm.value.name.trim() !== '' &&
         productForm.value.price > 0 &&
         productForm.value.category !== '' &&
         productForm.value.description.trim() !== '' &&
         productForm.value.tireMeasure.trim() !== ''
})

const updateImagePreview = () => {
  imagePreview.value = visibleProductImages.value[0] || ''
}

// removeImage eliminado (uso sustituido por removeSingleImage o reinicio manual)

const removeSingleImage = (index: number) => {
  productForm.value.images.splice(index, 1)
  if (productForm.value.images.length === 0) {
    productForm.value.images = ['']
  }
  imagePreview.value = visibleProductImages.value[0] || ''
}

const addImageUrlRow = () => {
  productForm.value.images.push('')
}

const getActualImageIndexFromVisibleIndex = (visibleIndex: number) => {
  let currentVisibleIndex = -1

  for (let actualIndex = 0; actualIndex < productForm.value.images.length; actualIndex++) {
    if (!productForm.value.images[actualIndex].trim()) continue
    currentVisibleIndex += 1
    if (currentVisibleIndex === visibleIndex) {
      return actualIndex
    }
  }

  return -1
}

const removeSingleImageByVisibleIndex = (visibleIndex: number) => {
  const actualIndex = getActualImageIndexFromVisibleIndex(visibleIndex)
  if (actualIndex === -1) return
  removeSingleImage(actualIndex)
}

const setPrimaryImageByVisibleIndex = (visibleIndex: number) => {
  const actualIndex = getActualImageIndexFromVisibleIndex(visibleIndex)
  if (actualIndex <= 0) return
  const imgs = productForm.value.images
  const [img] = imgs.splice(actualIndex, 1)
  imgs.unshift(img)
  imagePreview.value = visibleProductImages.value[0] || ''
}

// setAsCover removido (no se usa actualmente)

const updateShowcaseImagePreview = () => {
  imagePreview.value = visibleShowcaseImages.value[0] || ''
}

const addShowcaseImageUrlRow = () => {
  showcaseForm.value.images.push('')
}

const removeShowcaseImageUrl = (index: number) => {
  showcaseForm.value.images.splice(index, 1)
  if (showcaseForm.value.images.length === 0) {
    showcaseForm.value.images = ['']
  }
  updateShowcaseImagePreview()
}

const getActualShowcaseImageIndexFromVisibleIndex = (visibleIndex: number) => {
  let currentVisibleIndex = -1

  for (let actualIndex = 0; actualIndex < showcaseForm.value.images.length; actualIndex++) {
    if (!showcaseForm.value.images[actualIndex].trim()) continue
    currentVisibleIndex += 1
    if (currentVisibleIndex === visibleIndex) {
      return actualIndex
    }
  }

  return -1
}

const removeShowcaseImageByVisibleIndex = (visibleIndex: number) => {
  const actualIndex = getActualShowcaseImageIndexFromVisibleIndex(visibleIndex)
  if (actualIndex === -1) return
  removeShowcaseImageUrl(actualIndex)
}

const setPrimaryShowcaseImageByVisibleIndex = (visibleIndex: number) => {
  const actualIndex = getActualShowcaseImageIndexFromVisibleIndex(visibleIndex)
  if (actualIndex <= 0) return
  const imgs = showcaseForm.value.images
  const [img] = imgs.splice(actualIndex, 1)
  imgs.unshift(img)
  updateShowcaseImagePreview()
}

const saveProduct = () => {
  const cleanedImages = productForm.value.images.map((image) => image.trim()).filter((image) => image.length > 0)
  const cleanedMeasure = productForm.value.tireMeasure.trim()
  const payload = {
    name: productForm.value.name.trim(),
    description: productForm.value.description.trim(),
    price: productForm.value.price,
    originalPrice: productForm.value.originalPrice,
    images: cleanedImages,
    category: productForm.value.category,
    status: productForm.value.status,
    colors: cleanedMeasure ? [cleanedMeasure] : []
  }

  if (editingProduct.value) {
    // Actualizar producto existente - mostrar confirmación
    const confirmMessage = `¿Estás seguro de que deseas actualizar el producto "${editingProduct.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
    if (!confirm(confirmMessage)) {
      return
    }
    updateProduct(editingProduct.value.id, payload)
  } else {
    // Crear nuevo producto
    addProduct(payload)
  }
  closeProductForm()
}

const saveCategory = async () => {
  if (editingCategory.value) {
    // Actualizar categoría existente - mostrar confirmación
    const confirmMessage = `¿Estás seguro de que deseas actualizar la categoría "${editingCategory.value.name}"?\n\nSe actualizarán todos los cambios realizados.`
    if (!confirm(confirmMessage)) {
      return
    }
    await updateCategory(Number(editingCategory.value.id), categoryForm.value)
  } else {
    // Crear nueva categoría
    await addCategory(categoryForm.value)
  }
  closeCategoryForm()
}

const closeProductForm = () => {
  showProductForm.value = false
  editingProduct.value = null
  imagePreview.value = ''
  productForm.value = {
    name: '',
    description: '',
    price: 0,
    originalPrice: 0,
    images: [''],
    category: '',
    status: 'available',
    colors: [],
    tireMeasure: ''
  }
}

const closeCategoryForm = () => {
  showCategoryForm.value = false
  editingCategory.value = null
  categoryForm.value = {
    name: '',
    description: ''
  }
}
</script>

<style scoped>
.admin-dashboard {
  min-height: 100vh;
  --brand-primary: #dc2626;
  --brand-secondary: #991b1b;
  --brand-accent: #ef4444;
  --brand-success: #dc2626;
  --brand-danger: #b91c1c;
  --brand-primary-contrast: #ffffff;
  --brand-accent-alt: rgba(255, 255, 255, 0.72);
  --brand-bg-start: #050505;
  --brand-bg-end: #111111;
  --brand-surface: #171717;
  --brand-border: rgba(220, 38, 38, 0.18);
  --brand-gradient: linear-gradient(180deg, #050505 0%, #111111 100%);
  background: var(--brand-gradient);
  padding: 20px;
  padding-top: 4rem;
  color: var(--brand-primary-contrast);
}

.dashboard-header {
  text-align: center;
  margin-bottom: 40px;
  padding: 30px;
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(10, 10, 10, 0.98) 100%);
  border-radius: 20px;
  box-shadow: 0 10px 30px rgba(220, 38, 38, 0.18);
  border: 1px solid var(--brand-border);
}

.dashboard-title {
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 3rem 10px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 15px;
}

.dashboard-title .icon {
  font-size: 3rem;
}

.dashboard-title .highlight {
  color: var(--brand-primary);
}

.dashboard-subtitle {
  font-size: 1.1rem;
  color: rgba(255, 255, 255, 0.72);
  margin: 0;
}

.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 40px;
}

.stat-card {
  background: linear-gradient(180deg, rgba(26, 26, 26, 0.98) 0%, rgba(15, 15, 15, 0.98) 100%);
  border-radius: 16px;
  padding: 25px;
  display: flex;
  align-items: center;
  gap: 20px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.42);
  border: 1px solid var(--brand-border);
  transition: all 0.3s ease;
}

.stat-card:hover {
  transform: translateY(-2px);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.18);
  border-color: rgba(220, 38, 38, 0.32);
}

.stat-icon {
  font-size: 2.5rem;
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  border-radius: 50%;
  width: 70px;
  height: 70px;
  display: flex;
  align-items: center;
  justify-content: center;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  line-height: 1;
}

.stat-label {
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  font-weight: 500;
}

.tabs-container {
  margin-bottom: 30px;
}

.tabs {
  display: flex;
  gap: 5px;
  background: var(--brand-surface);
  padding: 5px;
  border-radius: 12px;
  width: fit-content;
  border: 1px solid var(--brand-border);
}

.tab {
  background: none;
  border: none;
  padding: 12px 24px;
  border-radius: 8px;
  font-weight: 600;
  color: rgba(255, 255, 255, 0.72);
  cursor: pointer;
  transition: all 0.3s ease;
  display: flex;
  align-items: center;
  gap: 8px;
}

.tab.active {
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: var(--brand-primary-contrast);
  box-shadow: 0 2px 8px rgba(220, 38, 38, 0.45);
}

.tab:hover:not(.active) {
  background: rgba(220, 38, 38, 0.12);
  color: var(--brand-primary-contrast);
}

.content-section {
  background: linear-gradient(180deg, rgba(23, 23, 23, 0.98) 0%, rgba(17, 17, 17, 0.98) 100%);
  border-radius: 20px;
  padding: 30px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.42);
  border: 1px solid var(--brand-border);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 30px;
  padding-bottom: 20px;
  border-bottom: 2px solid rgba(220, 38, 38, 0.16);
}

.section-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0;
}

/* Barras de búsqueda en Admin */
.search-bar {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 12px;
  margin: 0 0 2rem;
  position: relative;
}

.search-input-wrapper {
  position: relative;
  width: 100%;
  max-width: 600px;
  flex: 1 1 auto;
}

.category-filter-wrapper {
  min-width: 180px;
  max-width: 280px;
}

.category-select {
  width: 100%;
  padding: 12px 16px;
  border-radius: 8px;
  border: 2px solid var(--brand-border);
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
  font-size: 0.95rem;
}

.search-icon {
  position: absolute;
  left: 14px;
  top: 50%;
  transform: translateY(-50%);
  color: rgba(255, 255, 255, 0.6);
  pointer-events: none;
  z-index: 1;
}

.search-input {
  width: 100%;
  padding: 0.875rem 3.5rem 0.875rem 2.75rem;
  border-radius: 999px;
  border: 1px solid var(--brand-border);
  background: var(--brand-bg-end);
  font-size: 1rem;
  color: var(--brand-primary-contrast);
  box-shadow: 0 4px 12px rgba(0,0,0,0.2);
  transition: all 0.3s ease;
  outline: none;
}

.search-input:focus {
  background: var(--brand-surface);
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
}

.search-input:hover {
  border-color: rgba(220, 38, 38, 0.28);
}

.search-input::placeholder {
  color: rgba(255, 255, 255, 0.45);
  opacity: 0.7;
}

.search-clear {
  position: absolute;
  right: 12px;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(220, 38, 38, 0.12);
  border: none;
  cursor: pointer;
  font-size: 0.9rem;
  font-weight: 600;
  color: var(--brand-primary);
  width: 28px;
  height: 28px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.2s ease;
}

.search-clear:hover {
  background: rgba(220, 38, 38, 0.2);
  transform: translateY(-50%) scale(1.05);
}

.tire-size-field {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.tire-size-hint {
  font-size: 0.85rem;
  color: #fca5a5;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.22);
  padding: 8px 12px;
  border-radius: 10px;
  font-weight: 600;
  width: fit-content;
}

.products-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: 18px;
}

.product-card {
  background: linear-gradient(180deg, rgba(17, 17, 17, 0.98) 0%, rgba(12, 12, 12, 0.98) 100%);
  border-radius: 20px;
  border: 1px solid rgba(255, 255, 255, 0.12);
  transition: all 0.3s ease;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  min-height: 100%;
}

.product-card:hover {
  border-color: rgba(220, 38, 38, 0.34);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.18);
  transform: translateY(-2px);
}

.product-image {
  width: 100%;
  aspect-ratio: 1 / 0.88;
  overflow: hidden;
  background: #000000;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
}

.product-image img {
  width: 100%;
  height: 100%;
  background: #000000;
}

.no-image {
  font-size: 3rem;
  color: var(--brand-accent-alt);
}

.status-badge,
.discount-badge {
  position: absolute;
  border-radius: 999px;
  font-size: 0.72rem;
  font-weight: 700;
  padding: 6px 10px;
  z-index: 1;
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
  background: rgba(204, 25, 25, 0.9);
  color: #fff;
}

.product-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 8px;
}

.product-category {
  margin: 0;
  font-size: 0.72rem;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: #dc2626;
  font-weight: 700;
}

.product-brand {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  line-height: 1.4;
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
  min-height: 1.8em;
}

.tech-row {
  display: grid;
  grid-template-columns: 1fr auto 1fr;
  gap: 12px;
  align-items: center;
  padding: 10px 0 8px;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.tech-item {
  display: flex;
  flex-direction: column;
  gap: 3px;
}

.tech-label {
  font-size: 0.68rem;
  font-weight: 800;
  color: rgba(255, 255, 255, 0.46);
  text-transform: uppercase;
  letter-spacing: 0.08em;
}

.tech-value {
  font-size: 0.98rem;
  font-weight: 800;
  color: var(--brand-primary-contrast);
}

.tech-rim {
  display: inline-flex;
  align-items: center;
  gap: 6px;
}

.tech-divider {
  width: 1px;
  height: 36px;
  background: rgba(255, 255, 255, 0.12);
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
  font-size: 1.3rem;
  font-weight: 700;
  color: var(--brand-success);
}

.original-price {
  color: rgba(255, 255, 255, 0.52);
  text-decoration: line-through;
  font-size: 0.9rem;
}

.status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.status.available {
  background: rgba(34, 197, 94, 0.14);
  color: #bbf7d0;
  border: 1px solid rgba(34, 197, 94, 0.28);
}

.status.out-of-stock {
  background: rgba(127, 29, 29, 0.26);
  color: #fff1f2;
  border: 1px solid rgba(220, 38, 38, 0.18);
}

.status.coming-soon {
  background: rgba(234, 179, 8, 0.14);
  color: #fef08a;
  border: 1px solid rgba(234, 179, 8, 0.28);
}

.product-actions {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
}

.product-actions .btn {
  width: 100%;
  justify-content: center;
}

.product-info {
  padding: 18px;
  display: flex;
  flex-direction: column;
  flex: 1;
  background: #050505;
}

.categories-list {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.category-item {
  background: var(--brand-bg-end);
  border-radius: 12px;
  padding: 20px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
}

.category-item:hover {
  border-color: var(--brand-success);
  transform: translateY(-1px);
}

.category-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 5px;
}

.category-info p {
  color: var(--brand-accent-alt);
  margin: 0 0 5px;
  font-size: 0.9rem;
}

.category-count {
  font-size: 0.8rem;
  color: var(--brand-success);
  font-weight: 600;
}

.category-actions {
  display: flex;
  gap: 10px;
}

.empty-state {
  text-align: center;
  padding: 60px 20px;
  color: rgba(255, 255, 255, 0.72);
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.empty-state h3 {
  font-size: 1.5rem;
  margin: 0 0 10px;
  color: var(--brand-primary-contrast);
}

.empty-state p {
  margin: 0 0 30px;
  font-size: 1rem;
}

/* Loading and Error States */
.loading-state, .error-state {
  text-align: center;
  padding: 60px 20px;
}

.loading-state p, .error-state p {
  margin-top: 20px;
  font-size: 1rem;
  color: var(--brand-accent-alt);
}

.error-state {
  color: #f44336;
}

.error-icon {
  font-size: 4rem;
  margin-bottom: 20px;
}

.spinner {
  border: 4px solid rgba(0, 0, 0, 0.1);
  border-left-color: var(--brand-primary);
  border-radius: 50%;
  width: 50px;
  height: 50px;
  animation: spin 1s linear infinite;
  margin: 0 auto;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

/* Product info in sales table */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-name {
  font-weight: 500;
}

.product-color {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.68);
}

/* === SELECTOR DE COLORES === */
.colors-selector {
  margin-top: 10px;
}

.colors-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(80px, 1fr));
  gap: 12px;
  margin-bottom: 15px;
}

.color-option {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 6px;
  padding: 10px;
  border: 2px solid transparent;
  border-radius: 12px;
  cursor: pointer;
  transition: all 0.3s ease;
  background: rgba(255, 255, 255, 0.05);
}

.color-option:hover {
  border-color: rgba(220, 38, 38, 0.28);
  background: rgba(220, 38, 38, 0.08);
}

.color-option.selected {
  border-color: #dc2626;
  background: rgba(220, 38, 38, 0.18);
  transform: scale(1.05);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.22);
}

.color-option.selected .color-circle {
  border-color: #dc2626;
  border-width: 3px;
  box-shadow: 0 0 0 2px rgba(220, 38, 38, 0.28), 0 2px 8px rgba(0, 0, 0, 0.3);
}

.color-option.selected .color-name {
  color: #fecaca;
  font-weight: 700;
}

.color-circle {
  width: 30px;
  height: 30px;
  border-radius: 50%;
  border: 2px solid rgba(255, 255, 255, 0.3);
  box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  font-size: 18px;
  font-weight: bold;
  color: #ffffff;
  text-shadow: 0 0 3px rgba(0, 0, 0, 0.8), 0 1px 2px rgba(0, 0, 0, 0.5);
  position: absolute;
  animation: checkPop 0.3s ease;
}

@keyframes checkPop {
  0% {
    transform: scale(0);
  }
  50% {
    transform: scale(1.2);
  }
  100% {
    transform: scale(1);
  }
}

.color-name {
  font-size: 0.75rem;
  font-weight: 500;
  color: var(--brand-primary-contrast);
  text-align: center;
  line-height: 1.2;
}

.selected-colors {
  padding: 10px 12px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.24);
  border-radius: 8px;
  margin-top: 10px;
}

.selected-label {
  font-weight: 600;
  color: #fca5a5;
  font-size: 0.85rem;
}

.selected-list {
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

/* Botones */
.btn {
  padding: 10px 20px;
  border-radius: 8px;
  border: none;
  font-weight: 600;
  cursor: pointer;
  transition: all 0.3s ease;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  text-decoration: none;
}

.btn-primary {
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: var(--brand-primary-contrast);
  box-shadow: 0 2px 10px rgba(220, 38, 38, 0.34);
}

.btn-primary:hover {
  transform: translateY(-1px);
  box-shadow: 0 4px 15px rgba(220, 38, 38, 0.42);
  background: linear-gradient(135deg, #b91c1c 0%, #7f1d1d 100%);
}

.btn-secondary {
  background: rgba(255, 255, 255, 0.08);
  color: var(--brand-primary-contrast);
  border: 1px solid rgba(220, 38, 38, 0.14);
}

.btn-secondary:hover {
  background: rgba(220, 38, 38, 0.1);
}

.btn-danger {
  background: rgba(220, 38, 38, 0.14);
  color: #fecaca;
  border: 1px solid rgba(220, 38, 38, 0.26);
}

.btn-danger:hover {
  background: rgba(220, 38, 38, 0.22);
}

.btn-sm {
  padding: 6px 12px;
  font-size: 0.8rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.8);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 1000;
  padding: 20px;
}

.modal {
  background: var(--brand-surface);
  border-radius: 20px;
  width: 100%;
  max-width: 600px;
  max-height: 90vh;
  overflow-y: auto;
  box-shadow: 0 20px 40px rgba(0, 0, 0, 0.6);
  border: 1px solid var(--brand-border);
}

.modal-header {
  padding: 30px 30px 0;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.modal-header h3 {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--brand-primary-contrast);
  margin: 0;
}

.modal-close {
  background: none;
  border: none;
  font-size: 1.5rem;
  cursor: pointer;
  color: var(--brand-accent-alt);
  padding: 5px;
  border-radius: 50%;
  width: 35px;
  height: 35px;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: all 0.3s ease;
}

.modal-close:hover {
  background: var(--brand-border);
  color: var(--brand-primary-contrast);
}

.modal-body {
  padding: 30px;
}

/* Formularios */
.form-group {
  margin-bottom: 20px;
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 20px;
}

.form-group label {
  display: block;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin-bottom: 8px;
}

.form-input {
  width: 100%;
  padding: 12px 16px;
  border: 2px solid var(--brand-border);
  border-radius: 8px;
  font-size: 1rem;
  transition: border-color 0.3s ease;
  box-sizing: border-box;
  background: var(--brand-bg-end);
  color: var(--brand-primary-contrast);
}

.form-input:focus {
  outline: none;
  border-color: var(--brand-primary);
  box-shadow: 0 0 0 3px rgba(220, 38, 38, 0.18);
}

.form-input::placeholder {
  color: var(--brand-accent-alt);
}

.price-input {
  position: relative;
  display: flex;
  align-items: center;
}

.currency {
  position: absolute;
  left: 16px;
  font-weight: 600;
  color: var(--brand-accent-alt);
  z-index: 1;
}

.price-input .form-input {
  padding-left: 35px;
}

/* Subida de imágenes */
.image-upload-area {
  margin-bottom: 15px;
}

.image-preview {
  position: relative;
  width: 200px;
  height: 200px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--brand-border);
  margin-bottom: 15px;
}

.image-preview img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: 8px;
  right: 8px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 30px;
  height: 30px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 16px;
  transition: background 0.3s ease;
}

.remove-image:hover {
  background: rgba(127, 29, 29, 1);
}

/* Estilos para vista previa de múltiples imágenes */
.images-preview-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(120px, 1fr));
  gap: 15px;
  max-height: 300px;
  overflow-y: auto;
  padding: 10px;
}

.image-preview-item {
  position: relative;
  width: 120px;
  height: 120px;
  border-radius: 12px;
  overflow: hidden;
  border: 2px solid var(--brand-border);
  background: var(--brand-bg-end);
}

.url-rows {
  display: flex;
  flex-direction: column;
  gap: 10px;
  margin-bottom: 12px;
}

.url-row {
  display: flex;
  gap: 8px;
  align-items: center;
}

.remove-url {
  background: rgba(220,38,38,0.12);
  border: none;
  color: var(--brand-primary);
  width: 36px;
  height: 36px;
  border-radius: 50%;
  cursor: pointer;
}

.add-url-row {
  margin-bottom: 12px;
}

.principal-badge {
  position: absolute;
  left: 8px;
  top: 8px;
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: white;
  padding: 4px 8px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 700;
}

.image-preview-item img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.remove-single-image {
  position: absolute;
  top: 5px;
  right: 5px;
  background: rgba(220, 38, 38, 0.9);
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  transition: background 0.3s ease;
}

.remove-single-image:hover {
  background: rgba(127, 29, 29, 1);
}

.image-index {
  position: absolute;
  bottom: 5px;
  left: 5px;
  background: rgba(0, 0, 0, 0.7);
  color: white;
  border-radius: 50%;
  width: 20px;
  height: 20px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 11px;
  font-weight: 600;
}

.image-actions {
  position: absolute;
  left: 5px;
  top: 5px;
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.img-action-btn {
  background: rgba(0,0,0,0.55);
  color: #fff;
  border: none;
  padding: 2px 6px;
  font-size: 10px;
  border-radius: 4px;
  cursor: pointer;
  line-height: 1.1;
  transition: background .2s ease, transform .15s ease;
}

.img-action-btn:hover:not(:disabled) {
  background: rgba(0,0,0,0.8);
  transform: translateY(-1px);
}

.img-action-btn:disabled {
  opacity: .35;
  cursor: default;
}

.img-action-btn.primary {
  background: var(--brand-success);
}

.img-action-btn.primary:hover {
  background: #7f1d1d;
}

.drop-zone {
  border: 2px dashed var(--brand-border);
  border-radius: 12px;
  padding: 40px;
  text-align: center;
  transition: all 0.3s ease;
  background: var(--brand-bg-end);
  cursor: pointer;
}

.drop-zone.dragover {
  border-color: var(--brand-primary);
  background: rgba(220, 38, 38, 0.08);
}

.drop-zone:hover {
  border-color: var(--brand-primary);
  background: rgba(220, 38, 38, 0.08);
}

.drop-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
}

.upload-icon {
  font-size: 3rem;
  color: var(--brand-accent-alt);
}

.upload-btn {
  background: none;
  border: none;
  color: var(--brand-primary);
  font-weight: 600;
  cursor: pointer;
  text-decoration: underline;
}

.upload-btn:hover {
  color: #fecaca;
}

.url-input {
  margin-top: 15px;
  padding-top: 15px;
  border-top: 1px solid var(--brand-border);
}

.url-input label {
  font-size: 0.9rem;
  color: var(--brand-accent-alt);
  margin-bottom: 8px;
}

.discount-info {
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.26);
  border-radius: 8px;
  padding: 12px;
  margin-bottom: 20px;
}

.discount-badge {
  color: white;
  font-weight: 600;
  font-size: 0.9rem;
}

.form-actions {
  display: flex;
  gap: 15px;
  justify-content: flex-end;
  margin-top: 30px;
  padding-top: 20px;
  border-top: 2px solid var(--brand-border);
}

/* Responsive */
@media (max-width: 768px) {
  .admin-dashboard {
    padding: 10px;
  }

  .dashboard-header {
    text-align: center;
    margin-bottom: 20px;
  }

  .dashboard-title {
    font-size: 1.6rem;
    line-height: 1.2;
  }

  .dashboard-subtitle {
    font-size: 0.9rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 15px;
  }

  .stat-card {
    padding: 12px;
  }

  .stat-number {
    font-size: 1.3rem;
  }

  .stat-label {
    font-size: 0.75rem;
  }

  .stat-icon {
    font-size: 1.8rem;
    width: 50px;
    height: 50px;
  }

  .tabs-container {
    margin-bottom: 20px;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tab {
    padding: 8px 12px;
    font-size: 0.9rem;
    min-width: auto;
  }

  .tab-icon {
    display: none;
  }

  .section-header {
    flex-direction: column;
    gap: 15px;
    align-items: flex-start;
  }

  .section-header h2 {
    font-size: 1.4rem;
  }

  .products-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .product-card {
    border-radius: 18px;
  }

  .product-actions {
    grid-template-columns: 1fr;
    gap: 8px;
  }

  .btn {
    padding: 8px 16px;
    font-size: 0.9rem;
  }

  .form-row {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .form-actions {
    flex-direction: column;
    gap: 10px;
  }

  .modal {
    margin: 10px;
    max-width: none;
  }

  .modal-header h3 {
    font-size: 1.3rem;
  }

  .modal-body {
    padding: 15px;
  }
}

/* Estilos para la sección de ventas */
.sales-stats {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: 20px;
  margin-bottom: 30px;
}

.sales-table-container {
  background: var(--brand-bg-end);
  border-radius: 12px;
  padding: 20px;
  border: 1px solid var(--brand-border);
  overflow-x: auto;
}

.sales-table {
  width: 100%;
  border-collapse: collapse;
  font-size: 0.9rem;
}

.sales-table th {
  background: var(--brand-surface);
  color: var(--brand-primary-contrast);
  font-weight: 600;
  padding: 18px 100px;
  text-align: center;
  border-bottom: 2px solid var(--brand-border);
  white-space: nowrap;
  font-size: 0.95rem;
}

.sales-table td {
  padding: 18px 60px;
  border-bottom: 1px solid var(--brand-border);
  color: var(--brand-accent-alt);
  text-align: center;
}

.sale-row {
  transition: background-color 0.3s ease;
}

.sale-row:hover {
  background: var(--brand-surface);
}

.customer-info {
  display: flex;
  flex-direction: column;
  gap: 2px;
}

.customer-name {
  font-weight: 600;
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

.customer-email {
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.product-name {
  font-weight: 500;
  color: var(--brand-primary-contrast);
  font-size: 0.85rem;
}

.quantity {
  background: var(--brand-accent);
  color: white;
  padding: 4px 8px;
  border-radius: 8px;
  font-weight: 600;
  display: inline-block;
  min-width: 30px;
  text-align: center;
}

.amount {
  font-weight: 700;
  color: var(--brand-success);
  font-size: 0.9rem;
}

.status-badge {
  padding: 6px 12px;
  border-radius: 20px;
  font-size: 0.75rem;
  font-weight: 600;
  text-transform: uppercase;
  display: inline-block;
}

.status-badge.completed {
  background: rgba(220, 38, 38, 0.18);
  color: #fecaca;
  border: 1px solid rgba(220, 38, 38, 0.26);
}

.status-badge.pending {
  background: rgba(255, 255, 255, 0.08);
  color: #fca5a5;
  border: 1px solid rgba(220, 38, 38, 0.18);
}

.status-badge.cancelled {
  background: rgba(127, 29, 29, 0.28);
  color: #fff1f2;
  border: 1px solid rgba(220, 38, 38, 0.22);
}

.date {
  color: var(--brand-accent-alt);
  font-size: 0.75rem;
}

/* Estilos para productos múltiples */
.product-info {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.single-product {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.product-color {
  display: flex;
  align-items: center;
  gap: 6px;
  font-size: 0.75rem;
  color: var(--brand-accent-alt);
}

.color-dot {
  width: 14px;
  height: 14px;
  border-radius: 50%;
  border: 2px solid #fff;
  box-shadow: 0 1px 3px rgba(0, 0, 0, 0.2);
}

.multiple-products {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.products-summary {
  display: flex;
  align-items: center;
  gap: 8px;
}

.products-badge {
  background: linear-gradient(135deg, #dc2626 0%, #111111 100%);
  color: white;
  padding: 4px 10px;
  border-radius: 12px;
  font-size: 0.75rem;
  font-weight: 600;
  display: inline-block;
}

.products-details {
  margin-top: 4px;
}

.products-toggle {
  cursor: pointer;
  color: var(--brand-accent);
  font-size: 0.75rem;
  font-weight: 500;
  padding: 4px 0;
  user-select: none;
  transition: color 0.2s;
}

.products-toggle:hover {
  color: var(--brand-primary-contrast);
}

.products-toggle::marker {
  color: var(--brand-accent);
}

.products-list {
  list-style: none;
  padding: 8px 0 0 0;
  margin: 4px 0 0 0;
  display: flex;
  flex-direction: column;
  gap: 6px;
  border-top: 1px solid var(--brand-border);
}

.product-item {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 8px;
  background: var(--brand-surface);
  border-radius: 6px;
  font-size: 0.8rem;
}

.item-name {
  flex: 1;
  font-weight: 500;
  color: var(--brand-primary-contrast);
}

.item-quantity {
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: white;
  padding: 2px 8px;
  border-radius: 10px;
  font-size: 0.7rem;
  font-weight: 600;
}

.item-color {
  display: flex;
  align-items: center;
  gap: 4px;
  font-size: 0.7rem;
  color: var(--brand-accent-alt);
}

.color-dot-small {
  width: 10px;
  height: 10px;
  border-radius: 50%;
  border: 1.5px solid #fff;
  box-shadow: 0 1px 2px rgba(0, 0, 0, 0.2);
}

/* Estilos para cantidad mejorada */
.quantity-info {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 2px;
}

.quantity-header {
  font-size: 0.7rem;
  font-weight: 600;
  color: var(--brand-accent);
  text-transform: uppercase;
  letter-spacing: 0.5px;
  text-align: center;
  width: 100%;
}

.quantity-badge {
  background: linear-gradient(135deg, #dc2626 0%, #111111 100%);
  color: white;
  padding: 6px 12px;
  border-radius: 12px;
  font-weight: 700;
  font-size: 0.9rem;
  display: inline-block;
  min-width: 40px;
  text-align: center;
  box-shadow: 0 2px 8px rgba(245, 87, 108, 0.3);
}

.quantity-sublabel {
  font-size: 0.65rem;
  color: var(--brand-accent-alt);
  text-align: left;
  line-height: 1.2;
  width: 100%;
}

.quantity-label {
  font-size: 0.65rem;
  color: var(--brand-accent-alt);
  text-align: center;
  line-height: 1.2;
}

@media (max-width: 768px) {
  .sales-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 12px;
    margin-bottom: 20px;
  }

  .stat-card {
    padding: 12px;
  }

  .sales-table-container {
    overflow-x: scroll;
    padding: 12px;
    border-radius: 8px;
  }

  .sales-table {
    min-width: 400px;
    font-size: 0.75rem;
  }

  .sales-table th:last-child,
  .sales-table td:last-child {
    min-width: 80px;
    width: 80px;
  }

  .sales-table th {
    padding: 8px 6px;
    font-size: 0.7rem;
  }

  .sales-table td {
    padding: 8px 6px;
  }

  .customer-info {
    gap: 1px;
  }

  .customer-name {
    font-size: 0.8rem;
  }

  .customer-email {
    font-size: 0.7rem;
  }

  .product-name {
    font-size: 0.8rem;
  }

  .quantity {
    padding: 2px 6px;
    font-size: 0.7rem;
    min-width: 24px;
  }

  .amount {
    font-size: 0.8rem;
  }

  .status-badge {
    padding: 4px 8px;
    font-size: 0.65rem;
  }

  .date {
    font-size: 0.7rem;
  }
}

/* Estilos para la sección de showcase/novedades */
.showcase-grid {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 20px;
}

.showcase-card {
  background: var(--brand-bg-end);
  border-radius: 16px;
  padding: 20px;
  border: 2px solid var(--brand-border);
  transition: all 0.3s ease;
  display: flex;
  flex-direction: column;
}

.showcase-card:hover {
  border-color: rgba(220, 38, 38, 0.34);
  box-shadow: 0 8px 25px rgba(220, 38, 38, 0.18);
  transform: translateY(-2px);
}

.showcase-image {
  width: 100%;
  height: 180px;
  border-radius: 12px;
  overflow: hidden;
  margin-bottom: 15px;
  background: var(--brand-border);
}

.showcase-image img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-info {
  flex: 1;
  margin-bottom: 15px;
}

.showcase-info h3 {
  font-size: 1.2rem;
  font-weight: 600;
  color: var(--brand-primary-contrast);
  margin: 0 0 8px;
}

.showcase-description {
  color: var(--brand-accent-alt);
  font-size: 0.9rem;
  margin: 0 0 15px;
  line-height: 1.4;
}

.showcase-meta {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.showcase-category {
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: white;
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.showcase-status {
  padding: 4px 12px;
  border-radius: 20px;
  font-size: 0.8rem;
  font-weight: 600;
}

.showcase-status.available {
  background: rgba(220, 38, 38, 0.16);
  color: #fecaca;
  border: 1px solid rgba(220, 38, 38, 0.24);
}

.showcase-status.unavailable {
  background: rgba(127, 29, 29, 0.24);
  color: #fff1f2;
  border: 1px solid rgba(220, 38, 38, 0.22);
}

.showcase-actions {
  display: flex;
  gap: 10px;
  justify-content: flex-end;
}

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 10px;
  cursor: pointer;
  color: var(--brand-primary-contrast);
  font-weight: 500;
}

.checkbox-label input[type="checkbox"] {
  width: 18px;
  height: 18px;
  accent-color: var(--brand-success);
}

/* Estilos para upload de imágenes en showcase */
.image-tabs {
  display: flex;
  margin-bottom: 1rem;
  border-radius: 8px;
  overflow: hidden;
  border: 1px solid rgba(220, 38, 38, 0.18);
}

.tab-btn {
  flex: 1;
  padding: 0.75rem 1rem;
  background: #151515;
  color: rgba(255, 255, 255, 0.78);
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  font-weight: 500;
}

.tab-btn.active {
  background: linear-gradient(135deg, #dc2626 0%, #7f1d1d 100%);
  color: white;
}

.tab-btn:hover:not(.active) {
  background: rgba(220, 38, 38, 0.1);
  color: rgba(255, 255, 255, 0.9);
}

.image-input-section {
  margin-top: 0.5rem;
}

.file-input {
  display: none;
}

.file-upload-area {
  border: 2px dashed rgba(220, 38, 38, 0.22);
  border-radius: 12px;
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s ease;
  background: #111111;
}

.file-upload-area:hover {
  border-color: rgba(220, 38, 38, 0.34);
  background: rgba(220, 38, 38, 0.06);
}

.upload-placeholder {
  color: rgba(255, 255, 255, 0.7);
}

.upload-placeholder svg {
  color: #999;
  margin-bottom: 1rem;
}

.upload-placeholder p {
  font-weight: 600;
  margin-bottom: 0.5rem;
  color: rgba(255, 255, 255, 0.8);
}

.upload-placeholder span {
  font-size: 0.9rem;
  color: rgba(255, 255, 255, 0.5);
}

.image-preview {
  position: relative;
  display: inline-block;
}

.image-preview img {
  max-width: 200px;
  max-height: 150px;
  border-radius: 8px;
  object-fit: cover;
}

.remove-image {
  position: absolute;
  top: -8px;
  right: -8px;
  background: #dc2626;
  color: white;
  border: none;
  border-radius: 50%;
  width: 24px;
  height: 24px;
  font-size: 0.7rem;
  cursor: pointer;
  transition: all 0.3s ease;
}

.remove-image:hover {
  background: #7f1d1d;
  transform: scale(1.1);
}

@media (max-width: 1400px) {
  .showcase-grid {
    grid-template-columns: repeat(4, 1fr);
  }
}

@media (max-width: 1000px) {
  .showcase-grid {
    grid-template-columns: repeat(3, 1fr);
  }
}

@media (max-width: 768px) {
  .showcase-grid {
    grid-template-columns: repeat(2, 1fr);
  }
}

@media (max-width: 480px) {
  .admin-dashboard {
    padding: 8px;
  }

  .dashboard-title {
    font-size: 1.4rem;
  }

  .dashboard-subtitle {
    font-size: 0.85rem;
  }

  .stats-grid {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
  }

  .stat-card {
    padding: 10px;
  }

  .stat-number {
    font-size: 1.1rem;
  }

  .stat-label {
    font-size: 0.7rem;
  }

  .stat-icon {
    font-size: 1.5rem;
    width: 40px;
    height: 40px;
  }

  .tabs {
    display: grid;
    grid-template-columns: repeat(2, 1fr);
    gap: 8px;
  }

  .tab {
    padding: 10px;
    text-align: center;
    border-radius: 8px;
  }

  .section-header h2 {
    font-size: 1.2rem;
  }

  .product-card {
    border-radius: 16px;
  }

  .product-info h3 {
    font-size: 1rem;
  }

  .product-description {
    font-size: 0.8rem;
    line-height: 1.3;
  }

  .price {
    font-size: 1rem;
  }

  .btn {
    padding: 6px 12px;
    font-size: 0.8rem;
  }

  .modal-header h3 {
    font-size: 1.1rem;
  }

  .form-group label {
    font-size: 0.9rem;
  }

  .form-input,
  .form-textarea,
  .form-select {
    padding: 8px;
    font-size: 0.9rem;
  }

  .showcase-grid {
    grid-template-columns: 1fr;
    gap: 15px;
  }

  .showcase-card {
    padding: 15px;
  }

  .showcase-image {
    height: 160px;
  }

  .showcase-info h3 {
    font-size: 1rem;
  }

  .showcase-description {
    font-size: 0.8rem;
  }

  .showcase-meta {
    flex-direction: column;
    align-items: flex-start;
    gap: 8px;
  }

  .file-upload-area {
    padding: 1.2rem;
  }

  .upload-placeholder svg {
    width: 28px;
    height: 28px;
  }

  .upload-text {
    font-size: 0.8rem;
  }

  /* Sales section optimizations for very small screens */
  .sales-stats {
    grid-template-columns: repeat(2, 1fr);
    gap: 10px;
    margin-bottom: 15px;
  }

  .sales-table-container {
    padding: 8px;
    margin: 0 -8px;
  }

  .sales-table {
    min-width: 350px;
    font-size: 0.7rem;
  }

  .sales-table th:last-child,
  .sales-table td:last-child {
    min-width: 90px;
    width: 90px;
  }

  .sales-table th {
    padding: 6px 4px;
    font-size: 0.65rem;
  }

  .sales-table td {
    padding: 6px 4px;
  }

  .customer-name {
    font-size: 0.75rem;
  }

  .customer-email {
    font-size: 0.65rem;
  }

  .product-name {
    font-size: 0.75rem;
  }

  .quantity {
    padding: 2px 4px;
    font-size: 0.65rem;
    min-width: 20px;
  }

  .amount {
    font-size: 0.75rem;
  }

  .status-badge {
    padding: 3px 6px;
    font-size: 0.6rem;
  }

  .date {
    font-size: 0.65rem;
  }
}
</style>
