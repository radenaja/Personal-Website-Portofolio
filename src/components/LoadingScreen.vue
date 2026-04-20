<template>
  <div class="loading-screen" :class="{ 'fade-out': fadingOut }">
    <div class="stars-bg"></div>
    <div class="loading-content">
      <div class="planet"></div>
      <div class="game-title">
        <span class="title-line1">RADEN</span>
        <span class="title-line2">PORTFOLIO</span>
        <span class="title-sub">v2.0.25 — FULL STACK EDITION</span>
      </div>
      <div class="loading-bar-wrap">
        <div class="loading-label">LOADING SYSTEMS...</div>
        <div class="loading-bar">
          <div class="loading-fill" :style="{ width: progress + '%' }"></div>
        </div>
        <div class="loading-percent">{{ Math.round(progress) }}%</div>
      </div>
      <div class="loading-log">
        <span class="log-line" v-for="(line, i) in visibleLogs" :key="i">{{ line }}</span>
      </div>
      <div class="press-start" v-if="progress >= 100">
        <span>[ PRESS ANY KEY TO CONTINUE ]</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'

const emit = defineEmits(['done', 'start-music'])
const progress = ref(0)
const fadingOut = ref(false)
const visibleLogs = ref([])

const logs = [
  '> initializing core systems...',
  '> loading laravel modules... OK',
  '> loading vue.js engine... OK',
  '> connecting to database... OK',
  '> importing project data... OK',
  '> rendering pixel assets... OK',
  '> SYSTEM READY',
]

onMounted(() => {
  let logIndex = 0
  const interval = setInterval(() => {
    progress.value = Math.min(progress.value + Math.random() * 4 + 1, 100)
    const targetLog = Math.floor((progress.value / 100) * logs.length)
    while (logIndex < targetLog && logIndex < logs.length) {
      visibleLogs.value.push(logs[logIndex])
      logIndex++
    }
    if (progress.value >= 100) {
      clearInterval(interval)
      const handler = () => {
        fadingOut.value = true
        emit('start-music')
        setTimeout(() => emit('done'), 600)
        window.removeEventListener('keydown', handler)
        window.removeEventListener('click', handler)
      }
      setTimeout(() => {
        window.addEventListener('keydown', handler)
        window.addEventListener('click', handler)
      }, 300)
    }
  }, 80)
})
</script>

<style scoped>
.loading-screen {
  position: fixed;
  inset: 0;
  background: #050310;
  z-index: 9999;
  display: flex;
  align-items: center;
  justify-content: center;
  transition: opacity 0.6s ease;
}
.loading-screen.fade-out {
  opacity: 0;
  pointer-events: none;
}
.loading-content {
  text-align: center;
  width: 500px;
  max-width: 90vw;
  position: relative;
  z-index: 2;
}
.planet {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #c084fc, #7c3aed 50%, #3b0764);
  margin: 0 auto 2rem;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 30px rgba(139, 92, 246, 0.5), inset -10px -10px 20px rgba(0,0,0,0.5);
  position: relative;
}
.planet::after {
  content: '';
  position: absolute;
  top: 50%; left: -20px; right: -20px;
  height: 12px;
  border-radius: 50%;
  border: 3px solid rgba(196, 132, 252, 0.4);
  transform: translateY(-50%) rotateX(70deg);
}
.title-line1 {
  display: block;
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(28px, 6vw, 48px);
  color: #e2d9f3;
  letter-spacing: 12px;
  text-shadow: 0 0 20px rgba(139, 92, 246, 0.8);
  margin-bottom: 6px;
}
.title-line2 {
  display: block;
  font-family: 'Press Start 2P', monospace;
  font-size: clamp(10px, 2.5vw, 16px);
  color: #dc2626;
  letter-spacing: 8px;
  margin-bottom: 6px;
}
.title-sub {
  display: block;
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  color: #5c5078;
  letter-spacing: 3px;
  margin-bottom: 3rem;
}
.loading-label {
  font-family: 'Share Tech Mono', monospace;
  font-size: 13px;
  color: #5c5078;
  letter-spacing: 3px;
  margin-bottom: 8px;
  text-align: left;
}
.loading-bar {
  width: 100%;
  height: 6px;
  background: #1a1230;
  border: 1px solid #2d1f4e;
  margin-bottom: 6px;
  position: relative;
  overflow: hidden;
}
.loading-fill {
  height: 100%;
  background: linear-gradient(to right, #7c3aed, #dc2626);
  transition: width 0.1s ease;
  position: relative;
}
.loading-fill::after {
  content: '';
  position: absolute;
  right: 0; top: 0; bottom: 0;
  width: 20px;
  background: rgba(255,255,255,0.4);
  filter: blur(4px);
}
.loading-percent {
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  color: #8b5cf6;
  text-align: right;
  margin-bottom: 1.5rem;
}
.loading-log {
  text-align: left;
  min-height: 100px;
  font-size: 12px;
  color: #5c5078;
  font-family: 'Share Tech Mono', monospace;
  line-height: 1.8;
}
.log-line {
  display: block;
  animation: fadeInUp 0.3s ease;
}
.log-line:last-child {
  color: #14b8a6;
}
.press-start {
  margin-top: 2rem;
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  color: #fbbf24;
  animation: blink 1s step-end infinite;
  letter-spacing: 2px;
}
</style>
