<template>
  <div v-if="isCartOpen" class="cart-overlay" @click="closeCart">
    <div class="cart-modal" @click.stop>
      <div class="cart-header">
        <h3>Tu Carrito ({{ totalItems }})</h3>
        <button @click="closeCart" class="close-btn" aria-label="Cerrar carrito">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
            <path d="m18 6-12 12"/>
            <path d="m6 6 12 12"/>
          </svg>
        </button>
      </div>

      <div class="cart-content">
        <div v-if="cartItems.length === 0" class="empty-cart">
          <p>Tu carrito está vacío</p>
        </div>

        <div v-else class="cart-items">
          <div v-for="item in cartItems" :key="item.id + (item.selectedColor || '')" class="cart-item">
            <img :src="item.image" :alt="item.name" />
            <div class="item-details">
              <h4>{{ item.name }}</h4>
              <span class="item-category">{{ item.category }}</span>
              <span v-if="item.selectedColor" class="item-color">Color: {{ item.selectedColor }}</span>
              <div class="item-price">${{ item.price.toLocaleString() }}</div>
            </div>

            <div class="item-controls">
              <div class="quantity-controls">
                <button @click="updateQuantity(item.id, item.quantity - 1, item.selectedColor)" class="quantity-btn minus">-</button>
                <span class="quantity">{{ item.quantity }}</span>
                <button @click="updateQuantity(item.id, item.quantity + 1, item.selectedColor)" class="quantity-btn plus">+</button>
              </div>

              <button @click="removeFromCart(item.id, item.selectedColor)" class="remove-btn" aria-label="Eliminar">
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M3 6h18" />
                  <path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6" />
                  <path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2" />
                </svg>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div v-if="cartItems.length > 0" class="cart-footer">
        <div class="cart-total-display">
          <strong>Total: ${{ totalPrice.toLocaleString() }}</strong>
        </div>
        <div class="cart-actions">
          <button @click="clearCart" class="btn-clear">Limpiar carrito</button>
          <button @click="goToCheckout" class="btn-checkout">Finalizar Pedido</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { useRouter } from 'vue-router'
import { useCart } from '@/composables/useCart'

const router = useRouter()
const {
  cartItems,
  isCartOpen,
  totalItems,
  totalPrice,
  removeFromCart,
  updateQuantity,
  clearCart,
  closeCart
} = useCart()

const goToCheckout = () => {
  closeCart()
  router.push('/checkout')
}
</script>

<style scoped>
.cart-overlay { position: fixed; inset: 0; background: rgba(0,0,0,0.55); display:flex; align-items:center; justify-content:center; z-index:2000 }
.cart-modal { background: #fff; width: 95%; max-width:720px; border-radius:10px; padding:16px; max-height:80vh; overflow:hidden; display:flex; flex-direction:column }
.cart-header { display:flex; align-items:center; justify-content:space-between; gap:8px; margin-bottom:8px }
.cart-items { display:flex; flex-direction:column; gap:12px }
.cart-item { display:flex; gap:12px; align-items:center; padding:8px; border-radius:8px; background:#f7f7f7 }
.cart-item img { width:72px; height:72px; object-fit:cover; border-radius:6px }
.item-details h4 { margin:0; font-size:1rem }
.item-controls { margin-left:auto; display:flex; gap:8px; align-items:center }
.quantity-controls { display:flex; align-items:center; gap:8px; }
.quantity-btn { width:32px; height:32px; border-radius:6px; border:1px solid #ddd; background:white; cursor:pointer }
.btn-clear, .btn-checkout { padding:8px 12px; border-radius:8px; border:none; cursor:pointer }
.btn-clear { background:transparent; border:1px solid #ccc }
.btn-checkout { background:#ef2330; color:white }
.close-btn { background: transparent; border: none; cursor: pointer }

/* Layout helpers */
.cart-content { flex:1 1 auto; overflow:auto; padding-right: 6px }
.cart-footer { flex: 0 0 auto }

@media (max-width: 768px) {
  .cart-overlay { align-items: flex-end; padding: 0; }
  .cart-modal {
    width: 100%;
    max-width: 100%;
    height: calc(100vh - var(--navbar-height, 76px));
    max-height: none;
    border-radius: 12px 12px 0 0;
    margin: 0;
    padding: 12px 12px 16px;
    overflow: hidden;
  }

  .cart-header { position: sticky; top: 0; background: #fff; z-index: 12; padding-bottom: 8px }

  .cart-content { padding: 8px 0; }

  .cart-item { flex-direction: column; align-items: flex-start; padding:12px; }
  .cart-item img { width:64px; height:64px }
  .item-details { width:100%; }
  .item-controls { margin-left: 0; width:100%; display:flex; justify-content:space-between; gap:8px; margin-top:8px }
  .quantity-btn { width:40px; height:40px; border-radius:8px }
  .remove-btn { padding:8px; border-radius:8px }

  .cart-footer { position: sticky; bottom: 0; z-index: 11; background: #fff; padding-top: 10px; border-top: 1px solid rgba(0,0,0,0.06) }
  .cart-total-display { text-align: center; margin-bottom:8px }
  .cart-actions { display:flex; flex-direction:column; gap:8px }
  .btn-checkout { width:100%; padding:14px; font-size:16px }
  .btn-clear { width:100%; padding:12px }

  .close-btn { width:40px; height:40px; display:inline-flex; align-items:center; justify-content:center; border-radius:8px }

}
</style>
