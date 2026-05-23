<template>
  <header>
    <nav class="navbar">
      <!-- Barra superior: logo, contacto, búsqueda y acciones -->
      <div class="navbar-top">
        <div class="top-left">
          <RouterLink class="link-navbar home" to="/" @click="goHome">
            <img src="/images/logo.jpeg" alt="LLANTAS RR" class="site-logo" />
          </RouterLink>

          <div class="contact-inline">
            <a class="phone-link" href="tel:3138936332" aria-label="Llamar 313 893 6332">
              <span class="material-symbols-outlined icon-phone">call</span>
              <span>+57 3138936332</span>
            </a>

            <a class="whatsapp-cta" href="#" @click.prevent="openWhatsapp" aria-label="Abrir WhatsApp">
              <img src="https://cdn.simpleicons.org/whatsapp/ffffff" alt="WhatsApp" class="icon-whatsapp" />
              <span>WHATSAPP</span>
            </a>
          </div>
        </div>

        <div class="top-center">
          <form class="search-form" @submit.prevent="submitSearch">
            <input v-model="searchQuery" class="search-input" placeholder="Qué Buscas?" aria-label="Buscar" />
            <button class="search-btn" aria-label="Buscar">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6"/><path d="m21 21-4.35-4.35"/></svg>
            </button>
          </form>
        </div>

        <div class="top-right">
          <RouterLink v-if="!isLoggedIn" class="login-link" to="/login" aria-label="Iniciar sesión">
            <span class="material-symbols-outlined icon-lock">lock</span>
            <span>Iniciar Sesión</span>
          </RouterLink>

          <div v-else class="nav-controls desktop-controls">
            <div class="user-greeting">
              Hola, {{ username }}
            </div>

            <RouterLink v-if="isAdmin" class="btn admin-btn" to="/admin/products" aria-label="Ir al panel de administración">
              ⚙️ Panel Admin
            </RouterLink>

            <button class="btn logout-btn" type="button" @click="logout">
              Cerrar sesión
            </button>
          </div>

          <!-- Botón de búsqueda: usar la misma lupa del escritorio (visible sólo en móvil) -->
          <button class="search-btn mobile-search-btn" @click="openMobileSearch" aria-label="Buscar" type="button">
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="6"/><path d="m21 21-4.35-4.35"/></svg>
          </button>

          <div class="cart-btn" @click="toggleCart">
            <span class="material-symbols-outlined icon-cart">shopping_cart</span>
            <span class="cart-count">{{ totalItems }}</span>
          </div>
        </div>
      </div>

        <!-- Mobile search overlay -->
        <div v-if="isMobileSearchOpen" class="mobile-search-overlay" @click.self="closeMobileSearch">
          <form class="mobile-search-box" @submit.prevent="mobileSubmit">
            <input
              ref="mobileSearchInputRef"
              v-model="searchQuery"
              class="mobile-search-input"
              placeholder="Buscar llantas, marca o modelo"
              aria-label="Buscar"
            />
            <button class="mobile-search-submit" type="submit">Buscar</button>
            <button type="button" class="mobile-search-close" @click="closeMobileSearch" aria-label="Cerrar búsqueda">✕</button>
          </form>
        </div>

      <!-- Barra de categorías (ubicada en header) -->
      <div class="categorybar">
        <div class="nav-menu">
          <RouterLink to="/automovil" class="nav-link">Automóvil</RouterLink>
          <RouterLink to="/maintenance" class="nav-link">Camioneta / SUV</RouterLink>
          <RouterLink to="/maintenance" class="nav-link">Camión / Bus</RouterLink>
          <RouterLink to="/maintenance" class="nav-link">Moto</RouterLink>
          <RouterLink to="/maintenance" class="nav-link">Agrícola</RouterLink>
          <RouterLink to="/maintenance" class="nav-link">Montacarga</RouterLink>
          <RouterLink to="/" class="nav-link offers" @click.prevent="goToPromotions">OFERTAS</RouterLink>
        </div>
      </div>

      <!-- Menu hamburguesa para mobile (mantener funcionalidad) -->
      <button class="hamburger-menu" @click="toggleMobileMenu" :class="{ 'active': isMobileMenuOpen }">
        <span></span>
        <span></span>
        <span></span>
      </button>

      <!-- Menu mobile desplegable (sin cambios funcionales) -->
      <div class="mobile-menu" :class="{ 'active': isMobileMenuOpen }">
        <div class="mobile-menu-content">
          <div class="mobile-nav-links">
            <RouterLink to="/" class="mobile-link" :class="{ active: isCurrentRoute('/') }" @click="closeMobileMenu">Inicio</RouterLink>
          </div>

          <!-- Categorías (visibles en móvil) -->
          <div class="mobile-categories">
            <h4 class="mobile-categories-title">Categorías</h4>
            <div class="mobile-categories-list">
              <RouterLink to="/automovil" class="mobile-link" @click="closeMobileMenu">Automóvil</RouterLink>
              <RouterLink to="/maintenance" class="mobile-link" @click="closeMobileMenu">Camioneta / SUV</RouterLink>
              <RouterLink to="/maintenance" class="mobile-link" @click="closeMobileMenu">Camión / Bus</RouterLink>
              <RouterLink to="/maintenance" class="mobile-link" @click="closeMobileMenu">Moto</RouterLink>
              <RouterLink to="/maintenance" class="mobile-link" @click="closeMobileMenu">Agrícola</RouterLink>
              <RouterLink to="/maintenance" class="mobile-link" @click="closeMobileMenu">Montacarga</RouterLink>
              <RouterLink to="/" class="mobile-link offers" @click.prevent="() => { closeMobileMenu(); goToPromotions(); }">OFERTAS</RouterLink>
            </div>
          </div>

          <div class="mobile-controls">
            <RouterLink v-if="!isLoggedIn" class="mobile-btn access-btn" to="/login" @click="closeMobileMenu">
              Acceder
            </RouterLink>
            <div v-if="isLoggedIn" class="mobile-user-greeting">
              <span>Hola, {{ username }}</span>
            </div>
            <RouterLink v-if="isLoggedIn && isAdmin" class="mobile-btn admin-btn" to="/admin/products" @click="closeMobileMenu">
              ⚙️ Panel Admin
            </RouterLink>
            <button v-if="isLoggedIn" @click="handleMobileLogout" class="mobile-btn logout-btn">
              Cerrar sesión
            </button>
          </div>
        </div>
      </div>
    </nav>
  </header>

  <RouterView />

  <CartModal />

  <!-- Botones flotantes de redes sociales -->
  <SocialFloating />
</template>

<script setup lang="ts">
import { RouterLink, RouterView, useRoute } from 'vue-router';
import { authService } from '@/services/api';
import { onMounted, ref, watch, computed } from 'vue';
import { useCart } from '@/composables/useCart'
import router from './router';
import SocialFloating from '@/components/SocialFloating.vue';
import CartModal from '@/components/CartModal.vue'

const isLoggedIn = ref(false);
const username = ref('');
const isMobileMenuOpen = ref(false);
const searchQuery = ref('');
const isMobileSearchOpen = ref(false);
const mobileSearchInputRef = ref<HTMLInputElement | null>(null);

// Buscar: si estamos en home, buscar en la página; si no, navegar a /buscar
const hiddenProductStoreMap: Map<Element, string> = new Map()

const escapeRegExp = (s: string) => s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')

const clearHighlights = () => {
  const marks = Array.from(document.querySelectorAll('mark.app-search-mark'))
  marks.forEach((m) => {
    const parent = m.parentNode
    if (!parent) return
    parent.replaceChild(document.createTextNode(m.textContent || ''), m)
    parent.normalize()
  })
}

const hideProductStores = () => {
  document.querySelectorAll('.product-store').forEach((el) => {
    if (!hiddenProductStoreMap.has(el)) hiddenProductStoreMap.set(el, (el as HTMLElement).style.display || '')
    ;(el as HTMLElement).style.display = 'none'
  })
}

const restoreProductStores = () => {
  hiddenProductStoreMap.forEach((orig, el) => {
    ;(el as HTMLElement).style.display = orig
  })
  hiddenProductStoreMap.clear()
}

const performInPageSearch = (q: string) => {
  try {
    clearHighlights()
    hideProductStores()

    if (!q) return
    const re = new RegExp(escapeRegExp(q), 'gi')
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT, null)
    const nodes: Text[] = []
    let n = walker.nextNode() as Text | null
    while (n) {
      nodes.push(n)
      n = walker.nextNode() as Text | null
    }

    let firstMark: HTMLElement | null = null
    nodes.forEach((textNode) => {
      const parent = textNode.parentElement
      if (!parent) return
      const tag = parent.tagName.toLowerCase()
      if (['script', 'style', 'noscript', 'textarea', 'input'].includes(tag)) return
      const text = textNode.nodeValue || ''
      if (!re.test(text)) return

      // reconstruir con marks
      re.lastIndex = 0
      const frag = document.createDocumentFragment()
      let lastIndex = 0
      let m: RegExpExecArray | null
      while ((m = re.exec(text)) !== null) {
        const before = text.substring(lastIndex, m.index)
        if (before) frag.appendChild(document.createTextNode(before))
        const mark = document.createElement('mark')
        mark.className = 'app-search-mark'
        mark.textContent = m[0]
        frag.appendChild(mark)
        if (!firstMark) firstMark = mark
        lastIndex = m.index + m[0].length
      }
      const after = text.substring(lastIndex)
      if (after) frag.appendChild(document.createTextNode(after))
      parent.replaceChild(frag, textNode)
    })

    if (firstMark) {
      try {
        (firstMark as HTMLElement).scrollIntoView({ behavior: 'smooth', block: 'center' })
      } catch {
        // ignore
      }
    }
  } catch (err) {
    console.error('[App] error performInPageSearch', err)
  }
}

const closeInPageSearch = () => {
  clearHighlights()
  restoreProductStores()
}

const submitSearch = () => {
  const q = (searchQuery.value || '').trim()
  if (!q) {
    // vaciar búsqueda: quitar highlights y navegar a /buscar vacío
    closeInPageSearch()
    router.push({ path: '/buscar' })
    return
  }

  if (currentRoute.path === '/') {
    performInPageSearch(q)
    searchQuery.value = ''
  } else {
    // en otras páginas mantenemos comportamiento anterior
    router.push({ path: '/buscar', query: { q } })
    searchQuery.value = ''
  }
}

// Carrito
const { totalItems, toggleCart } = useCart()

// Router hooks
const currentRoute = useRoute();

// Verificar si el usuario es administrador
const isAdmin = computed(() => authService.isAdmin());

// Función para verificar la ruta actual
const isCurrentRoute = (path: string): boolean => {
  return currentRoute.path === path;
};

// Funciones para el menú hamburguesa
const toggleMobileMenu = () => {
  isMobileMenuOpen.value = !isMobileMenuOpen.value;
};

const closeMobileMenu = () => {
  isMobileMenuOpen.value = false;
};

const goHome = () => {
  // cerrar menú móvil y navegar/scroll a la sección Llantas Hero
  closeMobileMenu();

  const scrollToHero = () => {
    const el = document.querySelector('.llantas-hero') as HTMLElement | null;
    if (el) {
      el.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  // Si ya estamos en home, solo hacer scroll; si no, navegar y luego hacer scroll
  if (currentRoute.path === '/') {
    setTimeout(scrollToHero, 80);
  } else {
    router.push({ path: '/' }).then(() => setTimeout(scrollToHero, 120));
  }
};

// Función para hacer scroll a la sección de productos
/* const scrollToProductStore = () => {
  const productStoreSection = document.querySelector('.product-store');
  if (productStoreSection) {
    productStoreSection.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  }
}; */

// Función para hacer scroll a la sección de contacto
const scrollToContact = () => {
  const contactSection = document.querySelector('.contact-section');
  if (contactSection) {
    contactSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
  } else {
    // Si no existe, navegar a home y hacer pequeño delay para el scroll
    router.push('/').then(() => setTimeout(() => {
      const el = document.querySelector('.contact-section')
      if (el) el.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }, 400))
  }
}

const openWhatsapp = () => {
  const text = 'Hola! Necesito asesoría para elegir una llanta.'
  // Usar el número principal +57 313 893 6332
  window.open(`https://api.whatsapp.com/send?phone=573138936332&text=${encodeURIComponent(text)}`, '_blank')
}

// Navegar a la página de búsqueda desde el botón móvil (abrir overlay)
const openMobileSearch = () => {
  isMobileSearchOpen.value = true
  // dar tiempo a render y enfocar input
  setTimeout(() => mobileSearchInputRef.value?.focus(), 80)
}

const closeMobileSearch = () => {
  isMobileSearchOpen.value = false
}

const mobileSubmit = () => {
  submitSearch()
  closeMobileSearch()
}

// Ir a la sección de promociones en la home
const goToPromotions = () => {
  closeMobileMenu();

  const scrollToPromos = () => {
    const el = document.querySelector('.promotions') as HTMLElement | null;
    if (el) {
      // ajustar por altura del header fijo
      const navH = parseInt(getComputedStyle(document.documentElement).getPropertyValue('--navbar-height')) || 76;
      const top = el.getBoundingClientRect().top + window.pageYOffset - navH - 8;
      window.scrollTo({ top, behavior: 'smooth' });
    }
  };

  if (currentRoute.path === '/') {
    setTimeout(scrollToPromos, 80);
  } else {
    router.push({ path: '/' }).then(() => setTimeout(scrollToPromos, 140));
  }
}

const checkAuthStatus = () => {
  isLoggedIn.value = authService.isAuthenticated();
  if (isLoggedIn.value) {
    const currentUser = authService.getCurrentUser();
    username.value = currentUser?.name || '';
  } else {
    username.value = '';
  }
};

const logout = () => {
  authService.logout();
  isLoggedIn.value = false;
  username.value = '';
  // Usar replace para no dejar historial que permita volver a la página autenticada
  router.replace({ name: 'home' });
};

const handleMobileLogout = () => {
  closeMobileMenu();
  logout();
};

onMounted(() => {
  checkAuthStatus();
});

const route = useRoute();
watch(route, () => {
  checkAuthStatus();
});
</script>

<style scoped>
.navbar {
  width: 100%;
  position: fixed;
  top: 0;
  left: 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  background: #ffffff;
  box-shadow: none;
  border-bottom: 1px solid rgba(0,0,0,0.06);
}

.navbar-top {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 0px clamp(16px, 4vw, 36px);
}

.top-left {
  display: flex;
  align-items: center;
  gap: 12px;
}

.brand-container.small {
  display: flex;
  align-items: center;
  gap: 10px;
}

.creative-logo.small .logo-circle {
  width: 44px;
  height: 44px;
}

.brand-text {
  font-weight: 800;
  font-size: 18px;
  color: #111827;
  letter-spacing: 0.6px;
}

.site-logo {
  height: 84px;
  width: auto;
  display: block;
  object-fit: contain;
  margin-right: 8px;
  cursor: pointer;
}

.contact-inline {
  display: flex;
  gap: 12px;
  align-items: center;
  margin-left: 12px;
  color: #374151;
  font-weight: 600;
}

.contact-inline a { text-decoration: none; color: inherit; display:flex; gap:8px; align-items:center }

.top-center { flex: 1; display:flex; justify-content:center }

.search-form { display:flex; align-items:center; gap:8px; width:100%; max-width:360px }
.search-input { width:100%; padding:8px 12px; border-radius:999px; border:1px solid rgba(0,0,0,0.08); background:#fff; font-size:14px }
.search-btn { background:#111827; color:#fff; border:none; padding:8px 10px; border-radius:999px; display:inline-flex; align-items:center; justify-content:center }

.top-right { display:flex; align-items:center; gap:12px }
.login-link {
  color:#111827;
  text-decoration:none;
  font-weight:700;
  display:inline-flex;
  align-items:center;
  gap:8px;
  min-height:44px;
  padding:0 16px;
  border-radius:999px;
  border:1px solid rgba(220, 38, 38, 0.18);
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255,248,248,0.98) 100%);
  box-shadow: 0 10px 24px rgba(15, 23, 42, 0.06);
  transition: transform 0.2s ease, box-shadow 0.2s ease, border-color 0.2s ease;
}
.login-link:hover {
  transform: translateY(-1px);
  border-color: rgba(220, 38, 38, 0.32);
  box-shadow: 0 14px 28px rgba(15, 23, 42, 0.1);
}
.login-link .icon-lock { stroke:#dc2626 }
.desktop-controls {
  display:flex;
  align-items:center;
  gap:10px;
  flex-wrap: wrap;
  justify-content: flex-end;
  padding:8px;
  box-shadow: 0 12px 30px rgba(15, 23, 42, 0.08);
  backdrop-filter: blur(12px);
}
.btn-register { background:#ef2330; color:#fff; padding:8px 14px; border-radius:8px; text-decoration:none; font-weight:700 }

.cart-btn { display:flex; align-items:center; gap:8px; cursor:pointer }
.cart-count { background:#ef2330; color:#fff; font-size:12px; padding:2px 6px; border-radius:10px }

.phone-link { display:inline-flex; align-items:center; gap:8px; text-decoration:none; color:#111827; font-weight:700 }
.phone-link .icon-phone { color:#111827 }
.whatsapp-cta { display:inline-flex; align-items:center; gap:8px; padding:6px 10px; background:#25D366; color:#fff; border-radius:8px; text-decoration:none; font-weight:700 }
.whatsapp-cta .icon-whatsapp { width:18px; height:18px; display:block }
.icon-lock, .icon-phone, .icon-whatsapp { width:18px; height:18px }

/* Material Symbols baseline */
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
  font-size: 18px;
  line-height: 1;
  display: inline-block;
  vertical-align: middle;
}

.categorybar { border-top: 1px solid rgba(0,0,0,0.04); background: #f3f3f3 }
.nav-menu { display:flex; gap:18px; justify-content:center; padding:0px 20px }
.nav-link { color:#374151; text-decoration:none; font-weight:600; font-size:14px }
.nav-link.offers { color:#ef2330; font-weight:800 }

.hamburger-menu { display:none; color: #1a1a1a; }

.mobile-search-btn { display: none !important; }

@media (max-width: 900px) {
  .top-center { display:none }
  .desktop-controls { display:none }
  .nav-menu { overflow-x:auto; padding:8px 12px; gap:12px }
  .hamburger-menu { display:flex }
}

/* Logo y marca */
.brand-container {
  display: flex;
  align-items: center;
  gap: 12px;
}

/* Logo creativo */
.creative-logo {
  position: relative;
  width: 50px;
  height: 50px;
}

.logo-circle {
  width: 50px;
  height: 50px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  position: relative;
  overflow: hidden;
  border: 2px solid rgba(255, 255, 255, 0.2);
  box-shadow: 0 6px 20px rgba(220, 38, 38, 0.5),
              0 0 30px rgba(220, 38, 38, 0.3),
              inset 0 2px 8px rgba(255, 255, 255, 0.2);
  animation: logoFloat 4s ease-in-out infinite;
  transition: all 0.3s ease;
}

.logo-circle::before {
  content: '';
  position: absolute;
  inset: -3px;
  background: linear-gradient(135deg, var(--primary-red) 0%, #a10000 100%);
  border-radius: 50%;
  z-index: 0;
}

.logo-circle::after {
  content: '';
  position: absolute;
  inset: 3px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.8) 0%, rgba(161, 0, 0, 0.9) 100%);
  border-radius: 50%;
  z-index: 1;
}

.logo-letter {
  position: relative;
  z-index: 2;
  font-weight: 900;
  font-size: 14px;
  color: var(--white);
  text-shadow: 0 2px 8px rgba(0, 0, 0, 0.5),
               0 0 20px rgba(255, 255, 255, 0.3);
  letter-spacing: -1px;
}

.logo-letter:first-child::after {
  content: '•';
  margin: 0 1px;
  font-size: 8px;
  opacity: 0.6;
}

.logo-glow {
  position: absolute;
  inset: -10px;
  background: radial-gradient(circle, rgba(220, 38, 38, 0.4) 0%, transparent 70%);
  border-radius: 50%;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.3s ease;
}

.creative-logo:hover .logo-circle {
  transform: scale(1.08);
  box-shadow: 0 8px 24px rgba(220, 38, 38, 0.6),
              0 0 40px rgba(220, 38, 38, 0.4),
              inset 0 2px 12px rgba(255, 255, 255, 0.3);
}

.creative-logo:hover .logo-glow {
  opacity: 1;
}

@keyframes logoFloat {
  0%, 100% { transform: translateY(0px) rotate(0deg); }
  50% { transform: translateY(-4px) rotate(2deg); }
}



.brand-info {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  gap: 2px;
}

.brand-title {
  font-size: 22px;
  font-weight: 900;
  line-height: 1;
  margin: 0;
  letter-spacing: 1.5px;
  text-transform: uppercase;
}

.brand-title .highlight {
  background: linear-gradient(135deg, var(--white) 0%, var(--primary-red) 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  background-clip: text;
  text-shadow: 0 2px 8px rgba(220, 38, 38, 0.3);
  filter: drop-shadow(0 2px 8px rgba(220, 38, 38, 0.3));
}

.brand-tagline {
  font-size: 10px;
  color: rgba(255, 255, 255, 0.6);
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 1px;
}

.brand-subtitle {
  font-size: 12px;
  color: #94a3b8;
  font-weight: 500;
  line-height: 1;
  margin: 0;
}

/* Navegación principal */
.nav-menu {
  display: flex;
  align-items: center;
  gap: 10px;
  margin-left: auto;
  margin-right: 30px;
}

.nav-link {
  color: #374151;
  text-decoration: none;
  font-weight: 600;
  font-size: 15px;
  padding: 9px 14px;
  border-radius: 8px;
  transition: none;
  position: relative;
  letter-spacing: 0.3px;
}

.nav-link::after {
  content: '';
  position: absolute;
  bottom: 4px;
  left: 50%;
  transform: translateX(-50%);
  width: 0;
  height: 2px;
  background: var(--primary-red);
  transition: width 0.2s ease;
}

.nav-link:hover {
  color: #111827;
  background-color: rgba(0,0,0,0.04);
}

.nav-link:hover::after {
  width: 70%;
}

.nav-link.active {
  color: var(--primary-red);
  background: rgba(239,35,48,0.08);
}

.nav-link.active::after {
  width: 70%;
}

.share-btn {
  background: linear-gradient(135deg, #22d3ee 0%, #0891b2 100%);
  color: #ffffff !important;
  font-weight: 600;
  box-shadow: 0 2px 10px rgba(34, 211, 238, 0.3);
}

.share-btn:hover {
  background: linear-gradient(135deg, #0891b2 0%, #0e7490 100%);
  box-shadow: 0 4px 15px rgba(34, 211, 238, 0.5);
  transform: translateY(-2px);
}

/* Controles de usuario */
.nav-controls {
  display: flex;
  align-items: center;
  gap: 15px;
}

.btn {
  padding: 10px 20px;
  border-radius: 8px;
  text-decoration: none;
  font-weight: 600;
  font-size: 14px;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  display: inline-flex;
  align-items: center;
  justify-content: center;
}

.access-btn {
  background: linear-gradient(135deg, var(--primary-red) 0%, var(--dark-red) 100%);
  color: #ffffff;
  box-shadow: 0 4px 16px rgba(220, 38, 38, 0.35);
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.5px;
}

.access-btn:hover {
  background: linear-gradient(135deg, var(--dark-red) 0%, var(--tertiary-red) 100%);
  box-shadow: 0 6px 24px rgba(220, 38, 38, 0.5);
  transform: translateY(-3px);
}

.logout-btn {
  background: linear-gradient(135deg, rgba(255,255,255,0.98) 0%, rgba(255, 236, 236, 0.96) 100%);
  color: #dc2626;
  border: 1px solid rgba(220, 38, 38, 0.2);
}

.logout-btn:hover {
  background: linear-gradient(135deg, #dc2626 0%, #b91c1c 100%);
  color: #ffffff;
  border-color: rgba(220, 38, 38, 0.45);
  transform: translateY(-2px);
}

.admin-btn {
  background: linear-gradient(135deg, #111111 0%, #1f1f1f 100%);
  color: #ffffff;
  box-shadow: 0 10px 22px rgba(0, 0, 0, 0.28);
  border: 1px solid rgba(220, 38, 38, 0.35);
  font-weight: 800;
}

.admin-btn:hover {
  background: linear-gradient(135deg, #0a0a0a 0%, #111111 100%);
  box-shadow: 0 14px 28px rgba(220, 38, 38, 0.22);
  transform: translateY(-2px);
  border-color: rgba(220, 38, 38, 0.55);
}

.purchases-btn {
  background: var(--brand-accent-gradient);
  color: #ffffff;
  box-shadow: 0 2px 10px var(--brand-accent-glow);
}

.purchases-btn:hover {
  background: var(--brand-accent-gradient);
  filter: brightness(1.1);
  box-shadow: 0 4px 15px var(--brand-accent-glow);
  transform: translateY(-2px);
}

.user-greeting {
  color: #111827;
  font-weight: 800;
  font-size: 14px;
  padding: 0 16px;
  min-height: 44px;
  display: inline-flex;
  align-items: center;
  border-radius: 999px;
  background: linear-gradient(135deg, rgba(220, 38, 38, 0.12) 0%, rgba(255, 255, 255, 0.96) 100%);
  border: 1px solid rgba(220, 38, 38, 0.18);
  letter-spacing: 0.2px;
  box-shadow: inset 0 1px 0 rgba(255,255,255,0.7);
}

/* Menu hamburguesa */
.hamburger-menu {
  display: none;
  flex-direction: column;
  width: 30px;
  height: 30px;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0;
  justify-content: space-around;
  align-items: center;
  z-index: 1001;
}

.hamburger-menu span {
  display: block;
  height: 3px;
  width: 100%;
  background-color: var(--brand-primary-contrast);
  border-radius: 3px;
  transition: all 0.3s ease;
}

.hamburger-menu.active span:nth-child(1) {
  transform: rotate(45deg) translate(8px, 8px);
}

.hamburger-menu.active span:nth-child(2) {
  opacity: 0;
}

.hamburger-menu.active span:nth-child(3) {
  transform: rotate(-45deg) translate(7px, -6px);
}

.mobile-menu {
  display: none;
  position: fixed;
  top: var(--navbar-height, 70px);
  left: 0;
  width: 100%;
  height: calc(100vh - var(--navbar-height, 70px));
  background: var(--brand-gradient);
  transform: translateX(-100%);
  transition: transform 0.3s ease;
  z-index: 999;
  overflow-y: auto;
}

.mobile-menu.active {
  transform: translateX(0);
}

.mobile-menu-content {
  padding: 30px 20px;
  display: flex;
  flex-direction: column;
  gap: 30px;
}

.mobile-nav-links {
  display: flex;
  flex-direction: column;
  gap: 15px;
}

.mobile-categories {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.mobile-categories-title {
  color: #f1f5f9;
  font-size: 14px;
  font-weight: 800;
  margin: 0 0 6px;
  text-align: center;
}

.mobile-categories-list { display:flex; flex-direction:column; gap:10px }
.mobile-categories-list .mobile-link { padding: 12px 16px; font-size: 16px }

.mobile-link {
  color: #e2e8f0;
  text-decoration: none;
  padding: 15px 20px;
  font-size: 18px;
  font-weight: 500;
  border-radius: 12px;
  transition: all 0.3s ease;
  text-align: center;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-link:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #ffffff;
  transform: translateY(-2px);
}

.mobile-controls {
  display: flex;
  flex-direction: column;
  gap: 15px;
  padding-top: 20px;
  border-top: 1px solid rgba(255, 255, 255, 0.1);
}

.mobile-btn {
  padding: 15px 20px;
  border-radius: 12px;
  text-decoration: none;
  font-weight: 600;
  font-size: 16px;
  text-align: center;
  transition: all 0.3s ease;
  border: none;
  cursor: pointer;
  width: 100%;
  font-family: inherit;
}

.mobile-btn.access-btn {
  background: linear-gradient(135deg, #10b981 0%, #059669 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(16, 185, 129, 0.3);
}

.mobile-btn.logout-btn {
  background: rgba(248, 113, 113, 0.1);
  color: #f87171;
  border: 1px solid rgba(248, 113, 113, 0.3);
}

.mobile-btn.admin-btn {
  background: linear-gradient(135deg, #06b6d4 0%, #0891b2 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(6, 182, 212, 0.3);
}

.mobile-btn.purchases-btn {
  background: linear-gradient(135deg, #60a5fa 0%, #3b82f6 100%);
  color: #ffffff;
  box-shadow: 0 4px 15px rgba(96, 165, 250, 0.3);
}

.mobile-user-greeting {
  color: #e2e8f0;
  text-align: center;
  padding: 15px 20px;
  font-weight: 600;
  font-size: 16px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  backdrop-filter: blur(10px);
}

/* Responsive */
@media (max-width: 768px) {
  .navbar {
    height: var(--navbar-height, 70px);
    padding: 0 20px;
  }

  .desktop-nav {
    display: none;
  }

  .hamburger-menu {
    display: flex;
  }

  .mobile-menu {
    display: block;
  }

  .brand-title {
    font-size: 18px;
  }

  .brand-logo {
    width: 42px;
    height: 42px;
  }

  .brand-subtitle {
    font-size: 11px;
  }

  .logo-circle {
    width: 45px;
    height: 45px;
    font-size: 20px;
  }
}

/* Mobile header adjustments: hide categorybar and compact contact */
@media (max-width: 900px) {
  .categorybar { display: none; }
  .contact-inline { display: none; }
  .top-center { display: none; }
  .navbar { height: var(--navbar-height, 76px); }
  .top-left { gap: 8px; }

  /* Layout: logo a la izquierda; controles (carrito + hamburguesa) a la derecha */
  .navbar-top { justify-content: flex-start; position: relative; padding: 10px 12px; }

  /* Logo alineado a la izquierda */
  .site-logo { height: 48px; margin: 0; display: block; }

  /* Carrito, búsqueda y hamburguesa en la esquina derecha */
  .cart-btn { position: absolute; right: 56px; top: 20px; margin: 0; z-index: 1002; }
  .mobile-search-btn { display: none; }
  .hamburger-menu { display: flex; position: absolute; right: 12px; top: 20px; z-index: 1002; }

  /* Color de las líneas de la hamburguesa (negro por defecto) */
  .hamburger-menu span { background-color: #000 !important; }

  /* Mostrar el botón de búsqueda en móvil y ocultar otros controles extra */
  .mobile-search-btn { display: flex !important; position: absolute; right: 116px; top: 18px; z-index: 1002; background: #111827; border: none; padding: 6px; align-items: center; justify-content: center; width: 38px; height: 38px; border-radius: 999px; }
  .mobile-search-btn svg { stroke: #fff; width: 18px; height: 18px }
  .top-right > *:not(.cart-btn):not(.mobile-search-btn) { display: none; }

  /* Asegurar suficiente padding para el logo y evitar solapamientos */
  .navbar-top { padding-left: 12px; padding-right: 120px; }
}

@media (max-width: 480px) {
  .site-logo { height: 55px; }
  .search-input { max-width: 200px }
  .material-symbols-outlined { font-size: 28px; }
}

@media (max-width: 480px) {
  .navbar {
    padding: 0 15px;
  }

  .brand-container {
    gap: 10px;
  }

  .brand-title {
    font-size: 16px;
  }

  .brand-logo {
    width: 38px;
    height: 38px;
  }

  .logo-circle {
    width: 40px;
    height: 40px;
    font-size: 18px;
  }
}

/* Mobile search overlay styles */
.mobile-search-overlay {
  position: fixed;
  top: var(--navbar-height, 76px);
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0,0,0,0.55);
  z-index: 1003;
  display: flex;
  align-items: flex-start;
  justify-content: center;
  padding: 18px;
}
.mobile-search-box {
  width: 100%;
  max-width: 720px;
  background: #fff;
  border-radius: 12px;
  padding: 10px;
  display: flex;
  gap: 8px;
  align-items: center;
}
.mobile-search-input { flex:1; padding:10px 12px; border-radius:8px; border:1px solid #e6e6e6; font-size:16px }
.mobile-search-submit { background: var(--primary-red); color:#fff; border:none; padding:10px 14px; border-radius:8px }
.mobile-search-close { background:transparent; border:none; font-size:18px; padding:6px 8px }

/* Quitar subrayado del link principal */
.link-navbar {
  text-decoration: none !important;
}

/* Estilos para enlaces activos */
.nav-link.active,
.mobile-link.active {
  color: #0071e3;
  font-weight: 600;
  position: relative;
}

.nav-link.active::after,
.mobile-link.active::after {
  content: '';
  position: absolute;
  bottom: -4px;
  left: 0;
  width: 100%;
  height: 2px;
  background-color: #0071e3;
  border-radius: 2px;
  animation: fadeIn 0.3s ease-in-out;
}

@keyframes fadeIn {
  from {
    padding: 0 18px;
    border-radius: 999px;
  }
  to {
    opacity: 1;
    transform: scaleX(1);
  }
}

.link-navbar:hover {
  text-decoration: none !important;
    min-height: 44px;
    white-space: nowrap;
    line-height: 1;
}
</style>

<!-- Global styles for in-page search highlights -->
<style>
  mark.app-search-mark { background: #ffd54f; color: #000; padding: 0 2px; border-radius: 2px; }

  /* Ocultar carrito flotante en pantallas móviles */
  @media (max-width: 900px) {
    .floating-cart { display: none !important; }
  }
</style>
