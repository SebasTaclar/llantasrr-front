<template>
  <!-- WhatsApp flotante (ahora a la derecha), icono SVG sin fondo blanco -->
  <div class="floating-whatsapp">
    <a :href="whatsappLink" target="_blank" rel="noopener" class="social-btn whatsapp" aria-label="WhatsApp">
      <svg class="social-icon" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="32" height="32" aria-hidden="true">
        <path fill="#ffffff" d="M20.52 3.48A11.89 11.89 0 0 0 12 0C5.373 0 0 5.373 0 12c0 2.11.55 4.08 1.6 5.84L0 24l6.47-1.66A11.93 11.93 0 0 0 12 24c6.627 0 12-5.373 12-12 0-3.2-1.25-6.14-3.48-8.52zM12 21.5c-1.48 0-2.93-.4-4.2-1.16l-.3-.17-3.82.98.98-3.73-.2-.33A9.5 9.5 0 0 1 2.5 12 9.5 9.5 0 0 1 12 2.5c5.24 0 9.5 4.26 9.5 9.5S17.24 21.5 12 21.5zM16 14.2c-.3-.15-1.77-.87-2.04-.97-.27-.1-.46-.15-.65.15-.19.3-.72.97-.88 1.17-.16.19-.32.22-.6.07-.27-.15-1.14-.42-2.17-1.34-.8-.71-1.34-1.6-1.5-1.87-.16-.27-.02-.41.12-.56.12-.12.27-.32.4-.48.13-.16.17-.27.27-.45.1-.18.05-.34-.03-.49-.08-.15-.65-1.57-.89-2.16-.23-.57-.47-.49-.65-.5l-.55-.01c-.19 0-.5.07-.77.34-.28.27-1.07 1.05-1.07 2.56 0 1.51 1.1 2.97 1.25 3.18.15.22 2.15 3.35 5.22 4.7 3.07 1.36 3.07 0.91 3.62.85.55-.06 1.77-.72 2.02-1.41.25-.69.25-1.28.17-1.41-.08-.13-.28-.2-.57-.36z"/>
      </svg>
      <span class="social-tooltip right">WhatsApp</span>
    </a>
  </div>
</template>

<script setup lang="ts">
// Número en formato internacional (sin '+') — actualizado a +57 3138936332
const rawNumber = '573138936332'
// Normaliza a solo dígitos
const whatsappNumber = rawNumber.replace(/[^\d]/g, '')

// Validación mínima: debe empezar por 57 y tener al menos 12 dígitos (57 + 10)
const isValidWhatsAppNumber = /^57\d{10}$/.test(whatsappNumber)

const defaultMessage = 'Hola! Me interesa una llanta en CASA COMERCIAL DE LA LLANTA RR. ¿Me pueden brindar más información?'
// Endpoint alternativo más tolerante que wa.me
const whatsappLink = isValidWhatsAppNumber
  ? `https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${encodeURIComponent(defaultMessage)}`
  : '#'


defineOptions({ name: 'SocialFloating' })
</script>

<style scoped>
/* === WHATSAPP FLOTANTE IZQUIERDA === */
.floating-whatsapp {
  position: fixed;
  bottom: 20px;
  right: 20px;
  left: auto;
  z-index: 1000;
}

.floating-whatsapp .social-btn.whatsapp {
  background: #25d366;
  border: 2px solid #25d366;
  opacity: 1 !important;
  box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
}

.floating-whatsapp .social-btn.whatsapp:hover {
  background: #20b858;
  border-color: #20b858;
  box-shadow: 0 12px 35px rgba(37, 211, 102, 0.6);
  transform: scale(1.15);
}

.floating-whatsapp .social-icon {
  opacity: 1 !important;
  filter: none !important;
}

/* === REDES SOCIALES FLOTANTES DERECHA === */
.floating-social {
  position: fixed;
  bottom: 20px;
  right: 20px;
  display: flex;
  flex-direction: column;
  gap: 15px;
  z-index: 1000;
}

.social-btn {
  position: relative;
  width: 60px;
  height: 60px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  text-decoration: none;
  transition: all 0.4s cubic-bezier(0.68, -0.55, 0.265, 1.55);
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.05);
  backdrop-filter: blur(10px);
  background: transparent;
  border: 2px solid rgba(255, 255, 255, 0.05);
  opacity: 0.15;
}

.social-btn:hover {
  opacity: 1 !important;
  transform: scale(1.2) rotate(5deg);
  box-shadow: 0 12px 35px rgba(0, 0, 0, 0.4);
}

/* Facebook */
.social-btn.facebook:hover {
  background: #1877F2;
  border-color: #1877F2;
  box-shadow: 0 12px 35px rgba(24, 119, 242, 0.6);
}

.social-btn.facebook .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.facebook:hover .social-icon {
  color: #ffffff;
}

/* Instagram */
.social-btn.instagram:hover {
  background: linear-gradient(45deg, #F58529, #DD2A7B, #8134AF, #515BD4);
  border-color: #E4405F;
  box-shadow: 0 12px 35px rgba(228, 64, 95, 0.6);
}

.social-btn.instagram .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.instagram:hover .social-icon {
  color: #ffffff;
}

/* TikTok */
.social-btn.tiktok:hover {
  background: #000000;
  border-color: #00f2ea;
  box-shadow: 0 12px 35px rgba(0, 242, 234, 0.6);
}

.social-btn.tiktok .social-icon {
  color: rgba(255, 255, 255, 0.5);
}

.social-btn.tiktok:hover .social-icon {
  color: #00f2ea;
}

.social-icon {
  width: 32px;
  height: 32px;
  transition: all 0.4s ease;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
}

.social-btn:hover .social-icon {
  transform: scale(1.1);
  filter: drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3));
}

/* Tooltips */
.social-tooltip {
  position: absolute;
  top: 50%;
  transform: translateY(-50%);
  background: rgba(0, 0, 0, 0.9);
  color: white;
  padding: 8px 14px;
  border-radius: 8px;
  font-size: 13px;
  font-weight: 600;
  white-space: nowrap;
  opacity: 0;
  visibility: hidden;
  transition: all 0.3s ease;
  backdrop-filter: blur(10px);
  pointer-events: none;
}

/* Tooltip para redes sociales (derecha) */
.floating-social .social-tooltip {
  right: 70px;
}

.floating-social .social-tooltip::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

/* Tooltip para WhatsApp (izquierda) */
.floating-whatsapp .social-tooltip.right {
  right: 70px;
  left: auto;
}

.floating-whatsapp .social-tooltip.right::after {
  content: '';
  position: absolute;
  left: 100%;
  top: 50%;
  transform: translateY(-50%);
  border: 6px solid transparent;
  border-left-color: rgba(0, 0, 0, 0.9);
}

.social-btn:hover .social-tooltip {
  opacity: 1;
  visibility: visible;
}

.floating-social .social-btn:hover .social-tooltip {
  transform: translateY(-50%) translateX(-5px);
}

.floating-whatsapp .social-btn:hover .social-tooltip {
  transform: translateY(-50%) translateX(5px);
}

/* Animaciones de entrada */
.floating-social .social-btn {
  animation: slideInRight 0.6s ease;
  animation-fill-mode: both;
}

.floating-whatsapp .social-btn {
  animation: slideInRight 0.6s ease;
  animation-fill-mode: both;
}

.social-btn:nth-child(1) {
  animation-delay: 0.1s;
}

.social-btn:nth-child(2) {
  animation-delay: 0.2s;
}

.social-btn:nth-child(3) {
  animation-delay: 0.3s;
}

@keyframes slideInRight {
  from {
    transform: translateX(100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

@keyframes slideInLeft {
  from {
    transform: translateX(-100px);
    opacity: 0;
  }
  to {
    transform: translateX(0);
    opacity: 1;
  }
}

/* Efecto de pulso sutil en WhatsApp */
@keyframes pulse {
  0%, 100% {
    box-shadow: 0 8px 24px rgba(37, 211, 102, 0.4);
  }
  50% {
    box-shadow: 0 8px 30px rgba(37, 211, 102, 0.6);
  }
}

.floating-whatsapp .social-btn.whatsapp {
  animation: slideInRight 0.6s ease, pulse 2s ease-in-out infinite;
}

/* Responsivo */
@media (max-width: 768px) {
  .floating-social,
  .floating-whatsapp {
    bottom: 15px;
  }

  .floating-social {
    right: 15px;
    gap: 12px;
  }

  .floating-whatsapp {
    right: 15px;
    left: auto;
  }

  .social-btn {
    width: 52px;
    height: 52px;
  }

  .social-icon {
    width: 28px;
    height: 28px;
  }

  .social-tooltip {
    font-size: 12px;
    padding: 6px 10px;
  }

  .floating-social .social-tooltip {
    right: 62px;
  }

  .floating-whatsapp .social-tooltip.right {
    right: 62px;
  }
}

@media (max-width: 480px) {
  .floating-social,
  .floating-whatsapp {
    bottom: 10px;
  }

  .floating-social {
    right: 10px;
    gap: 10px;
  }

  .floating-whatsapp {
    right: 10px;
    left: auto;
  }

  .social-btn {
    width: 48px;
    height: 48px;
  }

  .social-icon {
    width: 26px;
    height: 26px;
  }
}
</style>
