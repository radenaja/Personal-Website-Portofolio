<template>
  <section id="projects" class="section">
    <div class="section-inner">
      <div class="section-header">
        <h2 class="section-title">QUEST LOG</h2>
        <div class="header-actions">
          <button v-if="isLoggedIn" class="btn-pixel" @click="openAdd">+ ADD PROJECT</button>
          <button v-if="isLoggedIn" class="btn-pixel crimson" @click="logout" style="font-size:8px;padding:8px 12px">LOGOUT</button>
        </div>
      </div>
      <p class="section-sub">// Projects I have shipped. Click a card for details.</p>

      <div class="filter-bar">
        <button v-for="f in filters" :key="f" class="filter-btn" :class="{ active: activeFilter === f }" @click="activeFilter = f">{{ f }}</button>
      </div>

      <div class="projects-grid">
        <div class="project-card pixel-border" v-for="project in filteredProjects" :key="project.id" @click="openDetail(project)">
          <div class="card-photo" v-if="project.photos && project.photos.length">
            <div class="photo-placeholder">
              <span class="placeholder-icon">◈</span>
              <span class="placeholder-text">{{ project.name }}</span>
            </div>
            <img
              :src="project.photos[0]"
              :alt="project.name"
              class="card-photo-img"
              @load="(e) => e.target.classList.add('loaded')"
              @error="(e) => e.target.style.display='none'"
            />
            <span class="photo-count" v-if="project.photos.length > 1">+{{ project.photos.length - 1 }} photos</span>
          </div>
          <div class="card-body">
            <div class="card-top">
              <span class="card-type">{{ project.type }}</span>
              <span class="card-status" :class="statusClass(project.status)">{{ project.status }}</span>
            </div>
            <h3 class="card-title">{{ project.name }}</h3>
            <p class="card-desc">{{ project.shortDesc }}</p>
            <div class="card-tags">
              <span class="tag" v-for="t in project.tech" :key="t">{{ t }}</span>
            </div>
            <div class="card-footer">
              <span class="card-year">{{ project.year }}</span>
              <div class="card-links">
                <a v-if="project.demo" :href="project.demo" target="_blank" class="link-btn teal" @click.stop>LIVE ↗</a>
                <a v-if="project.github" :href="project.github" target="_blank" class="link-btn" @click.stop>GITHUB ↗</a>
                <span class="card-cta">VIEW ›</span>
              </div>
            </div>
            <div class="card-admin" v-if="isLoggedIn" @click.stop>
              <button class="admin-btn edit" @click.stop="openEdit(project)">EDIT</button>
              <button class="admin-btn delete" @click.stop="confirmDelete(project)">DELETE</button>
            </div>
          </div>
        </div>
      </div>

      <!-- Detail Modal -->
      <div class="modal-overlay" v-if="selectedProject" @click.self="closeDetail">
        <div class="modal-box pixel-border">
          <button class="modal-close" @click="closeDetail">✕</button>
          <div class="photo-gallery" v-if="selectedProject.photos && selectedProject.photos.length">
            <img :src="selectedProject.photos[activePhoto]" :alt="selectedProject.name" class="gallery-main" @error="handleImgError" />
            <div class="gallery-thumbs" v-if="selectedProject.photos.length > 1">
              <img v-for="(p, i) in selectedProject.photos" :key="i" :src="p" :class="{ active: activePhoto === i }" @click="activePhoto = i" @error="handleImgError" />
            </div>
          </div>
          <div class="modal-type">{{ selectedProject.type }}</div>
          <h2 class="modal-title">{{ selectedProject.name }}</h2>
          <p class="modal-year">{{ selectedProject.year }} · <span :class="'status-' + statusClass(selectedProject.status)">{{ selectedProject.status }}</span></p>
          <div class="modal-section"><span class="modal-label">> PROBLEM</span><p>{{ selectedProject.problem }}</p></div>
          <div class="modal-section"><span class="modal-label">> SOLUTION</span><p>{{ selectedProject.solution }}</p></div>
          <div class="modal-section"><span class="modal-label">> RESULT</span><p>{{ selectedProject.result }}</p></div>
          <div class="modal-tech"><span class="tag" v-for="t in selectedProject.tech" :key="t">{{ t }}</span></div>
          <div class="modal-actions">
            <a v-if="selectedProject.demo" :href="selectedProject.demo" target="_blank" class="btn-pixel crimson">LIVE DEMO ↗</a>
            <a v-if="selectedProject.github" :href="selectedProject.github" target="_blank" class="btn-pixel">GITHUB ↗</a>
          </div>
        </div>
      </div>

      <!-- Add/Edit Form Modal -->
      <div class="modal-overlay" v-if="showForm" @click.self="showForm = false">
        <div class="modal-box pixel-border form-modal">
          <button class="modal-close" @click="showForm = false">✕</button>
          <div class="modal-type">{{ editingId ? 'EDIT QUEST' : 'NEW QUEST' }}</div>
          <h2 class="modal-title" style="margin-bottom:1.5rem">{{ editingId ? 'Edit Project' : 'Add Project' }}</h2>

          <div class="form-grid">
            <div class="form-field full"><label>Project Name *</label><input v-model="form.name" placeholder="e.g. SIMARA" /></div>
            <div class="form-field"><label>Type</label><select v-model="form.type"><option>WEB APP</option><option>SISTEM INFORMASI</option><option>PERSONAL</option><option>FREELANCE</option></select></div>
            <div class="form-field"><label>Status</label><select v-model="form.status"><option>COMPLETED</option><option>IN PROGRESS</option></select></div>
            <div class="form-field"><label>Year</label><input v-model="form.year" placeholder="2024" /></div>
            <div class="form-field full"><label>Short Description</label><input v-model="form.shortDesc" placeholder="One-liner description" /></div>
            <div class="form-field full"><label>Problem</label><textarea v-model="form.problem" rows="2" placeholder="What problem did this solve?"></textarea></div>
            <div class="form-field full"><label>Solution</label><textarea v-model="form.solution" rows="2" placeholder="How did you solve it?"></textarea></div>
            <div class="form-field full"><label>Result</label><textarea v-model="form.result" rows="2" placeholder="What was the outcome?"></textarea></div>
            <div class="form-field full"><label>Tech Stack (comma separated)</label><input v-model="form.techRaw" placeholder="Laravel, MySQL, Vue.js" /></div>
            <div class="form-field full"><label>Live Demo URL</label><input v-model="form.demo" placeholder="https://yourproject.com" /></div>
            <div class="form-field full"><label>GitHub URL</label><input v-model="form.github" placeholder="https://github.com/radenaja/..." /></div>
          </div>

          <div class="photos-section">
            <div class="photos-header">
              <label>Project Photos (max 10)</label>
              <span class="photos-hint">Paste URL gambar dari imgur.com atau hosting lain · <a href="https://imgur.com" target="_blank" style="color:var(--accent-purple)">Buka imgur.com ↗</a></span>
            </div>
            <div class="photo-inputs">
              <div class="photo-input-row" v-for="(url, i) in form.photos" :key="i">
                <span class="photo-num">{{ i + 1 }}</span>
                <input v-model="form.photos[i]" placeholder="https://i.imgur.com/xxxx.jpg" />
                <div class="photo-preview-mini" v-if="form.photos[i]">
                  <img :src="form.photos[i]" @error="handleImgError" />
                </div>
                <button class="remove-photo" @click="removePhoto(i)">✕</button>
              </div>
            </div>
            <button class="add-photo-btn" @click="addPhotoInput" v-if="form.photos.length < 10">+ ADD PHOTO URL</button>
            <div class="imgur-hint">Cara upload: imgur.com → New Post → upload → klik kanan gambar → Copy image address</div>
          </div>

          <button class="btn-pixel" style="width:100%;margin-top:1.5rem;font-size:10px;padding:14px" @click="submitForm">
            {{ editingId ? 'SAVE CHANGES' : 'ADD TO QUEST LOG' }}
          </button>
        </div>
      </div>

      <!-- Delete Confirm Modal -->
      <div class="modal-overlay" v-if="deleteTarget" @click.self="deleteTarget = null">
        <div class="modal-box pixel-border" style="max-width:400px;text-align:center">
          <div class="modal-type" style="color:#dc2626">WARNING</div>
          <h2 class="modal-title" style="margin-bottom:1rem">Delete Project?</h2>
          <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem;line-height:1.7">"{{ deleteTarget?.name }}" akan dihapus permanen.</p>
          <div style="display:flex;gap:12px;justify-content:center">
            <button class="btn-pixel crimson" @click="doDelete">DELETE</button>
            <button class="btn-pixel" @click="deleteTarget = null">CANCEL</button>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, computed } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useProjects } from '../stores/projects.js'

const { isLoggedIn, logout } = useAuth()
const { projects, addProject, updateProject, deleteProject } = useProjects()

const activeFilter = ref('ALL')
const selectedProject = ref(null)
const activePhoto = ref(0)
const showForm = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)
const filters = ['ALL', 'WEB APP', 'SISTEM INFORMASI', 'PERSONAL', 'FREELANCE']

const emptyForm = () => ({ name:'', type:'WEB APP', status:'COMPLETED', year:'', shortDesc:'', problem:'', solution:'', result:'', techRaw:'', demo:'', github:'', photos:[] })
const form = ref(emptyForm())

const filteredProjects = computed(() => activeFilter.value === 'ALL' ? projects.value : projects.value.filter(p => p.type === activeFilter.value))

function statusClass(s) { return s === 'IN PROGRESS' ? 'in-progress' : 'completed' }

function openDetail(p) { selectedProject.value = p; activePhoto.value = 0 }
function closeDetail() { selectedProject.value = null; activePhoto.value = 0 }

function openAdd() { editingId.value = null; form.value = emptyForm(); showForm.value = true }

function openEdit(p) {
  editingId.value = p.id
  form.value = { name:p.name, type:p.type, status:p.status, year:p.year, shortDesc:p.shortDesc, problem:p.problem, solution:p.solution, result:p.result, techRaw: Array.isArray(p.tech) ? p.tech.join(', ') : p.tech, demo:p.demo||'', github:p.github||'', photos:[...(p.photos||[])] }
  showForm.value = true
}

function confirmDelete(p) { deleteTarget.value = p }
function doDelete() { if (deleteTarget.value) { deleteProject(deleteTarget.value.id); deleteTarget.value = null } }

function addPhotoInput() { if (form.value.photos.length < 10) form.value.photos.push('') }
function removePhoto(i) { form.value.photos.splice(i, 1) }

function submitForm() {
  if (!form.value.name.trim()) return
  const data = { ...form.value, tech: form.value.techRaw, photos: form.value.photos.filter(p => p.trim()) }
  editingId.value ? updateProject(editingId.value, data) : addProject(data)
  showForm.value = false; form.value = emptyForm(); editingId.value = null
}

function handleImgError(e) { e.target.style.display = 'none' }
</script>

<style scoped>
.section { padding: 5rem 2rem; }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 0.5rem; }
.header-actions { display: flex; gap: 10px; align-items: center; }
.section-sub { font-size: 14px; color: var(--text-muted); margin-bottom: 2rem; }
.filter-bar { display: flex; flex-wrap: wrap; gap: 8px; margin-bottom: 2rem; }
.filter-btn { font-family: 'Press Start 2P', monospace; font-size: 9px; padding: 9px 14px; background: transparent; color: var(--text-muted); border: 1px solid var(--border-color); cursor: pointer; transition: all 0.15s; letter-spacing: 1px; }
.filter-btn:hover, .filter-btn.active { color: var(--accent-purple); border-color: var(--accent-purple); background: rgba(139,92,246,0.1); }
.projects-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(280px, 1fr)); gap: 14px; }

@media (max-width: 768px) {
  .section { padding: 4rem 1.2rem; }
  .projects-grid { grid-template-columns: 1fr; }
  .filter-btn { font-size: 7px; padding: 7px 10px; }
  .section-sub { font-size: 12px; }
  .card-title { font-size: 14px; }
  .card-desc { font-size: 12px; }
}

@media (max-width: 480px) {
  .section { padding: 3.5rem 1rem; }
  .filter-bar { gap: 6px; }
  .filter-btn { font-size: 6px; padding: 6px 8px; }
  .modal-box { padding: 1.2rem; }
  .form-grid { grid-template-columns: 1fr; }
  .form-field.full { grid-column: 1; }
}
.project-card { background: var(--bg-card); cursor: pointer; transition: all 0.2s; border-radius: 2px; overflow: hidden; }
.project-card:hover { background: var(--bg-card-hover); transform: translateY(-4px); box-shadow: 0 8px 30px rgba(139,92,246,0.2); }
.card-photo { width: 100%; height: 160px; overflow: hidden; position: relative; background: #0f0a1e; border-bottom: 1px solid var(--border-color); }
.photo-placeholder { position: absolute; inset: 0; display: flex; flex-direction: column; align-items: center; justify-content: center; gap: 8px; }
.placeholder-icon { font-size: 24px; color: #2d1f4e; }
.placeholder-text { font-family: "Press Start 2P", monospace; font-size: 7px; color: #2d1f4e; letter-spacing: 1px; text-align: center; padding: 0 1rem; }
.card-photo-img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: cover; transition: transform 0.3s, opacity 0.3s; opacity: 0; }
.card-photo-img.loaded { opacity: 1; }
.project-card:hover .card-photo-img { transform: scale(1.05); }
.photo-count { position: absolute; bottom: 8px; right: 8px; background: rgba(0,0,0,0.85); color: #e2d9f3; font-size: 10px; padding: 4px 10px; font-family: 'Share Tech Mono', monospace; border: 1px solid rgba(139,92,246,0.4); }
.card-body { padding: 1.2rem 1.5rem; }
.card-top { display: flex; justify-content: space-between; align-items: center; margin-bottom: 0.8rem; }
.card-type { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--text-muted); letter-spacing: 1px; }
.card-status { font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 4px 8px; }
.card-status.completed { background: rgba(20,184,166,0.15); color: var(--accent-teal); }
.card-status.in-progress { background: rgba(251,191,36,0.15); color: var(--accent-gold); }
.card-title { font-family: 'Orbitron', monospace; font-size: 16px; color: #e2d9f3; margin-bottom: 0.6rem; font-weight: 700; }
.card-desc { font-size: 13px; color: var(--text-secondary); line-height: 1.7; margin-bottom: 1rem; }
.card-tags { display: flex; flex-wrap: wrap; gap: 4px; margin-bottom: 1rem; }
.tag { font-size: 11px; padding: 4px 9px; background: rgba(139,92,246,0.12); border: 1px solid rgba(139,92,246,0.3); color: var(--accent-purple); font-family: 'Share Tech Mono', monospace; }
.card-footer { display: flex; justify-content: space-between; align-items: center; border-top: 1px solid var(--border-color); padding-top: 0.8rem; flex-wrap: wrap; gap: 6px; }
.card-year { font-size: 12px; color: var(--text-muted); }
.card-links { display: flex; align-items: center; gap: 8px; }
.link-btn { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 4px 8px; border: 1px solid var(--border-color); color: var(--text-muted); text-decoration: none; transition: all 0.15s; }
.link-btn:hover { border-color: var(--accent-purple); color: var(--accent-purple); }
.link-btn.teal:hover { border-color: var(--accent-teal); color: var(--accent-teal); }
.card-cta { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-crimson); }
.card-admin { display: flex; gap: 8px; margin-top: 10px; padding-top: 10px; border-top: 1px solid var(--border-color); }
.admin-btn { font-family: 'Press Start 2P', monospace; font-size: 7px; padding: 5px 10px; background: transparent; cursor: pointer; border: 1px solid; transition: all 0.15s; }
.admin-btn.edit { color: var(--accent-teal); border-color: var(--accent-teal); }
.admin-btn.edit:hover { background: var(--accent-teal); color: var(--bg-deep); }
.admin-btn.delete { color: var(--accent-crimson); border-color: var(--accent-crimson); }
.admin-btn.delete:hover { background: var(--accent-crimson); color: white; }
.modal-overlay { position: fixed; inset: 0; background: rgba(5,3,16,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-box { background: var(--bg-card); padding: 2rem; max-width: 640px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border-radius: 2px; animation: fadeInUp 0.3s ease; }
.form-modal { max-width: 680px; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.photo-gallery { margin-bottom: 1.5rem; overflow: hidden; }
.gallery-main { width: 100%; max-height: 320px; object-fit: cover; display: block; background: #0f0a1e; min-height: 200px; }
.gallery-thumbs { display: flex; gap: 6px; padding: 8px 0 0; flex-wrap: wrap; }
.gallery-thumbs img { width: 60px; height: 45px; object-fit: cover; cursor: pointer; border: 2px solid transparent; opacity: 0.6; transition: all 0.15s; }
.gallery-thumbs img.active, .gallery-thumbs img:hover { border-color: var(--accent-purple); opacity: 1; }
.modal-type { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 0.5rem; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 22px; color: #e2d9f3; margin-bottom: 4px; }
.modal-year { font-size: 13px; color: var(--text-muted); margin-bottom: 1.5rem; }
.status-completed { color: var(--accent-teal); }
.status-in-progress { color: var(--accent-gold); }
.modal-section { margin-bottom: 1rem; }
.modal-label { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-crimson); display: block; margin-bottom: 6px; }
.modal-section p { font-size: 14px; color: var(--text-secondary); line-height: 1.8; }
.modal-tech { display: flex; flex-wrap: wrap; gap: 4px; margin: 1.2rem 0; }
.modal-actions { display: flex; gap: 12px; margin-top: 1.2rem; flex-wrap: wrap; }
.form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
.form-field { display: flex; flex-direction: column; gap: 6px; }
.form-field.full { grid-column: 1 / -1; }
.form-field label { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; }
.form-field input, .form-field select, .form-field textarea { background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; }
.form-field input:focus, .form-field textarea:focus, .form-field select:focus { border-color: var(--accent-purple); }
.photos-section { margin-top: 1.5rem; padding-top: 1.5rem; border-top: 1px solid var(--border-color); }
.photos-header { margin-bottom: 1rem; }
.photos-header label { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; display: block; margin-bottom: 6px; }
.photos-hint { font-size: 11px; color: var(--text-muted); font-family: 'Share Tech Mono', monospace; }
.photo-inputs { display: flex; flex-direction: column; gap: 8px; margin-bottom: 10px; }
.photo-input-row { display: flex; align-items: center; gap: 8px; }
.photo-num { font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--text-muted); width: 16px; flex-shrink: 0; }
.photo-input-row input { flex: 1; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 12px; padding: 7px 10px; outline: none; }
.photo-input-row input:focus { border-color: var(--accent-purple); }
.photo-preview-mini { width: 44px; height: 33px; flex-shrink: 0; overflow: hidden; border: 1px solid var(--border-color); }
.photo-preview-mini img { width: 100%; height: 100%; object-fit: cover; }
.remove-photo { background: transparent; border: 1px solid var(--accent-crimson); color: var(--accent-crimson); cursor: pointer; font-size: 12px; padding: 5px 9px; transition: all 0.15s; flex-shrink: 0; }
.remove-photo:hover { background: var(--accent-crimson); color: white; }
.add-photo-btn { font-family: 'Press Start 2P', monospace; font-size: 8px; padding: 8px 14px; background: transparent; color: var(--accent-purple); border: 1px dashed var(--accent-purple); cursor: pointer; letter-spacing: 1px; transition: all 0.15s; margin-bottom: 10px; display: block; }
.add-photo-btn:hover { background: rgba(139,92,246,0.1); }
.imgur-hint { font-size: 11px; color: var(--text-muted); font-family: 'Share Tech Mono', monospace; line-height: 1.6; padding: 8px 12px; background: rgba(139,92,246,0.05); border: 1px solid var(--border-color); }
</style>
