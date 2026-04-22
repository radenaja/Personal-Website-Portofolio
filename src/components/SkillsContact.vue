<template>
  <section id="skills" class="section">
    <div class="section-inner">
      <div class="section-header">
        <h2 class="section-title">SKILL TREE</h2>
        <button v-if="isLoggedIn" class="btn-pixel" @click="openAddCategory">+ ADD CATEGORY</button>
      </div>
      <p class="section-sub">// Click a node to explore</p>

      <div class="skill-tree">
        <div class="skill-category" v-for="cat in skillCategories" :key="cat.id">
          <div class="cat-header">
            <span class="cat-icon">{{ cat.icon }}</span>
            <span class="cat-name">{{ cat.name }}</span>
            <div class="cat-admin" v-if="isLoggedIn">
              <button class="admin-btn-sm add" @click="openAddSkill(cat)">+ SKILL</button>
              <button class="admin-btn-sm delete" @click="confirmDeleteCategory(cat)">✕</button>
            </div>
          </div>
          <div class="skills-list">
            <div class="skill-node" v-for="skill in cat.skills" :key="skill.id" :class="{ active: selectedSkill?.id === skill.id }" @click="toggleSkill(skill)">
              <div class="node-header">
                <span class="node-name">{{ skill.name }}</span>
                <div style="display:flex;align-items:center;gap:8px">
                  <span class="node-level" :style="{ color: getLevelColor(skill.level) }">{{ skill.level }}</span>
                  <div class="node-admin" v-if="isLoggedIn" @click.stop>
                    <button class="admin-btn-xs edit" @click.stop="openEditSkill(cat, skill)">✎</button>
                    <button class="admin-btn-xs delete" @click.stop="confirmDeleteSkill(cat, skill)">✕</button>
                  </div>
                </div>
              </div>
              <div class="node-bar">
                <div class="node-fill" :style="{ width: skill.xp + '%', background: getLevelColor(skill.level) }"></div>
              </div>
              <div class="node-detail" v-if="selectedSkill?.id === skill.id">
                <p>{{ skill.detail }}</p>
                <div class="node-projects">
                  <span v-for="p in skill.projects" :key="p" class="tag">{{ p }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>

  <!-- Contact Section -->
  <section id="contact" class="section contact-section">
    <div class="section-inner">
      <h2 class="section-title">CONTACT</h2>
      <div class="contact-wrap">
        <div class="contact-left">
          <p class="contact-intro">Tertarik untuk berkolaborasi atau ada posisi yang cocok?<br>Kirim pesan — aku akan balas secepatnya.</p>
          <div class="contact-links">
            <a class="contact-link" :href="'mailto:' + profile.email"><span class="link-icon">@</span><span>{{ profile.email }}</span></a>
            <a class="contact-link" :href="'tel:' + profile.phone"><span class="link-icon">☎</span><span>{{ profile.phone }}</span></a>
            <div class="contact-link"><span class="link-icon">📍</span><span>{{ profile.location }}</span></div>
            <a class="contact-link" :href="profile.github" target="_blank"><span class="link-icon">GH</span><span>{{ profile.github.replace('https://','') }}</span></a>
            <a class="contact-link" :href="profile.linkedin" target="_blank"><span class="link-icon">LI</span><span>LinkedIn Profile</span></a>
            <a class="contact-link" :href="profile.personalDrive" target="_blank" v-if="profile.personalDrive"><span class="link-icon">GD</span><span>Personal Drive</span></a>
          </div>
        </div>
        <div class="contact-right">
          <div class="contact-form pixel-border">
            <div class="form-row"><label>NAME_</label><input v-model="form.name" placeholder="Your name" /></div>
            <div class="form-row"><label>EMAIL_</label><input v-model="form.email" type="email" placeholder="your@email.com" /></div>
            <div class="form-row"><label>MESSAGE_</label><textarea v-model="form.message" rows="4" placeholder="What's on your mind?"></textarea></div>
            <div class="send-error" v-if="sendError">✗ {{ sendError }}</div>
            <button
              class="send-btn-custom"
              :style="sendBtnStyle"
              @click="sendMessage"
              @mouseenter="btnHover = true"
              @mouseleave="btnHover = false"
              :disabled="sending || sent"
            >
              <span v-if="sending">SENDING...</span>
              <span v-else-if="sent">✓ MESSAGE SENT!</span>
              <span v-else>SEND MESSAGE</span>
            </button>
          </div>
        </div>
      </div>
    </div>
    <div class="footer">
      <span>RADEN ARADEYA RISQI JAGAT PERTALA</span>
      <span class="footer-copy">© {{ new Date().getFullYear() }} — Built with Love</span>
    </div>
  </section>

  <!-- Add/Edit Skill Modal -->
  <div class="modal-overlay" v-if="showSkillForm" @click.self="showSkillForm = false">
    <div class="modal-box pixel-border">
      <button class="modal-close" @click="showSkillForm = false">✕</button>
      <div class="modal-type">{{ editingSkillId ? 'EDIT' : 'NEW' }} SKILL</div>
      <h2 class="modal-title" style="margin-bottom:1.5rem">{{ editingSkillId ? 'Edit Skill' : 'Add Skill' }}</h2>
      <div class="form-field"><label>Skill Name</label><input v-model="skillForm.name" placeholder="e.g. Laravel" /></div>
      <div class="form-field">
        <label>Level</label>
        <select v-model="skillForm.level">
          <option>BEGINNER</option><option>INTERMEDIATE</option><option>ADVANCED</option><option>MASTER</option>
        </select>
      </div>
      <div class="form-field"><label>XP (0-100)</label><input v-model="skillForm.xp" type="number" min="0" max="100" placeholder="85" /></div>
      <div class="form-field"><label>Description</label><textarea v-model="skillForm.detail" rows="3" placeholder="Describe your experience with this skill..."></textarea></div>
      <div class="form-field"><label>Related Projects (comma separated)</label><input v-model="skillForm.projectsRaw" placeholder="SIMARA, Koperasi BE" /></div>
      <button class="btn-pixel" style="width:100%;margin-top:1rem;padding:12px" @click="submitSkill">
        {{ editingSkillId ? 'SAVE CHANGES' : 'ADD SKILL' }}
      </button>
    </div>
  </div>

  <!-- Add Category Modal -->
  <div class="modal-overlay" v-if="showCatForm" @click.self="showCatForm = false">
    <div class="modal-box pixel-border" style="max-width:420px">
      <button class="modal-close" @click="showCatForm = false">✕</button>
      <div class="modal-type">NEW CATEGORY</div>
      <h2 class="modal-title" style="margin-bottom:1.5rem">Add Category</h2>
      <div class="form-field"><label>Icon</label><input v-model="catForm.icon" placeholder="⚙" maxlength="4" /></div>
      <div class="form-field"><label>Category Name</label><input v-model="catForm.name" placeholder="e.g. Mobile Dev" /></div>
      <button class="btn-pixel" style="width:100%;margin-top:1rem;padding:12px" @click="submitCategory">ADD CATEGORY</button>
    </div>
  </div>

  <!-- Delete Skill Confirm -->
  <div class="modal-overlay" v-if="deleteSkillTarget" @click.self="deleteSkillTarget = null">
    <div class="modal-box pixel-border" style="max-width:380px;text-align:center">
      <div class="modal-type" style="color:#dc2626">WARNING</div>
      <h2 class="modal-title" style="margin-bottom:1rem">Delete Skill?</h2>
      <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem">"{{ deleteSkillTarget?.skill?.name }}"</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn-pixel crimson" @click="doDeleteSkill">DELETE</button>
        <button class="btn-pixel" @click="deleteSkillTarget = null">CANCEL</button>
      </div>
    </div>
  </div>

  <!-- Delete Category Confirm -->
  <div class="modal-overlay" v-if="deleteCatTarget" @click.self="deleteCatTarget = null">
    <div class="modal-box pixel-border" style="max-width:380px;text-align:center">
      <div class="modal-type" style="color:#dc2626">WARNING</div>
      <h2 class="modal-title" style="margin-bottom:1rem">Delete Category?</h2>
      <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem">Semua skill di "{{ deleteCatTarget?.name }}" akan ikut terhapus.</p>
      <div style="display:flex;gap:12px;justify-content:center">
        <button class="btn-pixel crimson" @click="doDeleteCategory">DELETE</button>
        <button class="btn-pixel" @click="deleteCatTarget = null">CANCEL</button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useSkills } from '../stores/skills.js'
import { useProfile } from '../stores/profile.js'

const { isLoggedIn } = useAuth()
const { skillCategories, addSkill, updateSkill, deleteSkill, addCategory, deleteCategory } = useSkills()
const { profile } = useProfile()

const selectedSkill = ref(null)
const sent = ref(false)
const sending = ref(false)
const sendError = ref('')
const btnHover = ref(false)
const form = ref({ name:'', email:'', message:'' })

const EMAILJS_SERVICE_ID = 'service_4piwiao'
const EMAILJS_TEMPLATE_ID = 'template_d4dp57l'
const EMAILJS_PUBLIC_KEY = 'dP9zB3G9NxVv1_GWC'

onMounted(() => {
  if (!window.emailjs) {
    const script = document.createElement('script')
    script.src = 'https://cdn.jsdelivr.net/npm/@emailjs/browser@4/dist/email.min.js'
    script.onload = () => {
      window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
    }
    document.head.appendChild(script)
  } else {
    window.emailjs.init({ publicKey: EMAILJS_PUBLIC_KEY })
  }
})

function toggleSkill(skill) {
  selectedSkill.value = selectedSkill.value?.id === skill.id ? null : skill
}

function getLevelColor(level) {
  return { 'MASTER':'#fbbf24', 'ADVANCED':'#f97316', 'INTERMEDIATE':'#8b5cf6', 'BEGINNER':'#60a5fa' }[level] || '#8b5cf6'
}

const sendBtnStyle = computed(() => {
  const isDisabled = sending.value || sent.value
  const isHovered = btnHover.value && !isDisabled

  if (sent.value) {
    return {
      width: '100%',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px', padding: '14px',
      cursor: 'default', letterSpacing: '1px',
      border: '2px solid #16a34a',
      background: '#16a34a', color: '#ffffff',
      boxShadow: '0 0 24px rgba(22,163,74,0.6)',
      transition: 'all 0.3s ease',
    }
  }
  if (sendError.value) {
    return {
      width: '100%',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px', padding: '14px',
      cursor: 'pointer', letterSpacing: '1px',
      border: '2px solid #dc2626',
      background: isHovered ? '#dc2626' : 'transparent',
      color: isHovered ? '#ffffff' : '#dc2626',
      boxShadow: isHovered ? '0 0 24px rgba(220,38,38,0.6)' : 'none',
      transform: isHovered ? 'translateY(-2px)' : 'none',
      transition: 'all 0.15s ease',
    }
  }
  if (sending.value) {
    return {
      width: '100%',
      fontFamily: "'Press Start 2P', monospace",
      fontSize: '10px', padding: '14px',
      cursor: 'not-allowed', letterSpacing: '1px',
      border: '2px solid #5c5078',
      background: 'transparent', color: '#5c5078',
      boxShadow: 'none', opacity: '0.7',
      transition: 'all 0.15s ease',
    }
  }
  // Default / hover state
  return {
    width: '100%',
    fontFamily: "'Press Start 2P', monospace",
    fontSize: '10px', padding: '14px',
    cursor: 'pointer', letterSpacing: '1px',
    border: '2px solid #8b5cf6',
    background: isHovered ? '#8b5cf6' : 'transparent',
    color: isHovered ? '#0a0612' : '#8b5cf6',
    boxShadow: isHovered ? '0 0 20px rgba(139,92,246,0.6)' : 'none',
    transform: isHovered ? 'translateY(-2px)' : 'none',
    transition: 'all 0.15s ease',
  }
})

async function sendMessage() {
  if (!form.value.name || !form.value.message) return
  if (!form.value.email) { sendError.value = 'Email wajib diisi.'; return }
  sending.value = true
  sendError.value = ''
  try {
    await window.emailjs.send(
      EMAILJS_SERVICE_ID,
      EMAILJS_TEMPLATE_ID,
      {
        from_name: form.value.name,
        from_email: form.value.email,
        message: form.value.message,
      }
    )
    sent.value = true
    form.value = { name:'', email:'', message:'' }
    setTimeout(() => { sent.value = false }, 4000)
  } catch(err) {
    sendError.value = 'Gagal kirim pesan. Coba lagi ya!'
    console.error('EmailJS error:', err)
  } finally {
    sending.value = false
  }
}

// Skill CRUD
const showSkillForm = ref(false)
const editingSkillId = ref(null)
const editingCatId = ref(null)
const deleteSkillTarget = ref(null)
const emptySkill = () => ({ name:'', level:'INTERMEDIATE', xp:50, detail:'', projectsRaw:'' })
const skillForm = ref(emptySkill())

function openAddSkill(cat) {
  editingCatId.value = cat.id; editingSkillId.value = null
  skillForm.value = emptySkill(); showSkillForm.value = true
}
function openEditSkill(cat, skill) {
  editingCatId.value = cat.id; editingSkillId.value = skill.id
  skillForm.value = { name:skill.name, level:skill.level, xp:skill.xp, detail:skill.detail, projectsRaw: Array.isArray(skill.projects) ? skill.projects.join(', ') : skill.projects }
  showSkillForm.value = true
}
function confirmDeleteSkill(cat, skill) { deleteSkillTarget.value = { cat, skill } }
function doDeleteSkill() { deleteSkill(deleteSkillTarget.value.cat.id, deleteSkillTarget.value.skill.id); deleteSkillTarget.value = null }
function submitSkill() {
  if (!skillForm.value.name.trim()) return
  const data = { ...skillForm.value, projects: skillForm.value.projectsRaw }
  editingSkillId.value ? updateSkill(editingCatId.value, editingSkillId.value, data) : addSkill(editingCatId.value, data)
  showSkillForm.value = false; skillForm.value = emptySkill(); editingSkillId.value = null
}

// Category CRUD
const showCatForm = ref(false)
const deleteCatTarget = ref(null)
const catForm = ref({ icon:'⚙', name:'' })

function openAddCategory() { catForm.value = { icon:'⚙', name:'' }; showCatForm.value = true }
function confirmDeleteCategory(cat) { deleteCatTarget.value = cat }
function doDeleteCategory() { deleteCategory(deleteCatTarget.value.id); deleteCatTarget.value = null }
function submitCategory() {
  if (!catForm.value.name.trim()) return
  addCategory(catForm.value); showCatForm.value = false; catForm.value = { icon:'⚙', name:'' }
}
</script>

<style scoped>
.section { padding: 6rem 2rem; }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 0.5rem; }
.section-sub { font-size: 14px; color: var(--text-muted); margin-top: 0; margin-bottom: 2rem; }

.skill-tree { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 2rem; }
.cat-header { display: flex; align-items: center; gap: 10px; margin-bottom: 1rem; flex-wrap: wrap; }
.cat-icon { font-size: 18px; }
.cat-name { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--text-secondary); letter-spacing: 2px; flex: 1; }
.cat-admin { display: flex; gap: 6px; }
.admin-btn-sm { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 4px 8px; background: transparent; cursor: pointer; border: 1px solid; transition: all 0.15s; }
.admin-btn-sm.add { color: var(--accent-teal); border-color: var(--accent-teal); }
.admin-btn-sm.add:hover { background: var(--accent-teal); color: var(--bg-deep); }
.admin-btn-sm.delete { color: var(--accent-crimson); border-color: var(--accent-crimson); }
.admin-btn-sm.delete:hover { background: var(--accent-crimson); color: white; }

.skill-node { background: var(--bg-card); border: 1px solid var(--border-color); padding: 0.8rem 1rem; margin-bottom: 8px; cursor: pointer; transition: all 0.15s; }
.skill-node:hover, .skill-node.active { border-color: var(--accent-purple); background: var(--bg-card-hover); }
.node-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 6px; }
.node-name { font-size: 14px; color: #e2d9f3; }
.node-level { font-family: 'Press Start 2P', monospace; font-size: 8px; letter-spacing: 1px; }
.node-admin { display: flex; gap: 4px; }
.admin-btn-xs { font-size: 10px; padding: 2px 6px; background: transparent; cursor: pointer; border: 1px solid; transition: all 0.15s; line-height: 1; }
.admin-btn-xs.edit { color: var(--accent-teal); border-color: var(--accent-teal); }
.admin-btn-xs.edit:hover { background: var(--accent-teal); color: var(--bg-deep); }
.admin-btn-xs.delete { color: var(--accent-crimson); border-color: var(--accent-crimson); }
.admin-btn-xs.delete:hover { background: var(--accent-crimson); color: white; }
.node-bar { height: 3px; background: var(--bg-deep); border: 1px solid var(--border-color); margin-bottom: 4px; }
.node-fill { height: 100%; transition: width 1s ease; }
.node-detail { margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); animation: fadeInUp 0.2s ease; }
.node-detail p { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 8px; }
.node-projects { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-size: 11px; padding: 4px 9px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--accent-purple); font-family: 'Share Tech Mono', monospace; }

.contact-section { border-top: 1px solid var(--border-color); }
.contact-wrap { display: grid; grid-template-columns: 1fr 1fr; gap: 3rem; align-items: start; }
.contact-intro { font-size: 15px; color: var(--text-secondary); line-height: 2; margin-bottom: 2rem; }
.contact-links { display: flex; flex-direction: column; gap: 12px; }
.contact-link { display: flex; align-items: center; gap: 12px; text-decoration: none; color: var(--text-secondary); font-size: 14px; transition: color 0.15s; }
.contact-link:hover { color: var(--accent-purple); }
.link-icon { font-family: 'Press Start 2P', monospace; font-size: 10px; color: var(--accent-purple); width: 32px; text-align: center; }
.contact-form { background: var(--bg-card); padding: 1.5rem; border-radius: 2px; }
.form-row { margin-bottom: 1rem; }
.form-row label { display: block; font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 6px; }
.form-row input, .form-row textarea { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 14px; padding: 9px 12px; outline: none; }
.form-row input:focus, .form-row textarea:focus { border-color: var(--accent-purple); }
.footer { margin-top: 5rem; border-top: 1px solid var(--border-color); padding: 2rem; display: flex; justify-content: space-between; align-items: center; flex-wrap: wrap; gap: 1rem; }
.footer span { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--text-muted); letter-spacing: 2px; }
.footer-copy { color: var(--accent-purple) !important; }

.modal-overlay { position: fixed; inset: 0; background: rgba(5,3,16,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-box { background: var(--bg-card); padding: 2rem; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border-radius: 2px; animation: fadeInUp 0.3s ease; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.modal-type { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 0.5rem; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 20px; color: #e2d9f3; }
.form-field { margin-bottom: 1rem; }
.form-field label { display: block; font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; margin-bottom: 6px; }
.form-field input, .form-field select, .form-field textarea { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; }
.form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color: var(--accent-purple); }

@media (max-width: 1024px) {
  .skill-tree { grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 1.5rem; }
}

@media (max-width: 768px) {
  .section { padding: 4rem 1.2rem; }
  .contact-wrap { grid-template-columns: 1fr; gap: 2rem; }
  .skill-tree { grid-template-columns: 1fr; }
  .node-name { font-size: 13px; }
  .node-level { font-size: 7px; }
  .section-header { flex-direction: column; align-items: flex-start; gap: 8px; }
  .cat-header { flex-wrap: wrap; }
  .contact-intro { font-size: 13px; }
  .footer { flex-direction: column; text-align: center; gap: 0.5rem; }
  .footer span { font-size: 7px; }
}

@media (max-width: 480px) {
  .section { padding: 3rem 1rem; }
  .cat-name { font-size: 8px; }
  .node-name { font-size: 12px; }
  .contact-link { font-size: 12px; }
  .link-icon { font-size: 9px; width: 28px; }
  .form-row label { font-size: 7px; }
  .form-row input, .form-row textarea { font-size: 13px; padding: 8px 10px; }
  .modal-box { padding: 1.2rem; max-width: 100%; }
}
</style>
