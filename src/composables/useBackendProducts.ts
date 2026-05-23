import { ref } from 'vue'
import { productService } from '@/services/api'
import type {
  Product,
  CreateProductRequest,
  UpdateProductRequest
} from '@/types/ProductType'

// Estado global de productos del backend (inicializado vacío)
const products = ref<Product[]>([])
const loading = ref(false)
const error = ref<string | null>(null)

// Normaliza la respuesta del backend al tipo Product del frontend
function normalizeProduct(input: unknown): Product {
  if (typeof input === 'object' && input !== null) {
    const anyProduct = input as Record<string, unknown>

    const id = anyProduct.id !== undefined ? String(anyProduct.id) : crypto.randomUUID()
    const name = String(anyProduct.name || '')
    const description = String(anyProduct.description || '')
    const price = Number(anyProduct.price || 0)
    const originalPrice = anyProduct.originalPrice !== null && anyProduct.originalPrice !== undefined
      ? Number(anyProduct.originalPrice)
      : undefined

    // Parsear images (puede venir como JSON string del backend)
    let images: string[] = []
    if (typeof anyProduct.images === 'string') {
      try {
        images = JSON.parse(anyProduct.images)
      } catch {
        images = [anyProduct.images]
      }
    } else if (Array.isArray(anyProduct.images)) {
      images = anyProduct.images.map(String)
    }

    // categoryId del backend → category string en frontend
    const category = String(anyProduct.categoryId || '')

    const status = (anyProduct.status === 'available' ||
                   anyProduct.status === 'out-of-stock' ||
                   anyProduct.status === 'coming-soon')
      ? anyProduct.status
      : 'available'

    // Parsear colors (puede venir como JSON string del backend)
    let colors: string[] | undefined
    if (anyProduct.colors) {
      if (typeof anyProduct.colors === 'string') {
        try {
          colors = JSON.parse(anyProduct.colors)
        } catch {
          colors = [anyProduct.colors]
        }
      } else if (Array.isArray(anyProduct.colors)) {
        colors = anyProduct.colors.map(String)
      }
    }

    const isShowcase = Boolean(anyProduct.isShowcase)
    const showcaseImage = anyProduct.showcaseImage !== null && anyProduct.showcaseImage !== undefined
      ? String(anyProduct.showcaseImage)
      : undefined
    const tireMeasure = anyProduct.tireMeasure !== null && anyProduct.tireMeasure !== undefined
      ? String(anyProduct.tireMeasure)
      : undefined
    const tireRim = anyProduct.tireRim !== null && anyProduct.tireRim !== undefined
      ? String(anyProduct.tireRim)
      : undefined

    const createdAtRaw = anyProduct.createdAt
    const updatedAtRaw = anyProduct.updatedAt

    return {
      id,
      name,
      description,
      price,
      originalPrice,
      images,
      category,
      status,
      colors,
      tireMeasure,
      tireRim,
      isShowcase,
      showcaseImage,
      createdAt: createdAtRaw ? new Date(String(createdAtRaw)) : new Date(),
      updatedAt: updatedAtRaw ? new Date(String(updatedAtRaw)) : undefined
    }
  }

  // Fallback vacío controlado
  return {
    id: crypto.randomUUID(),
    name: '',
    description: '',
    price: 0,
    images: [],
    category: '',
    status: 'available',
    tireMeasure: undefined,
    tireRim: undefined,
    createdAt: new Date()
  }
}

export function useBackendProducts() {
  // Función para cargar todos los productos con filtros opcionales
  const loadProducts = async (filters?: {
    name?: string
    categoryId?: number
    showcase?: boolean
  }) => {
    loading.value = true
    error.value = null

    try {
      console.log('🔄 [loadProducts] Iniciando carga de productos...', filters)
      const response = await productService.getProducts(filters)
      console.log('📥 [loadProducts] Respuesta del backend:', response)

      if (response.success) {
        // La respuesta puede venir en dos formatos:
        // 1. { data: [...] } - Array directo
        // 2. { data: { products: [...], count: N } } - Objeto con products
        const raw = response.data as unknown
        console.log('📦 [loadProducts] Datos raw:', raw)

        let productsToNormalize: unknown[] = []

        if (Array.isArray(raw)) {
          // Formato 1: Array directo
          productsToNormalize = raw
        } else if (raw && typeof raw === 'object' && 'products' in raw) {
          // Formato 2: Objeto con propiedad products
          const dataObj = raw as { products?: unknown[] }
          if (Array.isArray(dataObj.products)) {
            productsToNormalize = dataObj.products
          }
        }

        const normalized = productsToNormalize.map(normalizeProduct)
        console.log('✅ [loadProducts] Productos normalizados:', normalized)
        products.value = normalized
        console.log('📋 [loadProducts] Products.value actualizado:', products.value.length, products.value)

        return { success: true, data: response.data }
      } else {
        error.value = response.message
        console.error('❌ [loadProducts] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al cargar productos'
      error.value = errorMessage
      console.error('❌ [loadProducts] Excepción:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para crear un nuevo producto
  const createProduct = async (productData: CreateProductRequest) => {
    loading.value = true
    error.value = null

    try {
      console.log('📝 [useBackendProducts] Creando producto:', productData)
      console.log('📋 [useBackendProducts] Productos antes de crear:', products.value.length)

      const response = await productService.createProduct(productData)
      console.log('📥 [useBackendProducts] Respuesta del backend:', response)

      if (response.success) {
        const normalized = normalizeProduct(response.data)
        console.log('✅ [useBackendProducts] Producto normalizado:', normalized)

        products.value.push(normalized)
        console.log('📋 [useBackendProducts] Productos después de crear:', products.value.length)
        console.log('📋 [useBackendProducts] Array completo:', products.value)

        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        console.error('❌ [useBackendProducts] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al crear producto'
      error.value = errorMessage
      console.error('❌ [useBackendProducts] Excepción:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para actualizar un producto
  const updateProduct = async (id: number, productData: UpdateProductRequest) => {
    loading.value = true
    error.value = null

    try {
      console.log('📝 [useBackendProducts] Actualizando producto:', id, productData)
      const response = await productService.updateProduct(id, productData)
      console.log('📥 [useBackendProducts] Respuesta del backend:', response)

      if (response.success) {
        const normalized = normalizeProduct(response.data)
        const index = products.value.findIndex((prod) => prod.id === String(id))
        if (index !== -1) {
          products.value[index] = normalized
          console.log('✅ [useBackendProducts] Producto actualizado en índice:', index)
        }
        return { success: true, data: normalized, message: response.message }
      } else {
        error.value = response.message
        console.error('❌ [useBackendProducts] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al actualizar producto'
      error.value = errorMessage
      console.error('❌ [useBackendProducts] Excepción:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para eliminar un producto
  const deleteProduct = async (id: number) => {
    loading.value = true
    error.value = null

    try {
      console.log('🗑️ [useBackendProducts] Eliminando producto:', id)
      const response = await productService.deleteProduct(id)
      console.log('📥 [useBackendProducts] Respuesta del backend:', response)

      if (response.success) {
        products.value = products.value.filter((prod) => prod.id !== String(id))
        console.log('✅ [useBackendProducts] Producto eliminado. Total:', products.value.length)
        return { success: true, message: response.message }
      } else {
        error.value = response.message
        console.error('❌ [useBackendProducts] Error del backend:', response.message)
        return { success: false, message: response.message }
      }
    } catch (err: unknown) {
      const errorMessage = err instanceof Error ? err.message : 'Error al eliminar producto'
      error.value = errorMessage
      console.error('❌ [useBackendProducts] Excepción:', err)
      return { success: false, message: errorMessage }
    } finally {
      loading.value = false
    }
  }

  // Función para obtener un producto por ID
  const getProductById = (id: number | string): Product | undefined => {
    return products.value.find((prod) => prod.id === String(id))
  }

  // Función para limpiar errores
  const clearError = () => {
    error.value = null
  }

  // Función para refrescar productos
  const refreshProducts = async () => {
    return await loadProducts()
  }

  return {
    // Estado - refs directos para mantener reactividad
    products,
    loading,
    error,

    // Funciones
    loadProducts,
    createProduct,
    updateProduct,
    deleteProduct,
    getProductById,
    clearError,
    refreshProducts,
  }
}
