<template>
  <section class="hero-section">
    <div class="scanline"></div>
    <div class="hero-container">

      <!-- Character Panel -->
      <div class="character-panel pixel-border">
        <div class="char-header">[ CHARACTER SELECT ]</div>

        <div class="char-avatar">
          <div class="avatar-frame">
            <img
              v-if="profile.photoUrl && !photoError"
              :src="profile.photoUrl"
              @error="photoError = true"
              @load="photoError = false"
              class="avatar-img"
            />
            <svg v-else width="96" height="96" viewBox="0 0 24 24" style="image-rendering:pixelated">
              <rect x="8" y="2" width="8" height="2" fill="#c084fc"/>
              <rect x="6" y="4" width="12" height="6" fill="#c084fc"/>
              <rect x="8" y="4" width="2" height="2" fill="#050310"/>
              <rect x="14" y="4" width="2" height="2" fill="#050310"/>
              <rect x="8" y="8" width="8" height="2" fill="#fbbf24"/>
              <rect x="6" y="10" width="12" height="8" fill="#8b5cf6"/>
              <rect x="4" y="10" width="2" height="6" fill="#8b5cf6"/>
              <rect x="18" y="10" width="2" height="6" fill="#8b5cf6"/>
              <rect x="6" y="18" width="4" height="4" fill="#6d28d9"/>
              <rect x="14" y="18" width="4" height="4" fill="#6d28d9"/>
            </svg>
          </div>
          <div class="avatar-badge">LV.{{ profile.level }}</div>
        </div>

        <div class="char-name">
          <span class="name-main">{{ profile.displayName }}</span>
          <span class="name-sub">{{ profile.fullName }}</span>
          <span class="name-class">[ {{ profile.classTitle }} ]</span>
        </div>

        <div class="char-xp">
          <div class="xp-label">XP {{ profile.xp }} / {{ profile.xpMax }}</div>
          <div class="xp-bar">
            <div class="xp-fill" :style="{ width: Math.round((profile.xp / profile.xpMax) * 100) + '%' }"></div>
          </div>
        </div>

        <div class="char-badges">
          <span class="badge-item" v-for="b in profile.badges" :key="b">{{ b }}</span>
        </div>

        <button v-if="isLoggedIn" class="edit-profile-btn" @click="openEditProfile">✎ EDIT PROFILE</button>
      </div>

      <!-- Hero Right -->
      <div class="hero-right">
        <div class="hero-tagline">
          <span class="tagline-prefix">&gt; </span>
          <span>{{ displayedText }}<span class="cursor" :class="{ blink: !typing }">█</span></span>
        </div>
        <p class="hero-desc" v-html="bioHtml"></p>

        <div class="hero-stats">
          <div class="stat-row" v-for="stat in profile.stats" :key="stat.name">
            <span class="stat-name">{{ stat.name }}</span>
            <div class="stat-bar-wrap">
              <div class="stat-bar">
                <div class="stat-fill" :style="{ width: stat.value + '%', background: stat.color }"></div>
              </div>
              <span class="stat-val">{{ stat.value }}</span>
            </div>
          </div>
        </div>

        <div class="hero-ctas">
          <a href="#projects" class="btn-pixel">VIEW QUESTS</a>
          <a href="#contact" class="btn-pixel crimson">CONTACT ME</a>
          <a :href="profile.cvUrl" target="_blank" download="CV_Raden_Aradeya.pdf" class="btn-pixel" style="color:var(--accent-gold);border-color:var(--accent-gold)">DOWNLOAD CV</a>
        </div>
      </div>
    </div>

    <div class="scroll-hint">
      <span>SCROLL TO EXPLORE</span>
      <span class="arrow-down">▼</span>
    </div>

    <!-- Edit Profile Modal -->
    <div class="modal-overlay" v-if="showEditProfile" @click.self="showEditProfile = false">
      <div class="modal-box pixel-border">
        <button class="modal-close" @click="showEditProfile = false">✕</button>
        <div class="modal-type">EDIT PROFILE</div>
        <h2 class="modal-title" style="margin-bottom:1.5rem">Edit Profile</h2>

        <div class="form-tabs">
          <button class="tab-btn" :class="{ active: activeTab === 'identity' }" @click="activeTab = 'identity'">IDENTITY</button>
          <button class="tab-btn" :class="{ active: activeTab === 'stats' }" @click="activeTab = 'stats'">STATS</button>
          <button class="tab-btn" :class="{ active: activeTab === 'links' }" @click="activeTab = 'links'">LINKS</button>
        </div>

        <!-- Tab: Identity -->
        <div v-if="activeTab === 'identity'">
          <div class="form-field">
            <label>Photo URL</label>
            <input v-model="editForm.photoUrl" placeholder="https://i.imgur.com/yourphoto.jpg" />
            <div class="photo-hint">Upload foto ke imgur.com → copy image address → paste di sini</div>
            <div class="photo-preview" v-if="editForm.photoUrl">
              <img
                v-show="!previewError"
                :src="editForm.photoUrl"
                @error="previewError = true"
                @load="previewError = false"
              />
              <span v-if="previewError" class="preview-err">URL tidak valid atau gambar tidak bisa dimuat</span>
            </div>
          </div>
          <div class="form-field"><label>Display Name</label><input v-model="editForm.displayName" placeholder="RADEN" /></div>
          <div class="form-field"><label>Full Name</label><input v-model="editForm.fullName" placeholder="Aradeya Risqi Jagat Pertala" /></div>
          <div class="form-field"><label>Class / Title</label><input v-model="editForm.classTitle" placeholder="FULL-STACK DEVELOPER" /></div>
          <div class="form-field"><label>Level</label><input v-model.number="editForm.level" type="number" min="1" max="99" placeholder="12" /></div>
          <div class="form-field">
            <label>XP Current / Max</label>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:8px">
              <input v-model.number="editForm.xp" type="number" min="0" placeholder="2450" />
              <input v-model.number="editForm.xpMax" type="number" min="1" placeholder="3000" />
            </div>
          </div>
          <div class="form-field"><label>Phone</label><input v-model="editForm.phone" placeholder="+6282213293631" /></div>
          <div class="form-field"><label>Location</label><input v-model="editForm.location" placeholder="Pondok Aren, Tangerang Selatan" /></div>
          <div class="form-field"><label>Bio</label><textarea v-model="editForm.bio" rows="4" placeholder="Deskripsi singkat tentang kamu..."></textarea></div>
          <div class="form-field"><label>Badges (comma separated)</label><input v-model="editForm.badgesRaw" placeholder="PHP, Laravel, Vue, MySQL" /></div>
        </div>

        <!-- Tab: Stats -->
        <div v-if="activeTab === 'stats'">
          <p style="font-size:12px;color:var(--text-muted);margin-bottom:1rem;font-family:'Share Tech Mono',monospace">Edit nilai skill stats (0-100)</p>
          <div v-for="(stat, i) in editForm.stats" :key="i" class="stat-edit-row">
            <input v-model="editForm.stats[i].name" class="stat-name-input" placeholder="Skill name" />
            <input v-model.number="editForm.stats[i].value" type="number" min="0" max="100" class="stat-val-input" />
            <input v-model="editForm.stats[i].color" type="color" class="stat-color-input" />
            <button class="remove-stat" @click="removeStat(i)">✕</button>
          </div>
          <button class="add-stat-btn" @click="addStat">+ ADD STAT</button>
        </div>

        <!-- Tab: Links -->
        <div v-if="activeTab === 'links'">
          <div class="form-field"><label>Email</label><input v-model="editForm.email" placeholder="raden@email.com" /></div>
          <div class="form-field"><label>GitHub URL</label><input v-model="editForm.github" placeholder="https://github.com/username" /></div>
          <div class="form-field"><label>LinkedIn URL</label><input v-model="editForm.linkedin" placeholder="https://linkedin.com/in/username" /></div>
          <div class="form-field"><label>Personal Drive URL</label><input v-model="editForm.personalDrive" placeholder="https://drive.google.com/drive/folders/..." /></div>
          <div class="form-field">
            <label>CV / Resume</label>
            <div class="cv-manager">
              <input v-model="editForm.cvUrl" placeholder="https://drive.google.com/... atau /raden-portfolio/cv-raden-aradeya-risqi-jagat-pertala.pdf" />
              <div class="photo-hint">CV kamu sudah ada di <strong style="color:var(--accent-teal)">/raden-portfolio/cv-raden-aradeya-risqi-jagat-pertala.pdf</strong>. Isi field ini hanya kalau mau ganti ke URL lain (misal Google Drive).</div>
              <div class="cv-actions">
                <a :href="editForm.cvUrl" target="_blank" class="cv-preview-btn" v-if="editForm.cvUrl">PREVIEW CV ↗</a>
                <button class="cv-reset-btn" @click="editForm.cvUrl = '/raden-portfolio/cv-raden-aradeya-risqi-jagat-pertala.pdf'" type="button">RESET KE DEFAULT</button>
              </div>
            </div>
          </div>
        </div>

        <button class="btn-pixel" style="width:100%;margin-top:1.5rem;padding:14px;font-size:10px" @click="saveProfile">SAVE CHANGES</button>
        <button class="reset-default-btn" @click="confirmReset = true" type="button">↺ RESET ALL TO DEFAULT (clear cache)</button>

        <div class="confirm-reset" v-if="confirmReset">
          <p>Semua perubahan yang tersimpan akan dihapus dan data akan kembali ke default dari kode. Lanjutkan?</p>
          <div style="display:flex;gap:10px;margin-top:10px">
            <button class="btn-pixel crimson" style="font-size:8px;padding:8px 12px" @click="doResetDefault">YA, RESET</button>
            <button class="btn-pixel" style="font-size:8px;padding:8px 12px" @click="confirmReset = false">BATAL</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useProfile } from '../stores/profile.js'

const { isLoggedIn } = useAuth()
const { profile, updateProfile } = useProfile()

const photoError = ref(false)
const previewError = ref(false)
const showEditProfile = ref(false)
const activeTab = ref('identity')

const bioHtml = computed(() => profile.value.bio.replace(/\n/g, '<br>'))

// Edit form
const editForm = ref({})

function openEditProfile() {
  previewError.value = false
  photoError.value = false
  editForm.value = {
    photoUrl: profile.value.photoUrl,
    displayName: profile.value.displayName,
    fullName: profile.value.fullName,
    classTitle: profile.value.classTitle,
    level: profile.value.level,
    xp: profile.value.xp,
    xpMax: profile.value.xpMax,
    bio: profile.value.bio,
    badgesRaw: profile.value.badges.join(', '),
    stats: profile.value.stats.map(s => ({ ...s })),
    email: profile.value.email,
    phone: profile.value.phone || '',
    location: profile.value.location || '',
    github: profile.value.github,
    linkedin: profile.value.linkedin,
    cvUrl: profile.value.cvUrl,
    personalDrive: profile.value.personalDrive || '',
  }
  activeTab.value = 'identity'
  showEditProfile.value = true
}

function saveProfile() {
  photoError.value = false
  previewError.value = false
  updateProfile({
    photoUrl: editForm.value.photoUrl,
    displayName: editForm.value.displayName,
    fullName: editForm.value.fullName,
    classTitle: editForm.value.classTitle,
    level: editForm.value.level,
    xp: editForm.value.xp,
    xpMax: editForm.value.xpMax,
    bio: editForm.value.bio,
    badges: editForm.value.badgesRaw.split(',').map(b => b.trim()).filter(Boolean),
    stats: editForm.value.stats,
    email: editForm.value.email,
    phone: editForm.value.phone,
    location: editForm.value.location,
    github: editForm.value.github,
    linkedin: editForm.value.linkedin,
    cvUrl: editForm.value.cvUrl,
    personalDrive: editForm.value.personalDrive,
  })
  showEditProfile.value = false
}

const confirmReset = ref(false)

function doResetDefault() {
  // Clear all localStorage keys used by the app
  const keys = [
    'raden_profile_v3', 'raden_profile_v2', 'raden_profile',
    'raden_projects_v3', 'raden_projects_v2', 'raden_projects',
    'raden_skills_v2', 'raden_skills',
    'raden_achievements_v2', 'raden_achievements',
    'raden_timeline_v2', 'raden_timeline',
  ]
  keys.forEach(k => localStorage.removeItem(k))
  confirmReset.value = false
  showEditProfile.value = false
  // Reload page to apply fresh defaults from code
  window.location.reload()
}

function addStat() {
  editForm.value.stats.push({ name: '', value: 50, color: '#8b5cf6' })
}
function removeStat(i) {
  editForm.value.stats.splice(i, 1)
}

// Typewriter
const phrases = [
  'Data Analyst | Frontend Web Dev...',
  'Turning raw data into insights...',
  'Building web apps since 2022...',
  'Curious, adaptive, always learning...',
  'Quest: Land first full-time dev job...',
]
const displayedText = ref('')
const typing = ref(true)
let phraseIdx = 0, charIdx = 0, deleting = false

function typeLoop() {
  const current = phrases[phraseIdx]
  if (!deleting) {
    displayedText.value = current.slice(0, ++charIdx)
    if (charIdx === current.length) { deleting = true; setTimeout(typeLoop, 2000); return }
  } else {
    displayedText.value = current.slice(0, --charIdx)
    if (charIdx === 0) { deleting = false; phraseIdx = (phraseIdx + 1) % phrases.length }
  }
  setTimeout(typeLoop, deleting ? 40 : 70)
}

// Konami code
const konamiSeq = ['ArrowUp','ArrowUp','ArrowDown','ArrowDown','ArrowLeft','ArrowRight','ArrowLeft','ArrowRight','b','a']
let konamiIdx = 0

onMounted(() => {
  setTimeout(typeLoop, 500)
  window.addEventListener('keydown', (e) => {
    if (e.key === konamiSeq[konamiIdx]) {
      konamiIdx++
      if (konamiIdx === konamiSeq.length) { konamiIdx = 0; triggerEasterEgg() }
    } else { konamiIdx = 0 }
  })
})

function triggerEasterEgg() {
  const msg = document.createElement('div')
  msg.innerHTML = `<div style="position:fixed;inset:0;background:rgba(0,0,0,0.9);z-index:9999;display:flex;align-items:center;justify-content:center;cursor:pointer"><div style="text-align:center;font-family:'Press Start 2P',monospace;color:#fbbf24"><div style="font-size:28px;margin-bottom:24px">★ ACHIEVEMENT UNLOCKED ★</div><div style="font-size:13px;color:#8b5cf6;margin-bottom:16px">KONAMI CODE MASTER</div><div style="font-size:10px;color:#9d8fc0;line-height:2">You found the secret!<br>Raden would love to work with<br>someone as curious as you.</div><div style="font-size:9px;color:#5c5078;margin-top:16px">[ CLICK TO CLOSE ]</div></div></div>`
  document.body.appendChild(msg)
  msg.addEventListener('click', () => msg.remove())
}
</script>

<style scoped>
.hero-section { min-height: 100vh; display: flex; flex-direction: column; justify-content: center; padding: 6rem 2rem 4rem; position: relative; overflow: hidden; }
.scanline { position: absolute; top: 0; left: 0; right: 0; height: 2px; background: rgba(139,92,246,0.15); animation: scanline 8s linear infinite; pointer-events: none; }
.hero-container { max-width: 1100px; margin: 0 auto; display: grid; grid-template-columns: 300px 1fr; gap: 3rem; align-items: center; width: 100%; }

.character-panel { background: var(--bg-card); padding: 1.5rem; border-radius: 4px; animation: fadeInUp 0.8s ease; }
.char-header { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 1.2rem; text-align: center; }
.char-avatar { display: flex; justify-content: center; margin-bottom: 1rem; position: relative; }
.avatar-frame { width: 96px; height: 96px; background: var(--bg-deep); border: 2px solid var(--accent-purple); display: flex; align-items: center; justify-content: center; animation: pulse-glow 2s ease-in-out infinite; overflow: hidden; }
.avatar-img { width: 100%; height: 100%; object-fit: cover; }
.avatar-badge { position: absolute; bottom: -8px; right: calc(50% - 60px); background: var(--accent-gold); color: var(--bg-deep); font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 3px 7px; }

.char-name { text-align: center; margin: 1.2rem 0 1rem; }
.name-main { display: block; font-family: 'Press Start 2P', monospace; font-size: 18px; color: #e2d9f3; letter-spacing: 6px; text-shadow: 0 0 15px rgba(139,92,246,0.7); }
.name-sub { display: block; font-size: 11px; color: var(--text-secondary); margin: 6px 0 4px; line-height: 1.6; }
.name-class { display: block; font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-crimson); letter-spacing: 1px; }

.char-xp { margin: 1rem 0; }
.xp-label { font-size: 10px; color: var(--text-muted); margin-bottom: 4px; }
.xp-bar { height: 8px; background: var(--bg-deep); border: 1px solid var(--border-color); }
.xp-fill { height: 100%; background: linear-gradient(to right, #7c3aed, #fbbf24); transition: width 1.5s ease; }

.char-badges { display: flex; flex-wrap: wrap; gap: 4px; margin-top: 0.8rem; }
.badge-item { font-family: 'Press Start 2P', monospace; font-size: 9px; padding: 5px 8px; background: rgba(139,92,246,0.15); border: 1px solid rgba(139,92,246,0.4); color: var(--accent-purple); }

.edit-profile-btn { width: 100%; margin-top: 1rem; font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 9px; background: transparent; color: var(--accent-teal); border: 1px solid var(--accent-teal); cursor: pointer; letter-spacing: 1px; transition: all 0.15s; }
.edit-profile-btn:hover { background: var(--accent-teal); color: var(--bg-deep); }

.hero-right { animation: fadeInUp 0.8s ease 0.2s both; }
.hero-tagline { font-family: 'Share Tech Mono', monospace; font-size: clamp(14px, 2.5vw, 18px); color: var(--accent-teal); margin-bottom: 1rem; min-height: 28px; }
.tagline-prefix { color: var(--accent-crimson); }
.cursor { color: var(--accent-purple); }
.cursor.blink { animation: blink 0.8s step-end infinite; }
.hero-desc { font-size: 15px; color: var(--text-secondary); line-height: 2; margin-bottom: 2rem; }

.stat-row { display: flex; align-items: center; gap: 12px; margin-bottom: 10px; }
.stat-name { font-size: 13px; color: var(--text-secondary); width: 140px; flex-shrink: 0; }
.stat-bar-wrap { display: flex; align-items: center; gap: 8px; flex: 1; }
.stat-bar { flex: 1; height: 6px; background: var(--bg-deep); border: 1px solid var(--border-color); }
.stat-fill { height: 100%; transition: width 1.5s ease; }
.stat-val { font-size: 13px; color: var(--text-muted); width: 28px; text-align: right; }

.hero-ctas { display: flex; flex-wrap: wrap; gap: 12px; margin-top: 2rem; }
.scroll-hint { text-align: center; margin-top: 3rem; font-size: 11px; color: var(--text-muted); letter-spacing: 4px; animation: blink 2s step-end infinite; display: flex; flex-direction: column; align-items: center; gap: 6px; }
.arrow-down { color: var(--accent-purple); animation: float 1.5s ease-in-out infinite; }

.modal-overlay { position: fixed; inset: 0; background: rgba(5,3,16,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-box { background: var(--bg-card); padding: 2rem; max-width: 560px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border-radius: 2px; animation: fadeInUp 0.3s ease; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.modal-type { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 0.5rem; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 20px; color: #e2d9f3; }

.form-tabs { display: flex; gap: 6px; margin-bottom: 1.5rem; }
.tab-btn { font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 8px 12px; background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; letter-spacing: 1px; }
.tab-btn.active { color: var(--accent-purple); border-color: var(--accent-purple); background: rgba(139,92,246,0.1); }
.tab-btn:hover:not(.active) { color: var(--text-secondary); border-color: var(--text-muted); }

.form-field { margin-bottom: 1rem; }
.form-field label { display: block; font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; margin-bottom: 6px; }
.form-field input, .form-field textarea { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; }
.form-field input:focus, .form-field textarea:focus { border-color: var(--accent-purple); }
.photo-hint { font-size: 11px; color: var(--text-muted); font-family: 'Share Tech Mono', monospace; margin-top: 5px; line-height: 1.5; }
.photo-preview { margin-top: 10px; width: 100%; height: 160px; background: var(--bg-deep); border: 1px solid var(--border-color); overflow: hidden; display: flex; align-items: center; justify-content: center; }
.photo-preview img { width: 100%; height: 100%; object-fit: cover; }
.photo-preview img.hidden { display: none; }
.preview-err { font-size: 11px; color: var(--accent-crimson); font-family: 'Share Tech Mono', monospace; text-align: center; padding: 1rem; }

.stat-edit-row { display: flex; align-items: center; gap: 8px; margin-bottom: 8px; }
.stat-name-input { flex: 1; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 12px; padding: 7px 10px; outline: none; }
.stat-val-input { width: 64px; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 12px; padding: 7px 8px; outline: none; text-align: center; }
.stat-color-input { width: 36px; height: 34px; border: 1px solid var(--border-color); padding: 2px; background: var(--bg-deep); cursor: pointer; }
.remove-stat { background: transparent; border: 1px solid var(--accent-crimson); color: var(--accent-crimson); cursor: pointer; font-size: 12px; padding: 5px 9px; transition: all 0.15s; }
.remove-stat:hover { background: var(--accent-crimson); color: white; }
.add-stat-btn { font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 8px 14px; background: transparent; color: var(--accent-purple); border: 1px dashed var(--accent-purple); cursor: pointer; transition: all 0.15s; margin-top: 4px; display: block; }
.add-stat-btn:hover { background: rgba(139,92,246,0.1); }
.cv-manager { display: flex; flex-direction: column; gap: 6px; }
.cv-actions { display: flex; gap: 8px; flex-wrap: wrap; margin-top: 4px; }
.cv-preview-btn { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 6px 10px; background: transparent; color: var(--accent-teal); border: 1px solid var(--accent-teal); text-decoration: none; transition: all 0.15s; }
.cv-preview-btn:hover { background: var(--accent-teal); color: var(--bg-deep); }
.cv-reset-btn { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 6px 10px; background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; }
.cv-reset-btn:hover { border-color: var(--accent-purple); color: var(--accent-purple); }
.reset-default-btn {
  width: 100%; margin-top: 10px;
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px; padding: 10px;
  background: transparent; cursor: pointer;
  border: 1px dashed #5c5078; color: #5c5078;
  transition: all 0.15s; letter-spacing: 1px;
}
.reset-default-btn:hover { border-color: var(--accent-crimson); color: var(--accent-crimson); }
.confirm-reset {
  margin-top: 12px; padding: 12px;
  background: rgba(220,38,38,0.08);
  border: 1px solid rgba(220,38,38,0.3);
  animation: fadeInUp 0.2s ease;
}
.confirm-reset p {
  font-size: 11px; color: #9d8fc0;
  font-family: 'Share Tech Mono', monospace;
  line-height: 1.6;
}

@media (max-width: 1024px) {
  .hero-container { gap: 2rem; }
  .name-main { font-size: 16px; letter-spacing: 4px; }
}

@media (max-width: 768px) {
  .hero-section { padding: 5rem 1.2rem 3rem; }
  .hero-container { grid-template-columns: 1fr; gap: 1.5rem; }
  .character-panel { max-width: 320px; margin: 0 auto; }
  .hero-right { text-align: center; }
  .stat-row { justify-content: center; }
  .stat-name { width: 110px; font-size: 11px; }
  .hero-ctas { justify-content: center; }
  .scroll-hint { margin-top: 2rem; }
}

@media (max-width: 480px) {
  .hero-section { padding: 4.5rem 1rem 2.5rem; }
  .character-panel { max-width: 100%; padding: 1.2rem; }
  .name-main { font-size: 14px; letter-spacing: 3px; }
  .name-sub { font-size: 10px; }
  .name-class { font-size: 7px; }
  .hero-desc { font-size: 13px; }
  .stat-name { width: 100px; font-size: 10px; }
  .stat-val { font-size: 11px; }
  .hero-tagline { font-size: 13px; }
  .hero-ctas { gap: 8px; }
  .btn-pixel { font-size: 8px; padding: 10px 14px; }
}
</style>
