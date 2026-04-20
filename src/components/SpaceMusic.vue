<template>
  <div class="music-control" :class="{ playing: isPlaying }">
    <button @click="toggleMusic" :title="isPlaying ? 'Pause music' : 'Play space music'">
      <span class="music-icon">{{ isPlaying ? '♪' : '♪' }}</span>
      <span class="music-bars" v-if="isPlaying">
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
        <span class="bar"></span>
      </span>
      <span class="music-label">{{ isPlaying ? 'MUSIC ON' : 'MUSIC OFF' }}</span>
    </button>
  </div>
</template>

<script setup>
import { ref, onUnmounted } from 'vue'

const isPlaying = ref(false)
let audioCtx = null
let masterGain = null
let melodyInterval = null
let bassInterval = null
let arpeggioInterval = null
let melodyIdx = 0
let bassIdx = 0
let arpIdx = 0

const melody = [
  523, 587, 659, 784, 659, 587, 523, 0,
  440, 494, 523, 659, 523, 494, 440, 0,
  392, 440, 494, 587, 659, 587, 494, 440,
  523, 659, 784, 880, 784, 659, 523, 0,
]

const bassLine = [
  130, 0, 130, 0, 146, 0, 146, 0,
  110, 0, 110, 0, 123, 0, 123, 0,
  98, 0, 98, 0, 110, 0, 110, 0,
  130, 0, 130, 0, 164, 0, 164, 0,
]

const arpeggio = [
  523, 659, 784, 659, 523, 659, 784, 880,
  440, 523, 659, 523, 440, 523, 659, 784,
  392, 494, 587, 494, 392, 494, 587, 659,
  523, 659, 784, 1047, 784, 659, 523, 659,
]

function initAudio() {
  if (audioCtx) return
  audioCtx = new (window.AudioContext || window.webkitAudioContext)()
  masterGain = audioCtx.createGain()
  masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime)
  masterGain.connect(audioCtx.destination)
}

function playNote(freq, type, gainVal, duration, delay = 0) {
  if (!audioCtx || freq === 0) return
  const osc = audioCtx.createOscillator()
  const gain = audioCtx.createGain()
  osc.connect(gain)
  gain.connect(masterGain)
  osc.type = type
  osc.frequency.setValueAtTime(freq, audioCtx.currentTime + delay)
  gain.gain.setValueAtTime(gainVal, audioCtx.currentTime + delay)
  gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + delay + duration)
  osc.start(audioCtx.currentTime + delay)
  osc.stop(audioCtx.currentTime + delay + duration + 0.05)
}

function startMusic() {
  initAudio()
  if (audioCtx.state === 'suspended') audioCtx.resume()

  const melodyTempo = 280
  const bassTempo = 560
  const arpTempo = 140

  melodyInterval = setInterval(() => {
    playNote(melody[melodyIdx % melody.length], 'square', 0.4, melodyTempo / 1000 * 0.85)
    melodyIdx++
  }, melodyTempo)

  bassInterval = setInterval(() => {
    playNote(bassLine[bassIdx % bassLine.length], 'sawtooth', 0.5, bassTempo / 1000 * 0.8)
    bassIdx++
  }, bassTempo)

  arpeggioInterval = setInterval(() => {
    playNote(arpeggio[arpIdx % arpeggio.length], 'triangle', 0.2, arpTempo / 1000 * 0.7)
    arpIdx++
  }, arpTempo)

  isPlaying.value = true
}

function stopMusic() {
  clearInterval(melodyInterval)
  clearInterval(bassInterval)
  clearInterval(arpeggioInterval)
  melodyInterval = bassInterval = arpeggioInterval = null
  if (masterGain) {
    masterGain.gain.setValueAtTime(masterGain.gain.value, audioCtx.currentTime)
    masterGain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + 0.3)
    setTimeout(() => {
      masterGain.gain.setValueAtTime(0.15, audioCtx.currentTime)
    }, 400)
  }
  isPlaying.value = false
}

function toggleMusic() {
  if (isPlaying.value) {
    stopMusic()
  } else {
    startMusic()
  }
}

// Expose startMusic so LoadingScreen can trigger autoplay
defineExpose({ startMusic })

onUnmounted(() => {
  stopMusic()
  if (audioCtx) { audioCtx.close(); audioCtx = null }
})
</script>

<style scoped>
.music-control {
  display: flex;
  align-items: center;
}
.music-control button {
  display: flex;
  align-items: center;
  gap: 6px;
  background: transparent;
  border: 1px solid var(--border-color);
  color: var(--text-muted);
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  padding: 6px 10px;
  cursor: pointer;
  letter-spacing: 1px;
  transition: all 0.15s;
}
.music-control.playing button {
  border-color: var(--accent-teal);
  color: var(--accent-teal);
}
.music-control button:hover {
  border-color: var(--accent-teal);
  color: var(--accent-teal);
}
.music-icon { font-size: 14px; }
.music-label { display: none; }
@media (min-width: 1024px) {
  .music-label { display: inline; }
}
.music-bars {
  display: flex;
  align-items: flex-end;
  gap: 2px;
  height: 14px;
}
.bar {
  width: 3px;
  background: var(--accent-teal);
  border-radius: 1px;
  animation: bar-dance 0.6s ease-in-out infinite;
}
.bar:nth-child(1) { height: 6px; animation-delay: 0s; }
.bar:nth-child(2) { height: 12px; animation-delay: 0.15s; }
.bar:nth-child(3) { height: 8px; animation-delay: 0.3s; }
.bar:nth-child(4) { height: 10px; animation-delay: 0.45s; }

@keyframes bar-dance {
  0%, 100% { transform: scaleY(0.5); }
  50% { transform: scaleY(1.2); }
}
</style>
