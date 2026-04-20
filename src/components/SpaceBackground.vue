<template>
  <div class="space-bg" aria-hidden="true">
    <!-- Nebula layers -->
    <div class="nebula nebula-1"></div>
    <div class="nebula nebula-2"></div>
    <div class="nebula nebula-3"></div>

    <!-- Stars canvas -->
    <canvas ref="starsCanvas" class="stars-canvas"></canvas>

    <!-- Big planet top right -->
    <div class="planet planet-main">
      <div class="planet-ring"></div>
      <div class="planet-surface">
        <div class="planet-stripe stripe-1"></div>
        <div class="planet-stripe stripe-2"></div>
        <div class="planet-stripe stripe-3"></div>
      </div>
    </div>

    <!-- Small planet bottom left -->
    <div class="planet planet-small"></div>

    <!-- Distant planet top left -->
    <div class="planet planet-tiny"></div>

    <!-- Rockets -->
    <div class="rocket rocket-1" ref="rocket1">
      <svg width="22" height="38" viewBox="0 0 24 40" fill="none">
        <!-- Badan roket: nose di atas -->
        <path d="M12 1 L19 20 L12 16 L5 20 Z" fill="#8b5cf6"/>
        <rect x="9" y="16" width="6" height="13" fill="#c084fc"/>
        <!-- Sayap kiri kanan -->
        <path d="M5 21 L1 34 L9 28 Z" fill="#7c3aed"/>
        <path d="M19 21 L23 34 L15 28 Z" fill="#7c3aed"/>
        <!-- Ekor / nozzle -->
        <path d="M8 29 L5 39 L12 34 L19 39 L16 29 Z" fill="#dc2626"/>
        <!-- Jendela -->
        <circle cx="12" cy="11" r="3" fill="#e2d9f3" opacity="0.9"/>
        <circle cx="12" cy="11" r="1.5" fill="#93c5fd"/>
        <!-- Api -->
        <ellipse cx="12" cy="37" rx="3.5" ry="2" fill="#f97316" opacity="0.9"/>
        <ellipse cx="12" cy="39" rx="2" ry="1.5" fill="#fbbf24" opacity="0.7"/>
      </svg>
    </div>

    <div class="rocket rocket-2" ref="rocket2">
      <svg width="16" height="28" viewBox="0 0 24 40" fill="none">
        <path d="M12 1 L19 20 L12 16 L5 20 Z" fill="#14b8a6"/>
        <rect x="9" y="16" width="6" height="13" fill="#5dcaa5"/>
        <path d="M5 21 L1 34 L9 28 Z" fill="#0f6e56"/>
        <path d="M19 21 L23 34 L15 28 Z" fill="#0f6e56"/>
        <path d="M8 29 L5 39 L12 34 L19 39 L16 29 Z" fill="#fbbf24"/>
        <circle cx="12" cy="11" r="3" fill="#e2d9f3" opacity="0.9"/>
        <circle cx="12" cy="11" r="1.5" fill="#93c5fd"/>
        <ellipse cx="12" cy="37" rx="3.5" ry="2" fill="#f97316" opacity="0.9"/>
      </svg>
    </div>

    <!-- Shooting stars -->
    <div class="meteor meteor-1"></div>
    <div class="meteor meteor-2"></div>
    <div class="meteor meteor-3"></div>

    <!-- Pixel asteroids -->
    <div class="asteroid asteroid-1"></div>
    <div class="asteroid asteroid-2"></div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const starsCanvas = ref(null)
const rocket1 = ref(null)
const rocket2 = ref(null)
let animFrame = null
let stars = []

function initStars() {
  const canvas = starsCanvas.value
  if (!canvas) return
  canvas.width = window.innerWidth
  canvas.height = window.innerHeight
  const ctx = canvas.getContext('2d')
  stars = []

  for (let i = 0; i < 200; i++) {
    stars.push({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 1.5 + 0.3,
      alpha: Math.random(),
      alphaDir: Math.random() > 0.5 ? 1 : -1,
      alphaSpeed: Math.random() * 0.008 + 0.002,
      color: Math.random() > 0.8 ? '#c084fc' : Math.random() > 0.9 ? '#fbbf24' : '#ffffff',
    })
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    stars.forEach(s => {
      s.alpha += s.alphaSpeed * s.alphaDir
      if (s.alpha >= 1) { s.alpha = 1; s.alphaDir = -1 }
      if (s.alpha <= 0.1) { s.alpha = 0.1; s.alphaDir = 1 }
      ctx.beginPath()
      ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
      ctx.fillStyle = s.color
      ctx.globalAlpha = s.alpha
      ctx.fill()
    })
    ctx.globalAlpha = 1
    animFrame = requestAnimationFrame(draw)
  }
  draw()
}

function handleResize() {
  if (starsCanvas.value) {
    starsCanvas.value.width = window.innerWidth
    starsCanvas.value.height = window.innerHeight
    stars.forEach(s => {
      s.x = Math.random() * window.innerWidth
      s.y = Math.random() * window.innerHeight
    })
  }
}

onMounted(() => {
  initStars()
  window.addEventListener('resize', handleResize)
})

onUnmounted(() => {
  if (animFrame) cancelAnimationFrame(animFrame)
  window.removeEventListener('resize', handleResize)
})
</script>

<style scoped>
.space-bg {
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
}

.stars-canvas {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
}

/* Nebula */
.nebula {
  position: absolute;
  border-radius: 50%;
  filter: blur(80px);
  opacity: 0.18;
}
.nebula-1 {
  width: 700px; height: 500px;
  top: -100px; right: -100px;
  background: radial-gradient(ellipse, #7c3aed 0%, #dc2626 50%, transparent 70%);
  animation: nebula-drift 20s ease-in-out infinite alternate;
}
.nebula-2 {
  width: 500px; height: 400px;
  bottom: 10%; left: -80px;
  background: radial-gradient(ellipse, #1d4ed8 0%, #7c3aed 60%, transparent 80%);
  animation: nebula-drift 25s ease-in-out infinite alternate-reverse;
}
.nebula-3 {
  width: 400px; height: 300px;
  top: 40%; left: 30%;
  background: radial-gradient(ellipse, #dc2626 0%, #f97316 50%, transparent 70%);
  opacity: 0.08;
  animation: nebula-drift 30s ease-in-out infinite alternate;
}

@keyframes nebula-drift {
  0% { transform: translate(0, 0) scale(1); }
  100% { transform: translate(30px, 20px) scale(1.1); }
}

/* Main big planet */
.planet-main {
  position: absolute;
  top: 8vh; right: 6vw;
  width: 180px; height: 180px;
  animation: float 6s ease-in-out infinite;
  z-index: 0;
}
.planet-surface {
  width: 100%; height: 100%;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #c084fc 0%, #7c3aed 40%, #3b0764 75%, #1e0a3c 100%);
  overflow: hidden;
  position: relative;
  box-shadow: inset -20px -20px 40px rgba(0,0,0,0.6), 0 0 40px rgba(139,92,246,0.4), 0 0 80px rgba(139,92,246,0.15);
}
.planet-stripe {
  position: absolute;
  width: 130%;
  left: -15%;
  border-radius: 50%;
  opacity: 0.25;
}
.stripe-1 { height: 30px; top: 35%; background: rgba(200,150,255,0.6); transform: rotate(-10deg); }
.stripe-2 { height: 18px; top: 52%; background: rgba(220,100,100,0.5); transform: rotate(-8deg); }
.stripe-3 { height: 12px; top: 65%; background: rgba(180,120,255,0.4); transform: rotate(-12deg); }

.planet-ring {
  position: absolute;
  width: 260px; height: 50px;
  border: 3px solid rgba(196,132,252,0.35);
  border-radius: 50%;
  top: 50%; left: 50%;
  transform: translate(-50%, -50%) rotateX(72deg);
  box-shadow: 0 0 10px rgba(139,92,246,0.2);
}

/* Small planet */
.planet-small {
  position: absolute;
  bottom: 15vh; left: 4vw;
  width: 80px; height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #f97316 0%, #dc2626 50%, #7f1d1d 100%);
  box-shadow: inset -10px -10px 20px rgba(0,0,0,0.5), 0 0 20px rgba(220,38,38,0.3);
  animation: float 8s ease-in-out infinite 1s;
}

/* Tiny distant planet */
.planet-tiny {
  position: absolute;
  top: 20vh; left: 8vw;
  width: 40px; height: 40px;
  border-radius: 50%;
  background: radial-gradient(circle at 40% 35%, #5dcaa5 0%, #0f6e56 60%, #04342c 100%);
  box-shadow: inset -5px -5px 10px rgba(0,0,0,0.5), 0 0 15px rgba(20,184,166,0.3);
  animation: float 10s ease-in-out infinite 2s;
}

/* RESPONSIVE - planet sizes */
@media (max-width: 1024px) {
  .planet-main { width: 130px; height: 130px; top: 6vh; right: 3vw; }
  .planet-ring { width: 190px; height: 36px; }
  .planet-small { width: 55px; height: 55px; }
  .planet-tiny { width: 28px; height: 28px; }
}

@media (max-width: 768px) {
  .planet-main { width: 90px; height: 90px; top: 4vh; right: 2vw; opacity: 0.6; }
  .planet-ring { width: 130px; height: 25px; border-width: 2px; }
  .planet-small { width: 40px; height: 40px; bottom: 8vh; left: 2vw; opacity: 0.5; }
  .planet-tiny { display: none; }
  .nebula { opacity: 0.1; }
  .nebula-1 { width: 300px; height: 200px; }
  .nebula-2 { width: 250px; height: 180px; }
  .nebula-3 { display: none; }
}

@media (max-width: 480px) {
  .planet-main { width: 65px; height: 65px; top: 3vh; right: 2vw; opacity: 0.45; }
  .planet-ring { width: 95px; height: 18px; border-width: 1.5px; }
  .planet-small { display: none; }
  .nebula-1 { width: 220px; height: 160px; opacity: 0.08; }
  .nebula-2 { width: 180px; height: 140px; opacity: 0.07; }
  .rocket-1, .rocket-2 { opacity: 0.4; }
}

/* Rockets - terbang dari kiri bawah ke kanan atas dengan sudut yang benar */
.rocket {
  position: absolute;
}
.rocket-1 {
  bottom: 40%;
  left: 0;
  animation: rocket-fly-1 18s linear infinite;
}
.rocket-2 {
  bottom: 20%;
  left: 0;
  animation: rocket-fly-2 26s linear infinite 9s;
}

/* Roket SVG menghadap ke atas, kita rotate 45deg searah terbang (kanan atas),
   lalu translate mengikuti jalur yang sama persis */
@keyframes rocket-fly-1 {
  0%   { transform: translate(-80px, 80px) rotate(45deg); opacity: 0; }
  4%   { opacity: 1; }
  96%  { opacity: 1; }
  100% { transform: translate(calc(100vw + 80px), calc(-50vh)) rotate(45deg); opacity: 0; }
}
@keyframes rocket-fly-2 {
  0%   { transform: translate(-60px, 60px) rotate(40deg); opacity: 0; }
  4%   { opacity: 0.85; }
  96%  { opacity: 0.85; }
  100% { transform: translate(calc(100vw + 60px), calc(-40vh)) rotate(40deg); opacity: 0; }
}

/* Meteors - jatuh dari kanan atas ke kiri bawah
   Garis horizontal, rotate negatif = miring kanan atas ke kiri bawah
   Ekor di kanan (asal), kepala/ujung terang di kiri (arah gerak) */
.meteor {
  position: absolute;
  width: 150px; height: 2px;
  border-radius: 2px;
  /* Kepala terang di ujung kiri (arah gerak), ekor memudar ke kanan */
  background: linear-gradient(to right, white, rgba(255,255,255,0.7), transparent);
  opacity: 0;
  transform-origin: right center;
}
.meteor-1 {
  top: 10%;
  right: 10%;
  animation: meteor-fall 7s linear infinite 1s;
}
.meteor-2 {
  top: 6%;
  right: 35%;
  animation: meteor-fall 9s linear infinite 4s;
}
.meteor-3 {
  top: 15%;
  right: 60%;
  animation: meteor-fall 8s linear infinite 7s;
}

/* rotate(-40deg) = garis miring dari kanan atas ke kiri bawah
   translate ke kiri bawah sesuai arah rotate */
@keyframes meteor-fall {
  0%   { opacity: 0;   transform: translate(0px, 0px) rotate(-40deg); }
  6%   { opacity: 1; }
  55%  { opacity: 0;   transform: translate(-260px, 220px) rotate(-40deg); }
  100% { opacity: 0;   transform: translate(-260px, 220px) rotate(-40deg); }
}

/* Pixel asteroids */
.asteroid {
  position: absolute;
  background: #444441;
  border-radius: 2px;
  box-shadow: 2px 2px 0 #2c2c2a;
  opacity: 0.5;
}
.asteroid-1 {
  width: 12px; height: 10px;
  top: 45%; right: 20%;
  animation: asteroid-drift 40s linear infinite;
}
.asteroid-2 {
  width: 8px; height: 6px;
  top: 70%; right: 40%;
  animation: asteroid-drift 55s linear infinite reverse 10s;
}

@keyframes asteroid-drift {
  0% { transform: translate(0, 0) rotate(0deg); }
  100% { transform: translate(-200px, 100px) rotate(360deg); }
}

@keyframes float {
  0%, 100% { transform: translateY(0px); }
  50% { transform: translateY(-12px); }
}
</style>
