<template>
  <section class="how-section" aria-label="Cómo comprar">
    <div class="how-inner">
      <div class="how-left">
        <h2 class="how-title">COMO<br/>COMPRAR</h2>
        <p class="how-sub">Te asesoramos, compras seguras.</p>
      </div>

      <div class="how-right">
        <div class="steps-line" aria-hidden="true">
          <div class="line" />
          <div class="step" style="left:20%"><span>01</span></div>
          <div class="step" style="left:50%"><span>02</span></div>
          <div class="step" style="left:80%"><span>03</span></div>
        </div>

        <div class="how-cards">
          <article class="how-card">
            <h3>ENCUENTRA<br/>TUS LLANTAS</h3>
            <p>Encuentra tus llantas: Por medida, categoría o marca</p>
          </article>

          <article class="how-card">
            <h3>ENVÍO GRATIS POR COMPRA DE MÁS DE DOS ARTICULOS</h3>
            <p>Envíos a toda Colombia.</p>
          </article>

          <article class="how-card">
            <h3>INSTALAR<br/>GRATIS</h3>
            <p>Si eliges recibir tus llantas en una de nuestras servitecas aliadas.</p>
          </article>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup lang="ts">
defineOptions({ name: 'QueTapsoImage' })
</script>

<style scoped>
:root { --red: #dc2626 }
.how-section {
  background: #3a3737d8;
  color: #fff;
  padding: 56px 0;
}
.how-inner {
  max-width: 1200px;
  margin: 0 auto;
  padding: 0 20px;
  display: grid;
  grid-template-columns: 300px 1fr;
  gap: 40px;
  align-items: start;
}
.how-left {
  text-align: left;
}
.how-title {
  font-size: 35px;
  line-height: 0.95;
  margin: 0 0 12px 0;
  font-weight: 900;
  color: #fff;
}
.how-sub {
  color: rgba(255,255,255,0.6);
  margin: 0;
  font-size: 0.95rem;
}
.how-right { position: relative }
.steps-line {
  position: relative;
  height: 56px;
  margin-bottom: 18px;
}
.steps-line .line {
  position: absolute;
  left: 0; right: 10%; top: 50%;
  border-top: 1px dashed rgba(250, 250, 250, 0.918);
  transform: translateY(-50%);
}
.steps-line .step {
  position: absolute;
  top: 0;
  transform: translateX(-50%);
  width: 44px;
  height: 44px;
  border-radius: 50%;
  background: #dc2626;
  display: flex;
  align-items: center;
  justify-content: center;
  color: #fff;
  font-weight: 800;
  box-shadow: 0 6px 18px rgba(0,0,0,0.45);
}
.steps-line .step span { font-size: 0.95rem }

.how-cards {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 20px;
}
.how-card {
  background: linear-gradient(135deg, rgba(32, 32, 32, 0.829), rgba(32, 31, 31, 0.603));
  border-radius: 10px;
  padding: 22px;
  min-height: 140px;
  box-shadow: 0 12px 40px rgba(0,0,0,0.5);
  border: 1px solid rgba(255,255,255,0.03);
}
.how-card h3 {
  margin: 0 0 8px 0;
  font-size: 1.05rem;
  line-height: 1.1;
  color: #fff;
  font-weight: 800;
  text-transform: uppercase;
}
.how-card p {
  margin: 0;
  color: rgba(255,255,255,0.6);
  font-size: 0.95rem;
}

/* Responsive */
@media (max-width: 980px) {
  .how-inner {
    grid-template-columns: 1fr;
    gap: 20px;
    padding: 0 16px;
  }
  .how-left { text-align: center }
  .how-title { font-size: 34px; line-height: 1 }

  /* Steps: hide the long dashed line and show compact step dots centered */
  .steps-line { margin-top: 12px; text-align: center; display:flex; justify-content:center; gap:12px; align-items:center }
  .steps-line .line { display: none }
  .steps-line .step { position: static; transform: none; margin: 0; width: 40px; height: 40px; display: inline-flex }

  /* Cards: 2 per row on narrow screens, compact spacing */
  .how-cards { grid-template-columns: repeat(2, 1fr); gap: 12px }
  .how-card { padding: 18px; min-height: auto }
  .how-card h3 { font-size: 1rem }
  .how-card p { font-size: 0.92rem; color: rgba(255,255,255,0.78) }
}

@media (max-width: 520px) {
  .how-inner { padding: 0 12px; gap: 12px }
  .how-title { font-size: 28px }
  .how-cards { grid-template-columns: 1fr; gap: 10px }
  .how-card { padding: 14px }
  .steps-line { gap: 8px }
  .steps-line .step { width: 36px; height: 36px; }
}

</style>
