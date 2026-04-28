<template>
  <section class="promotions">
    <div class="container">
      <h2 class="promotions-title">PROMOCIONES & BENEFICIOS</h2>
      <div class="promotions-filters" role="tablist" aria-label="Filtros de promociones">
        <button class="filter-pill active">Todos</button>
        <button class="filter-pill">Llantas</button>
      </div>

      <div class="promos">
        <article class="promo" v-for="p in promos" :key="p.id">
          <div class="promo-media">
            <img class="promo-img" :src="p.image" :alt="p.title" />
            <div v-if="p.discountLabel" class="discount-badge">{{ p.discountLabel }}</div>
          </div>

          <div class="promo-body">
            <div class="brand-row">
              <img v-if="p.brandLogo" class="brand-logo" :src="p.brandLogo" :alt="p.brand" />
              <span class="tag-pill">{{ p.category || 'Llantas' }}</span>
            </div>

            <h3 class="promo-title">{{ p.title }}</h3>

            <div class="price-row">
              <div class="price-old" v-if="p.originalPrice">{{ p.originalPrice }}</div>
              <div class="price-new">{{ p.salePrice || p.originalPrice }}</div>
            </div>

            <div class="promo-actions">
              <button class="add-cart" @click="addToCart(p)">Añadir al carrito</button>
            </div>
          </div>
        </article>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
import { useCart } from '@/composables/useCart'

const { addToCart: cartAddToCart } = useCart()

const promos = [
  {
    id: 1,
    discountLabel: 'OFERTA -25%',
    image: 'https://autopla1.b-cdn.net/wp-content/uploads/2025/12/COMPASAL-BLAZER-HP-X4-3-1.webp',
    brand: 'Continental',
    brandLogo: 'https://1000marcas.net/wp-content/uploads/2022/12/Continental-Logo.png',
    category: 'Llantas',
    title: 'LLANTA CONTINENTAL POWERCONTACT 2 185/60 R14 82H',
    originalPrice: '$404.477',
    salePrice: '$301.165'
  },
  {
    id: 2,
    discountLabel: 'OFERTA -30%',
    image: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/03/test-llantas-2.webp',
    brand: 'Kenda',
    brandLogo: 'https://marvel-b1-cdn.bc0a.com/f00000000270535/s19532.pcdn.co/wp-content/uploads/2023/06/Kenda-1400-1000x500.jpg',
    category: 'Llantas',
    title: 'LLANTA KENDA NUEVA KR20 185/60 R14 82H',
    originalPrice: '$230.000',
    salePrice: '$161.000'
  },
  {
    id: 3,
    discountLabel: 'OFERTA -14%',
    image: 'https://grupouma.com/colombia/wp-content/uploads/sites/2/2024/03/Grupo-uma-landing-llantas-jktyre-llantas-1.webp',
    brand: 'Hankook',
    brandLogo: 'https://1000marcas.net/wp-content/uploads/2020/10/Hankook-logo.png',
    category: 'Llantas',
    title: 'LLANTA HANKOOK KINERGY H308 165/70 R13',
    originalPrice: '$210.000',
    salePrice: '$180.000'
  }
]

const openWhatsapp = (p: any) => {
  const text = `Hola! Estoy interesado en la promoción: ${p.title}`
  window.open(`https://api.whatsapp.com/send?phone=573138936332&text=${encodeURIComponent(text)}`, '_blank')
}


const parsePrice = (priceStr: any) => {
  if (!priceStr) return 0
  const digits = String(priceStr).replace(/[^0-9]/g, '')
  return Number(digits) || 0
}

const addToCart = (p: any) => {
  const price = parsePrice(p.salePrice || p.originalPrice)
  const product = {
    id: String(p.id),
    name: p.title,
    price,
    image: p.image,
    category: p.category || 'Llantas',
    description: p.title,
    inStock: true
  }
  try {
    cartAddToCart(product, 1)
  } catch (e) {
    console.warn('addToCart error', e)
  }

  const n = document.createElement('div')
  n.textContent = 'Añadido al carrito'
  n.style.cssText = 'position:fixed;left:50%;transform:translateX(-50%);bottom:20px;background:#111;color:#fff;padding:8px 12px;border-radius:8px;z-index:9999'
  document.body.appendChild(n)
  setTimeout(() => n.remove(), 1600)
}

defineOptions({ name: 'PromotionsRR' })
</script>

<style scoped>
:root { --accent: #f59e0b; --card-bg: #ffffff; --page-bg: #111111 }
.promotions { padding: 40px 0; background: var(--page-bg); color: #fff }
.container { max-width:1200px; margin:0 auto; padding: 0 18px }
.promotions-title { text-align: center; color: var(--accent); font-weight:900; margin: 0 0 12px; font-size: 35px; letter-spacing: 1px; text-transform:uppercase }
.promotions-filters { display:flex; gap:10px; justify-content:center; margin-bottom:20px }
.filter-pill { background: transparent; color: #fff; border: 1px solid rgba(255,255,255,0.08); padding: 8px 14px; border-radius: 999px; cursor:pointer; font-weight:700 }
.filter-pill.active { background: rgba(255,255,255,0.03); border-color: rgba(255,255,255,0.06) }
.promos { display:grid; grid-template-columns: repeat(3, 1fr); gap:20px; align-items:start }
.promo { background: var(--card-bg); border-radius: 10px; overflow: hidden; color: #111; box-shadow: 0 8px 20px rgba(0,0,0,0.5); display:flex; flex-direction:column; }
.promo-media { position: relative; width:100%; height:200px; overflow:hidden; background:#eee; display:flex; align-items:center; justify-content:center }
.promo-img { width:100%; height:100%; object-fit:cover; display:block }
.discount-badge { position:absolute; left:16px; top:12px; background: #0c0c0ce8; color:#df1717; padding:8px 10px; font-weight:800; border-radius:999px; font-size:0.85rem; box-shadow: 0 6px 18px rgba(0,0,0,0.2) }
.promo-body { padding:16px; display:flex; flex-direction:column; gap:10px; align-items:center}
.brand-row { display:flex; gap:12px; align-items:center; }
.brand-logo { max-height:56px; object-fit:contain; margin:0 8px 0 0 }
.tag-pill { background:#000; color:#fff; padding:6px 10px; border-radius:999px; font-weight:700; font-size:0.85rem }
.promo-title { margin:0; color: var(--accent); font-weight:800; font-size:1.05rem; text-transform:uppercase ; text-align: center;}
.price-row { display:flex; flex-direction:column; gap:6px; align-items:center; margin-top:6px }
.price-old { color:#9ca3af; text-decoration:line-through; font-weight:700 }
.price-new { color:#dc2626; font-weight:900; font-size:1.4rem }
.promo-actions { width:100%; display:flex; justify-content:center; margin-top:6px }
.add-cart { background:#dc2626; color:#fff; border:none; padding:12px 16px; border-radius:6px; font-weight:900; cursor:pointer; width:100% }

@media (max-width: 1100px) { .promos { grid-template-columns: repeat(2, 1fr) } }
@media (max-width: 720px) { .promos { grid-template-columns: 1fr } .promo-media { height:140px } .promotions-title { font-size:25px } .promo-body { align-items:center; text-align:center } .promo-actions { justify-content:center } .tag-pill { display:inline-block } }

</style>
