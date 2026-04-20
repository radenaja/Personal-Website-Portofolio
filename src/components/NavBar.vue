<template>
  <nav class="navbar" :class="{ scrolled: isScrolled }">
    <div class="nav-inner">
      <div class="nav-logo">
        <span class="logo-bracket">[</span>
        <span class="logo-name">RADEN</span>
        <span class="logo-bracket">]</span>
      </div>

      <div class="nav-links desktop-only">
        <a href="#projects" class="nav-link">QUESTS</a>
        <a href="#achievements" class="nav-link">ACHIEVEMENTS</a>
        <a href="#skills" class="nav-link">SKILLS</a>
        <a href="#contact" class="nav-link">CONTACT</a>
        <a href="/Personal-Website-Portofolio/cv-raden-aradeya-risqi-jagat-pertala.pdf" download="CV_Raden_Aradeya_Risqi_Jagat_Pertala.pdf" target="_blank" class="nav-link cv-link">CV ↓</a>
      </div>

      <div class="nav-right">
        <SpaceMusic ref="musicRef" />
        <button v-if="!isLoggedIn" class="nav-login-btn" @click="$emit('login')">LOGIN</button>
        <span v-else class="nav-admin-badge">● ADMIN</span>
        <button class="hamburger mobile-only" @click="menuOpen = !menuOpen" :class="{ open: menuOpen }">
          <span></span><span></span><span></span>
        </button>
      </div>
    </div>

    <!-- Mobile Menu -->
    <div class="mobile-menu" :class="{ open: menuOpen }">
      <a href="#projects" class="mobile-link" @click="menuOpen = false">QUESTS</a>
      <a href="#achievements" class="mobile-link" @click="menuOpen = false">ACHIEVEMENTS</a>
      <a href="#skills" class="mobile-link" @click="menuOpen = false">SKILLS</a>
      <a href="#contact" class="mobile-link" @click="menuOpen = false">CONTACT</a>
      <a href="/Personal-Website-Portofolio/cv-raden-aradeya-risqi-jagat-pertala.pdf" download="CV_Raden_Aradeya_Risqi_Jagat_Pertala.pdf" target="_blank" class="mobile-link cv-mobile" @click="menuOpen = false">DOWNLOAD CV ↓</a>
    </div>
  </nav>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'
import SpaceMusic from './SpaceMusic.vue'

const emit = defineEmits(['login'])
const { isLoggedIn } = useAuth()
const isScrolled = ref(false)
const menuOpen = ref(false)
const musicRef = ref(null)

function startMusic() {
  if (musicRef.value) musicRef.value.startMusic()
}
defineExpose({ startMusic })

onMounted(() => {
  window.addEventListener('scroll', () => {
    isScrolled.value = window.scrollY > 50
    if (menuOpen.value) menuOpen.value = false
  })
})
</script>

<style scoped>
.navbar {
  position: fixed; top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background 0.3s, border-bottom 0.3s;
  padding: 0.8rem 2rem;
}
.navbar.scrolled {
  background: rgba(10,6,18,0.97);
  border-bottom: 1px solid var(--border-color);
  backdrop-filter: blur(10px);
}
.nav-inner {
  max-width: 1100px; margin: 0 auto;
  display: flex; align-items: center; justify-content: space-between;
  gap: 12px;
}
.nav-logo {
  font-family: 'Press Start 2P', monospace;
  font-size: 12px; flex-shrink: 0;
}
.logo-bracket { color: var(--accent-crimson); }
.logo-name { color: #e2d9f3; margin: 0 4px; }

.nav-links { display: flex; gap: 20px; align-items: center; }
.nav-link {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px; color: var(--text-muted);
  text-decoration: none; letter-spacing: 1px; transition: color 0.15s;
  white-space: nowrap;
}
.nav-link:hover { color: var(--accent-purple); }
.cv-link { color: var(--accent-gold); border: 1px solid var(--accent-gold); padding: 6px 10px; }
.cv-link:hover { background: var(--accent-gold); color: var(--bg-deep); }

.nav-right { display: flex; align-items: center; gap: 8px; flex-shrink: 0; }
.nav-login-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px; padding: 6px 10px;
  background: transparent; color: var(--accent-purple);
  border: 1px solid var(--accent-purple); cursor: pointer;
  letter-spacing: 1px; transition: all 0.15s; white-space: nowrap;
}
.nav-login-btn:hover { background: var(--accent-purple); color: var(--bg-deep); }
.nav-admin-badge {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px; color: var(--accent-teal); letter-spacing: 1px; white-space: nowrap;
}

/* Hamburger */
.hamburger {
  display: none;
  flex-direction: column; justify-content: center;
  gap: 5px; width: 28px; height: 28px;
  background: transparent; border: none; cursor: pointer; padding: 2px;
}
.hamburger span {
  display: block; width: 100%; height: 2px;
  background: var(--text-secondary); transition: all 0.25s;
  transform-origin: center;
}
.hamburger.open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.hamburger.open span:nth-child(2) { opacity: 0; transform: scaleX(0); }
.hamburger.open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

/* Mobile menu */
.mobile-menu {
  max-height: 0; overflow: hidden;
  transition: max-height 0.35s ease, padding 0.3s;
  background: rgba(10,6,18,0.98);
  border-top: 0px solid transparent;
}
.mobile-menu.open {
  max-height: 400px;
  padding: 0.5rem 0 1rem;
  border-top: 1px solid var(--border-color);
}
.mobile-link {
  display: block;
  font-family: 'Press Start 2P', monospace;
  font-size: 9px; color: var(--text-muted);
  text-decoration: none; letter-spacing: 2px;
  padding: 0.85rem 2rem;
  transition: all 0.15s;
  border-bottom: 1px solid rgba(45,31,78,0.4);
}
.mobile-link:hover, .mobile-link:active { color: var(--accent-purple); background: rgba(139,92,246,0.07); }
.cv-mobile { color: var(--accent-gold); }
.cv-mobile:hover { color: var(--bg-deep); background: var(--accent-gold); }

/* Responsive */
.desktop-only { display: flex; }
.mobile-only { display: none; }

@media (max-width: 768px) {
  .navbar { padding: 0.7rem 1.2rem; }
  .desktop-only { display: none; }
  .mobile-only { display: flex; }
  .nav-logo { font-size: 10px; }
}

@media (max-width: 480px) {
  .navbar { padding: 0.6rem 1rem; }
  .nav-logo { font-size: 9px; }
  .nav-admin-badge { font-size: 6px; }
}
</style>
