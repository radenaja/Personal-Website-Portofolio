import { ref } from 'vue'

const STORAGE_KEY = 'raden_skills_v2'

const defaultSkills = [
  {
    id: 1, name: 'Backend & Framework', icon: '⚙',
    skills: [
      { id:11, name:'Laravel', level:'ADVANCED', xp:85, detail:'Framework utama untuk web development. Dipakai intensif di SIMARA, Arsip Terpadu, Koperasi, Booking Meeting Room RSUD Tarakan, dan banyak project freelance.', projects:['SIMARA','Arsip Terpadu','Koperasi BE','RSUD Tarakan','Freelance'] },
      { id:12, name:'PHP', level:'ADVANCED', xp:85, detail:'Bahasa backend utama sejak 2022. Comfortable dengan OOP, MVC pattern, dan REST API development.', projects:['SIMARA','RSUD Tarakan','Freelance'] },
      { id:13, name:'.NET', level:'INTERMEDIATE', xp:50, detail:'Dipelajari untuk project SIMRS Temiang Avicenna. Aktif membaca codebase enterprise dan mulai develop fitur baru.', projects:['SIMRS Avicenna'] },
      { id:14, name:'Bootstrap', level:'ADVANCED', xp:80, detail:'Dipakai untuk rapid prototyping dan semua project yang butuh responsive UI cepat.', projects:['SIMARA','RSUD Tarakan','Freelance'] },
    ]
  },
  {
    id: 2, name: 'Frontend', icon: '◈',
    skills: [
      { id:21, name:'HTML / CSS / JavaScript', level:'ADVANCED', xp:82, detail:'Solid di semantic HTML5, responsive CSS3 (Flexbox & Grid), dan vanilla JavaScript DOM manipulation. Foundation yang kuat untuk semua project web.', projects:['SIMARA','Arsip Terpadu','Portfolio','RSUD Tarakan'] },
      { id:22, name:'Vue.js', level:'INTERMEDIATE', xp:65, detail:'Belajar Vue 3 Composition API untuk portfolio pribadi dan project SIMRS. Semakin nyaman dengan reactive state dan component-based architecture.', projects:['Portfolio','SIMRS Avicenna'] },
      { id:23, name:'React', level:'INTERMEDIATE', xp:50, detail:'Familiar dengan React hooks, component lifecycle, dan state management dasar. Terus dikembangkan.', projects:['Personal Projects'] },
      { id:24, name:'Figma', level:'INTERMEDIATE', xp:65, detail:'Dipakai untuk membuat wireframe, mockup UI/UX sebelum masuk ke tahap coding. Dipakai di SIMARA dan project internship RSUD Tarakan.', projects:['SIMARA','RSUD Tarakan'] },
      { id:25, name:'Canva', level:'INTERMEDIATE', xp:68, detail:'Dipakai untuk desain presentasi, poster event, dan keperluan visual di organisasi dan freelance.', projects:['TFI','Techfest 2024','Freelance'] },
    ]
  },
  {
    id: 3, name: 'Data & Database', icon: '▣',
    skills: [
      { id:31, name:'SQL / MySQL', level:'ADVANCED', xp:78, detail:'Comfortable dengan query kompleks, JOIN, agregasi, stored procedure, migration dan seeder di Laravel. Dipakai intensif di internship RSUD Tarakan untuk analisis data rumah sakit.', projects:['SIMARA','Koperasi BE','RSUD Tarakan','Arsip Terpadu'] },
      { id:32, name:'Python', level:'INTERMEDIATE', xp:70, detail:'Dipakai untuk data processing, visualisasi data, dan reporting di internship RSUD Tarakan Jakarta. Familiar dengan pandas dan matplotlib untuk analisis data healthcare.', projects:['RSUD Tarakan','Data Analysis'] },
      { id:33, name:'Excel / Data Analysis', level:'INTERMEDIATE', xp:72, detail:'Analisis data rumah sakit secara mendalam menggunakan Excel. Membuat laporan terstruktur, pivot table, dan identifikasi tren data pasien & operasional di RSUD Tarakan.', projects:['RSUD Tarakan'] },
    ]
  },
  {
    id: 4, name: 'Programming Languages', icon: '◉',
    skills: [
      { id:41, name:'Java', level:'INTERMEDIATE', xp:60, detail:'Dipelajari intensif di perkuliahan Binus University. Familiar dengan OOP, struktur data, dan algoritma menggunakan Java.', projects:['Binus University'] },
      { id:42, name:'C / C++', level:'INTERMEDIATE', xp:55, detail:'Dipelajari di perkuliahan. Comfortable dengan pointer, struct, memory management, dan implementasi algoritma dasar.', projects:['Binus University'] },
      { id:43, name:'Git / GitLab', level:'INTERMEDIATE', xp:70, detail:'Dipakai setiap hari untuk version control. Familiar dengan branching strategy, merge conflict resolution, dan kolaborasi tim via GitLab internal.', projects:['Semua Project'] },
    ]
  },
]

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch(e) {}
  return defaultSkills
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch(e) {}
}

const skillCategories = ref(load())

export function useSkills() {
  function addSkill(categoryId, data) {
    const cat = skillCategories.value.find(c => c.id === categoryId)
    if (!cat) return
    cat.skills.push({
      ...data, id: Date.now(), xp: Number(data.xp),
      projects: typeof data.projects === 'string' ? data.projects.split(',').map(p=>p.trim()).filter(Boolean) : data.projects
    })
    save(skillCategories.value)
  }
  function updateSkill(categoryId, skillId, data) {
    const cat = skillCategories.value.find(c => c.id === categoryId)
    if (!cat) return
    const i = cat.skills.findIndex(s => s.id === skillId)
    if (i !== -1) {
      cat.skills[i] = {
        ...data, id: skillId, xp: Number(data.xp),
        projects: typeof data.projects === 'string' ? data.projects.split(',').map(p=>p.trim()).filter(Boolean) : data.projects
      }
      save(skillCategories.value)
    }
  }
  function deleteSkill(categoryId, skillId) {
    const cat = skillCategories.value.find(c => c.id === categoryId)
    if (!cat) return
    cat.skills = cat.skills.filter(s => s.id !== skillId)
    save(skillCategories.value)
  }
  function addCategory(data) {
    skillCategories.value.push({ ...data, id: Date.now(), skills: [] })
    save(skillCategories.value)
  }
  function deleteCategory(id) {
    skillCategories.value = skillCategories.value.filter(c => c.id !== id)
    save(skillCategories.value)
  }
  return { skillCategories, addSkill, updateSkill, deleteSkill, addCategory, deleteCategory }
}
