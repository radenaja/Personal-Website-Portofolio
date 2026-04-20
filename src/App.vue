<template>
  <div>
    <LoadingScreen
      v-if="!loaded"
      @done="onLoadingDone"
      @start-music="onStartMusic"
    />

    <LoginPage
      v-else-if="showLogin"
      @success="showLogin = false"
      @cancel="showLogin = false"
    />

    <template v-else>
      <SpaceBackground />
      <NavBar ref="navRef" @login="showLogin = true" />
      <main>
        <HeroSection />
        <ProjectsSection />
        <AchievementsSection />
        <SkillsContact />
      </main>
    </template>
  </div>
</template>

<script setup>
import { ref, nextTick } from 'vue'
import LoadingScreen from './components/LoadingScreen.vue'
import LoginPage from './components/LoginPage.vue'
import SpaceBackground from './components/SpaceBackground.vue'
import NavBar from './components/NavBar.vue'
import HeroSection from './components/HeroSection.vue'
import ProjectsSection from './components/ProjectsSection.vue'
import AchievementsSection from './components/AchievementsSection.vue'
import SkillsContact from './components/SkillsContact.vue'

const loaded = ref(false)
const showLogin = ref(false)
const navRef = ref(null)
let pendingMusic = false

function onLoadingDone() {
  loaded.value = true
  if (pendingMusic) {
    nextTick(() => {
      setTimeout(() => {
        if (navRef.value) navRef.value.startMusic()
      }, 300)
    })
  }
}

function onStartMusic() {
  pendingMusic = true
}
</script>
