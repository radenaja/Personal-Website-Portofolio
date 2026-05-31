<template>
  <section id="certifications" class="section">
    <div class="section-inner">

      <div class="section-header">
        <h2 class="section-title">CERTIFICATIONS</h2>
        <button v-if="isLoggedIn" class="btn-pixel" @click="openAdd">+ ADD</button>
      </div>
      <p class="section-sub">// Verified credentials & completed courses</p>

      <div class="cert-grid">
        <div class="cert-card pixel-border" v-for="c in certifications" :key="c.id">

          <!-- Certificate Image -->
          <div class="cert-image-wrap" v-if="c.photoUrl">
            <img :src="c.photoUrl" :alt="c.name" class="cert-image" @click="openPreview(c)" />
            <div class="cert-image-overlay" @click="openPreview(c)">
              <span class="preview-label">🔍 VIEW</span>
            </div>
          </div>
          <div class="cert-image-placeholder" v-else>
            <span>📜</span>
          </div>

          <!-- Certificate Info -->
          <div class="cert-info">
            <div class="cert-issuer">{{ c.issuer }}</div>
            <div class="cert-name">{{ c.name }}</div>
            <div class="cert-platform">{{ c.platform }}</div>

            <div class="cert-tags">
              <span class="tag" v-for="t in c.tags" :key="t">{{ t }}</span>
            </div>

            <div class="cert-footer">
              <span class="cert-date">{{ c.month }} {{ c.year }}</span>
              <a
                v-if="c.verifyUrl"
                :href="c.verifyUrl"
                target="_blank"
                rel="noopener"
                class="cert-verify"
              >🔗 Verify</a>
            </div>

            <!-- Admin buttons -->
            <div class="cert-admin" v-if="isLoggedIn">
              <button class="admin-btn edit" @click="openEdit(c)">✎ EDIT</button>
              <button class="admin-btn delete" @click="confirmDelete(c)">✕ DELETE</button>
            </div>
          </div>

        </div>
      </div>
    </div>

    <!-- Image Preview Modal -->
    <div class="modal-overlay" v-if="previewCert" @click.self="previewCert = null">
      <div class="preview-box">
        <button class="modal-close" @click="previewCert = null">✕</button>
        <img :src="previewCert.photoUrl" :alt="previewCert.name" class="preview-img" />
        <div class="preview-title">{{ previewCert.name }}</div>
        <div class="preview-issuer">{{ previewCert.issuer }} · {{ previewCert.month }} {{ previewCert.year }}</div>
      </div>
    </div>

    <!-- Add / Edit Modal -->
    <div class="modal-overlay" v-if="showForm" @click.self="showForm = false">
      <div class="modal-box pixel-border">
        <button class="modal-close" @click="showForm = false">✕</button>
        <div class="modal-type">{{ editingId ? 'EDIT' : 'NEW' }} CERTIFICATION</div>
        <h2 class="modal-title" style="margin-bottom:1.5rem">
          {{ editingId ? 'Edit Certification' : 'Add Certification' }}
        </h2>
        <div class="form-field"><label>Certificate Name</label><input v-model="form.name" placeholder="e.g. Data Analysis with Python" /></div>
        <div class="form-field"><label>Issuer</label><input v-model="form.issuer" placeholder="e.g. IBM" /></div>
        <div class="form-field"><label>Platform</label><input v-model="form.platform" placeholder="e.g. Cognitive Class.ai" /></div>
        <div class="form-field"><label>Month</label><input v-model="form.month" placeholder="e.g. May" /></div>
        <div class="form-field"><label>Year</label><input v-model="form.year" placeholder="e.g. 2024" /></div>
        <div class="form-field"><label>Tags (comma separated)</label><input v-model="form.tagsRaw" placeholder="Python, Data Analysis, IBM" /></div>
        <div class="form-field"><label>Certificate Image URL (Cloudinary)</label><input v-model="form.photoUrl" placeholder="https://res.cloudinary.com/..." /></div>
        <div class="form-field"><label>Verify URL</label><input v-model="form.verifyUrl" placeholder="https://..." /></div>
        <button class="btn-pixel" style="width:100%;margin-top:1rem;padding:12px" @click="submit">
          {{ editingId ? 'SAVE CHANGES' : 'ADD CERTIFICATION' }}
        </button>
      </div>
    </div>

    <!-- Delete Confirm Modal -->
    <div class="modal-overlay" v-if="deleteTarget" @click.self="deleteTarget = null">
      <div class="modal-box pixel-border" style="max-width:380px;text-align:center">
        <div class="modal-type" style="color:#dc2626">WARNING</div>
        <h2 class="modal-title" style="margin-bottom:1rem">Delete Certification?</h2>
        <p style="font-size:13px;color:#9d8fc0;margin-bottom:2rem">"{{ deleteTarget?.name }}"</p>
        <div style="display:flex;gap:12px;justify-content:center">
          <button class="btn-pixel crimson" @click="doDelete">DELETE</button>
          <button class="btn-pixel" @click="deleteTarget = null">CANCEL</button>
        </div>
      </div>
    </div>

  </section>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'
import { useCertifications } from '../stores/certifications.js'

const { isLoggedIn } = useAuth()
const { certifications, addCertification, updateCertification, deleteCertification } = useCertifications()

// Preview
const previewCert = ref(null)
function openPreview(c) { previewCert.value = c }

// Form state
const showForm = ref(false)
const editingId = ref(null)
const deleteTarget = ref(null)

const emptyForm = () => ({ name: '', issuer: '', platform: '', month: '', year: '', tagsRaw: '', photoUrl: '', verifyUrl: '' })
const form = ref(emptyForm())

function openAdd() {
  editingId.value = null
  form.value = emptyForm()
  showForm.value = true
}

function openEdit(c) {
  editingId.value = c.id
  form.value = {
    name: c.name,
    issuer: c.issuer,
    platform: c.platform,
    month: c.month,
    year: c.year,
    tagsRaw: Array.isArray(c.tags) ? c.tags.join(', ') : c.tags,
    photoUrl: c.photoUrl,
    verifyUrl: c.verifyUrl,
  }
  showForm.value = true
}

function confirmDelete(c) { deleteTarget.value = c }
function doDelete() {
  deleteCertification(deleteTarget.value.id)
  deleteTarget.value = null
}

function submit() {
  if (!form.value.name.trim()) return
  const data = {
    ...form.value,
    tags: form.value.tagsRaw,
  }
  editingId.value
    ? updateCertification(editingId.value, data)
    : addCertification(data)
  showForm.value = false
  form.value = emptyForm()
  editingId.value = null
}
</script>

<style scoped>
.section { padding: 6rem 2rem; }
.section-inner { max-width: 1100px; margin: 0 auto; }
.section-header { display: flex; align-items: center; justify-content: space-between; flex-wrap: wrap; gap: 12px; margin-bottom: 0.5rem; }
.section-sub { font-family: 'Share Tech Mono', monospace; font-size: 13px; color: var(--text-muted); margin-bottom: 2rem; }

/* Grid */
.cert-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(320px, 1fr));
  gap: 20px;
}

/* Card */
.cert-card {
  background: var(--bg-card);
  border: 1px solid var(--border-color);
  display: flex;
  flex-direction: column;
  transition: border-color 0.2s, box-shadow 0.2s;
  overflow: hidden;
}
.cert-card:hover {
  border-color: var(--accent-teal);
  box-shadow: 0 0 20px rgba(20,184,166,0.15);
}

/* Image */
.cert-image-wrap {
  position: relative;
  width: 100%;
  height: 180px;
  overflow: hidden;
  cursor: pointer;
}
.cert-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.3s;
}
.cert-image-wrap:hover .cert-image { transform: scale(1.04); }
.cert-image-overlay {
  position: absolute;
  inset: 0;
  background: rgba(5,3,16,0.5);
  display: flex;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
}
.cert-image-wrap:hover .cert-image-overlay { opacity: 1; }
.preview-label {
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  color: var(--accent-teal);
  letter-spacing: 2px;
}
.cert-image-placeholder {
  width: 100%;
  height: 120px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: rgba(139,92,246,0.05);
  border-bottom: 1px solid var(--border-color);
  font-size: 40px;
}

/* Info */
.cert-info { padding: 1.2rem 1.25rem; display: flex; flex-direction: column; gap: 6px; flex: 1; }
.cert-issuer {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: var(--accent-teal);
  letter-spacing: 2px;
}
.cert-name {
  font-family: 'Orbitron', monospace;
  font-size: 14px;
  color: #e2d9f3;
  line-height: 1.4;
}
.cert-platform {
  font-size: 11px;
  color: var(--text-muted);
  font-family: 'Share Tech Mono', monospace;
}
.cert-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 4px;
  margin-top: 4px;
}
.tag {
  font-size: 11px;
  padding: 3px 8px;
  background: rgba(139,92,246,0.12);
  border: 1px solid rgba(139,92,246,0.3);
  color: var(--accent-purple);
  font-family: 'Share Tech Mono', monospace;
}
.cert-footer {
  display: flex;
  align-items: center;
  justify-content: space-between;
  margin-top: 8px;
}
.cert-date {
  font-family: 'Share Tech Mono', monospace;
  font-size: 11px;
  color: var(--text-muted);
}
.cert-verify {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  color: var(--accent-gold);
  text-decoration: none;
  padding: 5px 8px;
  border: 1px solid var(--accent-gold);
  transition: all 0.2s;
}
.cert-verify:hover {
  background: var(--accent-gold);
  color: var(--bg-deep);
}

/* Admin */
.cert-admin { display: flex; gap: 6px; margin-top: 8px; }
.admin-btn {
  font-family: 'Press Start 2P', monospace;
  font-size: 7px;
  padding: 4px 8px;
  background: transparent;
  cursor: pointer;
  border: 1px solid;
  transition: all 0.15s;
}
.admin-btn.edit { color: var(--accent-teal); border-color: var(--accent-teal); }
.admin-btn.edit:hover { background: var(--accent-teal); color: var(--bg-deep); }
.admin-btn.delete { color: var(--accent-crimson); border-color: var(--accent-crimson); }
.admin-btn.delete:hover { background: var(--accent-crimson); color: white; }

/* Preview Modal */
.preview-box {
  background: var(--bg-card);
  padding: 1.5rem;
  max-width: 700px;
  width: 100%;
  position: relative;
  border-radius: 2px;
  animation: fadeInUp 0.3s ease;
}
.preview-img {
  width: 100%;
  border-radius: 2px;
  margin-bottom: 1rem;
}
.preview-title {
  font-family: 'Orbitron', monospace;
  font-size: 16px;
  color: #e2d9f3;
  margin-bottom: 4px;
}
.preview-issuer {
  font-size: 12px;
  color: var(--text-muted);
  font-family: 'Share Tech Mono', monospace;
}

/* Form Modal */
.modal-overlay { position: fixed; inset: 0; background: rgba(5,3,16,0.92); z-index: 1000; display: flex; align-items: center; justify-content: center; padding: 1.5rem; }
.modal-box { background: var(--bg-card); padding: 2rem; max-width: 520px; width: 100%; max-height: 90vh; overflow-y: auto; position: relative; border-radius: 2px; animation: fadeInUp 0.3s ease; }
.modal-close { position: absolute; top: 1rem; right: 1rem; background: transparent; border: none; color: var(--text-muted); font-size: 18px; cursor: pointer; }
.modal-type { font-family: 'Press Start 2P', monospace; font-size: 9px; color: var(--accent-teal); letter-spacing: 2px; margin-bottom: 0.5rem; }
.modal-title { font-family: 'Orbitron', monospace; font-size: 20px; color: #e2d9f3; }
.form-field { margin-bottom: 1rem; }
.form-field label { display: block; font-family: 'Press Start 2P', monospace; font-size: 8px; color: var(--accent-teal); letter-spacing: 1px; margin-bottom: 6px; }
.form-field input { width: 100%; background: var(--bg-deep); border: 1px solid var(--border-color); color: var(--text-primary); font-family: 'Share Tech Mono', monospace; font-size: 13px; padding: 9px 12px; outline: none; }
.form-field input:focus { border-color: var(--accent-purple); }

.btn-pixel { font-family: 'Press Start 2P', monospace; font-size: 9px; padding: 10px 16px; background: transparent; border: 2px solid var(--accent-purple); color: var(--accent-purple); cursor: pointer; letter-spacing: 1px; transition: all 0.2s; }
.btn-pixel:hover { background: var(--accent-purple); color: var(--bg-deep); }
.btn-pixel.crimson { border-color: var(--accent-crimson); color: var(--accent-crimson); }
.btn-pixel.crimson:hover { background: var(--accent-crimson); color: white; }

/* Responsive */
@media (max-width: 768px) {
  .section { padding: 4rem 1.2rem; }
  .cert-grid { grid-template-columns: 1fr; }
}
@media (max-width: 480px) {
  .section { padding: 3rem 1rem; }
  .cert-name { font-size: 13px; }
  .cert-image-wrap { height: 150px; }
  .modal-box { padding: 1.2rem; }
}
</style>
