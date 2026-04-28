<template>
  <section class="contact-section-bg">
    <div class="contact-overlay"></div>
    <div class="container">
      <div class="cta-inner">
        <div class="cta-text">
          <h1>¿No sabes qué llanta elegir para tu moto o carro?</h1>
          <p>Habla con un asesor especializado y recibe recomendación personalizada.</p>
        </div>

      </div>
    </div>
    <div class="contact-columns">
      <!-- Dirección -->
      <div class="contact-col">
        <div class="contact-icon-bg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none"><path d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7zm0 9.5A2.5 2.5 0 1 1 14.5 9 2.5 2.5 0 0 1 12 11.5z" fill="#b91c1c"/></svg>
        </div>
        <div class="contact-title">Dirección</div>
        <div class="contact-text">Cl. 60g Sur #18b-6<br><span class="contact-bold">Bogotá, Cundinamarca</span></div>
      </div>
      <!-- Teléfonos -->
      <div class="contact-col">
        <div class="contact-icon-bg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none"><path d="M6.62 10.79a15.05 15.05 0 0 0 6.59 6.59l2.2-2.2a1 1 0 0 1 1-.24 11.36 11.36 0 0 0 3.58.57 1 1 0 0 1 1 1V20a1 1 0 0 1-1 1A17 17 0 0 1 3 4a1 1 0 0 1 1-1h3.5a1 1 0 0 1 1 1 11.36 11.36 0 0 0 .57 3.58 1 1 0 0 1-.24 1z" fill="#b91c1c"/></svg>
        </div>
        <div class="contact-title">Teléfonos</div>
        <div class="contact-text">
          <a href="tel:+573138936332" class="contact-link">313 893 6332</a><br>
          <a href="https://wa.me/573138936332" class="contact-link whatsapp-link" target="_blank" rel="noopener">
            <svg viewBox="0 0 32 32" width="18" height="18"><path fill="#25D366" d="M16 3A13 13 0 0 0 3 16a12.9 12.9 0 0 0 1.8 6.6L3 29l6.6-1.7A13 13 0 1 0 16 3zm7.5 18.5c-.3.8-1.5 1.5-2.1 1.6-.6.1-1.3.2-2.1-.1-.5-.2-1.2-.4-2.1-.8-3.7-1.6-6.1-5.4-6.3-5.7-.2-.3-1.5-2-1.5-3.8 0-1.7.9-2.5 1.2-2.8.3-.3.7-.4 1-.4.2 0 .5 0 .7.1.2.1.5.8.7 1.1.2.3.3.5.3.7 0 .2-.1.4-.2.6-.1.2-.2.4-.3.5-.1.1-.2.2-.1.4.1.2.5.8 1.1 1.3.8.7 1.5.9 1.7 1 .2.1.3.1.5-.1.2-.2.6-.7.8-.9.2-.2.4-.2.6-.1.2.1 1.2.6 1.4.7.2.1.3.1.4.2.1.1.1.2.1.4s-.2.7-.4 1c-.2.3-.4.5-.6.7z"/></svg>
            313 893 6332
          </a>
        </div>
      </div>
      <!-- Horario -->
      <div class="contact-col">
        <div class="contact-icon-bg">
          <svg viewBox="0 0 24 24" width="48" height="48" fill="none"><path d="M12 8v5l4 2" stroke="#b91c1c" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"/><circle cx="12" cy="12" r="9" stroke="#b91c1c" stroke-width="2"/></svg>
        </div>
        <div class="contact-title">Horario de atención</div>
        <div class="contact-text">
          Lunes a viernes 08:00 a 18:00 h<br>
          Sábado de 08:00 a 15:00 h – Dom. cerrado
        </div>
      </div>
    </div>

    <div class="map-wrapper">
      <iframe
        title="Ubicación - Cl. 60g Sur #18b-6, Bogotá"
        src="https://www.google.com/maps?q=Cl.+60g+Sur+%2318b-6,+Bogot%C3%A1,+Cundinamarca&output=embed"
        width="100%"
        height="220"
        style="border:0;"
        loading="lazy"
        referrerpolicy="no-referrer-when-downgrade"></iframe>
    </div>
  </section>
</template>

<style scoped>
.contact-section-bg {
  position: relative;
  background: #181818 url('https://st.depositphotos.com/8000700/56295/i/450/depositphotos_562955334-stock-photo-new-car-tires-group-road.jpg') center/cover no-repeat;
  padding: 20px 0 5px 0;
  min-height: 320px;
  z-index: 1;
}
.contact-overlay {
  position: absolute;
  inset: 0;
  background: rgba(15, 15, 15, 0.705);
  z-index: 2;
}
.contact-columns {
  position: relative;
  z-index: 3;
  display: flex;
  justify-content: center;
  align-items: flex-start;
  gap: 64px;
  max-width: 1100px;
  margin: 0 auto;
  padding: 0 24px;
}
.contact-col {
  display: flex;
  flex-direction: column;
  align-items: center;
  min-width: 260px;
  text-align: center;
}
.contact-icon-bg {
  margin-bottom: 12px;
}
.contact-title {
  color: #b91c1c;
  font-size: 1.25rem;
  font-weight: bold;
  margin-bottom: 8px;
}
.contact-text,
.contact-link {
  color: #fff;
}
.contact-text {
  font-size: 1.08rem;
  line-height: 1.5;
  margin-bottom: 0;
}
.contact-bold {
  font-weight: bold;
}
.contact-link {
  text-decoration: underline;
  font-size: 1.08rem;
  transition: color 0.2s;
}
.contact-link:hover {
  color: #FFD600;
}
.whatsapp-link {
  display: inline-flex;
  align-items: center;
  gap: 4px;
  color: #25D366 !important;
  font-weight: 600;
  margin-top: 2px;
  text-decoration: underline;
}

.btn-wp {
  background: #25d366;
  color: #fff;
  padding: 12px 18px;
  border-radius: 10px;
  border: none;
  font-weight: 800;
  cursor: pointer;
  transition: background-color 0.3s;
}
.btn-wp:hover {
  background: #1da851;
}

@media (max-width: 900px) {
  .cta-inner {
    flex-direction: column;
    text-align: center;
  }

  .contact-columns {
    flex-direction: column;
    align-items: stretch;
    gap: 32px;
    max-width: 500px;
  }
  .contact-col {
    min-width: 0;
  }
}

.container {
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 24px;
}
.cta-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
  max-width: 900px;
  padding: 18px;
  border-radius: 12px;
  box-shadow: 0 4px 6px rgba(0, 0, 0, 0.12);
  color: #fff;
  position: relative;
  z-index: 4; /* por encima del overlay */
  background: transparent; /* no opaco */
}
.cta-text {
  flex: 1;
  color: #fff;
  text-align: center;
}
.cta-button {
  flex-shrink: 0;
  margin-left: 24px;
}

.map-wrapper {
  position: relative;
  z-index: 4;
  max-width: 1700px;
  margin: 24px 0 0;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 6px 18px rgba(0,0,0,0.35);
}
.map-wrapper iframe {
  display: block;
  width: 100%;
  height:220px;
  border: 0;
}

@media (max-width: 768px) {
  .cta-inner {
    flex-direction: column;
    text-align: center;
  }
  .cta-button {
    margin-top: 16px;
    margin-left: 0;
  }
  .cta-text {
    text-align: center;
  }
}
</style>




