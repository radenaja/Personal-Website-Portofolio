<template>
  <section id="achievements" class="section">
    <div class="section-inner">

      <!-- ACHIEVEMENTS -->
      <div class="section-header">
        <h2 class="section-title">ACHIEVEMENTS</h2>
        <button v-if="isLoggedIn" class="btn-pixel" @click="openAddAch">+ ADD</button>
      </div>

      <div class="achievements-grid">
        <div class="achievement-card" v-for="a in achievements" :key="a.id" :class="{ locked: a.locked }">
          <div class="ach-icon">{{ a.icon }}</div>
          <div class="ach-info">
            <div class="ach-name">{{ a.name }}</div>
            <div class="ach-desc">{{ a.locked ? '???????????' : a.desc }}</div>
            <div class="ach-year" v-if="!a.locked && a.year">{{ a.year }}</div>
          </div>
          <div class="ach-right">
            <div class="ach-badge" v-if="!a.locked">✓</div>
            <div class="ach-badge locked-icon" v-else>🔒</div>
            <div class="ach-admin" v-if="isLoggedIn">
              <button class="admin-btn edit" @click="openEditAch(a)">✎</button>
              <button class="admin-btn delete" @click="confirmDeleteAch(a)">✕</button>
            </div>
          </div>
        </div>
      </div>

      <!-- QUEST TIMELINE -->
      <div class="section-header" style="margin-top:5rem">
        <h2 class="section-title">QUEST TIMELINE</h2>
        <button v-if="isLoggedIn" class="btn-pixel" @click="openAddTimeline">+ ADD</button>
      </div>

      <div class="timeline">
        <div class="timeline-line"></div>
        <div class="timeline-item" v-for="(item, i) in timeline" :key="item.id" :class="{ right: i % 2 !== 0 }">
          <div class="timeline-dot"></div>
          <div class="timeline-card pixel-border">
            <div class="tl-admin" v-if="isLoggedIn">
              <button class="admin-btn edit" @click="openEditTimeline(item)">✎ EDIT</button>
              <button class="admin-btn delete" @click="confirmDeleteTimeline(item)">✕ DELETE</button>
            </div>
            <span class="tl-year">{{ item.year }}</span>
            <h3 class="tl-title">{{ item.title }}</h3>
            <p class="tl-desc">{{ item.desc }}</p>
            <div class="tl-tags">
              <span class="tag" v-for="t in item.tags" :key="t">{{ t }}</span>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Achievement Form Modal -->
    <div class="modal-overlay" v-if="showAchForm" @click.self="showAchForm = false">
      <div class="modal-box pixel-border">
        <button class="modal-close" @click="showAchForm = false">✕</button>
        <div class="modal-type">{{ editingAchId ? 'EDIT' : 'NEW' }} ACHIEVEMENT</div>
        <h2 class="modal-title" style="margin-bottom:1.5rem">{{ editingAchId ? 'Edit Achievement' : 'Add Achievement' }}</h2>
        <div class="form-field"><label>Icon (emoji)</label><input v-model="achForm.icon" placeholder="🏆" maxlength="4" /></div>
        <div class="form-field"><label>Name</label><input v-model="achForm.name" placeholder="Achievement name" /></div>
        <div class="form-field"><label>Description</label><input v-model="achForm.desc" placeholder="What did you achieve?" /></div>
        <div class="form-field"><label>Year</label><input v-model="achForm.year" placeholder="2024" /></div>
        <div class="form-field">
          <label>Status</label>
          <select v-model="achForm.locked">
            <option :value="false">Unlocked ✓</option>
            <option :value="true">Locked 🔒</option>
          </select>
        </div>
        <button class="btn-pixel" style="width:100%;margin-top:1rem;padding:12px" @click="submitAch">
          {{ editingAchId ? 'SAVE CHANGES' : 'ADD ACHIEVEMENT' }}
        </button>
      </div>
    </div>

    <!-- Achievement Delete Confirm -->
    <div class="modal-overlay" v-if="deleteAchTarget" @click.self="deleteAchTarget = null">
      <div class="modal-box pixel-border" style="max-width:380px;text-align:center">
        <div class="modal-type" style="color:#dc2626">WARNING</div>
        <h2 class="modal-title" style="margin-bottom:1rem">Delete Achievement?</h2>
        <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem">"{{ deleteAchTarget?.name }}"</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn-pixel crimson" @click="doDeleteAch">DELETE</button>
          <button class="btn-pixel" @click="deleteAchTarget = null">CANCEL</button>
        </div>
      </div>
    </div>

    <!-- Timeline Form Modal -->
    <div class="modal-overlay" v-if="showTlForm" @click.self="showTlForm = false">
      <div class="modal-box pixel-border">
        <button class="modal-close" @click="showTlForm = false">✕</button>
        <div class="modal-type">{{ editingTlId ? 'EDIT' : 'NEW' }} QUEST ENTRY</div>
        <h2 class="modal-title" style="margin-bottom:1.5rem">{{ editingTlId ? 'Edit Timeline' : 'Add Timeline' }}</h2>
        <div class="form-field"><label>Year</label><input v-model="tlForm.year" placeholder="2024" /></div>
        <div class="form-field"><label>Title</label><input v-model="tlForm.title" placeholder="e.g. First Internship" /></div>
        <div class="form-field"><label>Description</label><textarea v-model="tlForm.desc" rows="3" placeholder="What happened?"></textarea></div>
        <div class="form-field"><label>Tags (comma separated)</label><input v-model="tlForm.tagsRaw" placeholder="Laravel, PHP, MySQL" /></div>
        <button class="btn-pixel" style="width:100%;margin-top:1rem;padding:12px" @click="submitTimeline">
          {{ editingTlId ? 'SAVE CHANGES' : 'ADD ENTRY' }}
        </button>
      </div>
    </div>

    <!-- Timeline Delete Confirm -->
    <div class="modal-overlay" v-if="deleteTlTarget" @click.self="deleteTlTarget = null">
      <div class="modal-box pixel-border" style="max-width:380px;text-align:center">
        <div class="modal-type" style="color:#dc2626">WARNING</div>
        <h2 class="modal-title" style="margin-bottom:1rem">Delete Entry?</h2>
        <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem">"{{ deleteTlTarget?.title }}"</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn-pixel crimson" @click="doDeleteTimeline">DELETE</button>
          <button class="btn-pixel" @click="deleteTlTarget = null">CANCEL</button>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useAchievements } from '../stores/achievements.js'
import { useTimeline } from '../stores/timeline.js'

const { isLoggedIn } = useAuth()
const { achievements, addAchievement, updateAchievement, deleteAchievement } = useAchievements()
const { timeline, addEntry, updateEntry, deleteEntry } = useTimeline()

// Achievement state
const showAchForm = ref(false)
const editingAchId = ref(null)
const deleteAchTarget = ref(null)
const emptyAch = () => ({ icon:'🏆', name:'', desc:'', year:'', locked:false })
const achForm = ref(emptyAch())

function openAddAch() { editingAchId.value = null; achForm.value = emptyAch(); showAchForm.value = true }
function openEditAch(a) { editingAchId.value = a.id; achForm.value = { icon:a.icon, name:a.name, desc:a.desc, year:a.year, locked:a.locked }; showAchForm.value = true }
function confirmDeleteAch(a) { deleteAchTarget.value = a }
function doDeleteAch() { deleteAchievement(deleteAchTarget.value.id); deleteAchTarget.value = null }
function submitAch() {
  if (!achForm.value.name.trim()) return
  editingAchId.value ? updateAchievement(editingAchId.value, achForm.value) : addAchievement(achForm.value)
  showAchForm.value = false; achForm.value = emptyAch(); editingAchId.value = null
}

// Timeline state
const showTlForm = ref(false)
const editingTlId = ref(null)
const deleteTlTarget = ref(null)
const emptyTl = () => ({ year:'', title:'', desc:'', tagsRaw:'' })
const tlForm = ref(emptyTl())

function openAddTimeline() { editingTlId.value = null; tlForm.value = emptyTl(); showTlForm.value = true }
function openEditTimeline(item) {
  editingTlId.value = item.id
  tlForm.value = { year:item.year, title:item.title, desc:item.desc, tagsRaw: Array.isArray(item.tags) ? item.tags.join(', ') : item.tags }
  showTlForm.value = true
}
function confirmDeleteTimeline(item) { deleteTlTarget.value = item }
function doDeleteTimeline() { deleteEntry(deleteTlTarget.value.id); deleteTlTarget.value = null }
function submitTimeline() {
  if (!tlForm.value.title.trim()) return
  const data = { ...tlForm.value, tags: tlForm.value.tagsRaw }
  editingTlId.value ? updateEntry(editingTlId.value, data) : addEntry(data)
  showTlForm.value = false; tlForm.value = emptyTl(); editingTlId.value = null
}
</script>

<style scoped>
.section { padding: 6rem 2rem; }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 2rem; }

.achievements-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 12px; }
.achievement-card { background: var(--bg-card); border: 1px solid var(--border-color); padding: 1rem 1.25rem; display: flex; align-items: center; gap: 12px; position: relative; transition: all 0.2s; }
.achievement-card:not(.locked):hover { border-color: var(--accent-gold); box-shadow: 0 0 15px rgba(251,191,36,0.2); }
.achievement-card.locked { opacity: 0.4; filter: grayscale(1); }
.ach-icon { font-size: 24px; flex-shrink: 0; }
.ach-info { flex: 1; }
.ach-name { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-gold); margin-bottom: 4px; line-height: 1.5; }
.ach-desc { font-size: 12px; color: var(--text-secondary); line-height: 1.5; }
.ach-year { font-size: 10px; color: var(--text-muted); margin-top: 4px; font-family: 'Share Tech Mono', monospace; }
.ach-right { display: flex; flex-direction: column; align-items: center; gap: 8px; flex-shrink: 0; }
.ach-badge { font-size: 14px; color: var(--accent-teal); font-family: 'Press Start 2P', monospace; }
.ach-admin { display: flex; gap: 4px; }
.admin-btn { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 4px 7px; background: transparent; cursor: pointer; border: 1px solid; transition: all 0.15s; }
.admin-btn.edit { color: var(--accent-teal); border-color: var(--accent-teal); }
.admin-btn.edit:hover { background: var(--accent-teal); color: var(--bg-deep); }
.admin-btn.delete { color: var(--accent-crimson); border-color: var(--accent-crimson); }
.admin-btn.delete:hover { background: var(--accent-crimson); color: white; }

.timeline { position: relative; padding: 1rem 0; }
.timeline-line { position: absolute; left: 50%; top: 0; bottom: 0; width: 2px; background: linear-gradient(to bottom, var(--accent-purple), var(--accent-crimson)); transform: translateX(-50%); }
.timeline-item { display: flex; justify-content: flex-end; padding-right: calc(50% + 2rem); margin-bottom: 2.5rem; position: relative; }
.timeline-item.right { justify-content: flex-start; padding-right: 0; padding-left: calc(50% + 2rem); }
.timeline-dot { position: absolute; left: 50%; top: 1.2rem; width: 10px; height: 10px; background: var(--accent-purple); border: 2px solid var(--bg-deep); transform: translateX(-50%); animation: pulse-glow 2s ease-in-out infinite; }
.timeline-card { background: var(--bg-card); padding: 1.2rem 1.5rem; max-width: 420px; width: 100%; border-radius: 2px; }
.tl-admin { display: flex; gap: 8px; margin-bottom: 10px; }
.tl-year { font-family: 'Press Start 2P', monospace; font-size: 10px; color: var(--accent-crimson); display: block; margin-bottom: 6px; }
.tl-title { font-family: 'Orbitron', monospace; font-size: 16px; color: #e2d9f3; margin-bottom: 6px; }
.tl-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 10px; }
.tl-tags { display: flex; flex-wrap: wrap; gap: 4px; }
.tag { font-size: 11px; padding: 4px 9px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--accent-purple); font-family: 'Share Tech Mono', monospace; }

.modal-overlay { position: fixed; inset: 0; background: rgba(5,3,16,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-box { background: var(--bg-card); padding: 2rem; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border-radius: 2px; animation: fadeInUp 0.3s ease; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.modal-type { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 0.5rem; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 20px; color: #e2d9f3; }
.form-field { margin-bottom: 1rem; }
.form-field label { display: block; font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; margin-bottom: 6px; }
.form-field input, .form-field select, .form-field textarea { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; }
.form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color: var(--accent-purple); }

@media (max-width: 768px) {
  .section { padding: 4rem 1.2rem; }
  .achievements-grid { grid-template-columns: 1fr; }
  .timeline-line { left: 1rem; }
  .timeline-item, .timeline-item.right { padding-right: 0; padding-left: 3rem; justify-content: flex-start; }
  .timeline-dot { left: 1rem; }
  .timeline-card { padding: 1rem 1.2rem; }
  .tl-title { font-size: 13px; }
  .tl-desc { font-size: 12px; }
  .ach-name { font-size: 8px; }
  .ach-desc { font-size: 11px; }
  .section-header { flex-direction: column; align-items: flex-start; }
}

@media (max-width: 480px) {
  .section { padding: 3rem 1rem; }
  .achievement-card { padding: 0.8rem 1rem; gap: 8px; }
  .ach-icon { font-size: 20px; }
  .ach-name { font-size: 7px; }
  .ach-desc { font-size: 10px; }
  .timeline-item, .timeline-item.right { padding-left: 2.5rem; }
  .tl-title { font-size: 12px; }
  .tl-year { font-size: 9px; }
  .modal-box { padding: 1.2rem; }
}
</style>
