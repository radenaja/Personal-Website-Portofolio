import { ref } from 'vue'

const STORAGE_KEY = 'raden_achievements_v2'

const defaultAchievements = [
  // { id:1,  icon:'🎓', name:'Computer Science Graduate',      desc:'Lulus S1 Computer Science Binus University — IPK 3.34',                              year:'2026', locked:false },
  { id:1,  icon:'🏥', name:'Healthcare Tech Intern',         desc:'Internship Data Analyst di RSUD Tarakan Jakarta (Feb 2025 – Feb 2026)',               year:'2025', locked:false },
  { id:2,  icon:'📊', name:'Data Analyst Unlocked',          desc:'Analisis data rumah sakit, buat ERD, sequence diagram & visualisasi di RSUD Tarakan', year:'2025', locked:false },
  { id:3,  icon:'🌐', name:'Enterprise Developer',           desc:'Bergabung di project SIMRS enterprise Temiang Avicenna via VPN internal',            year:'2025', locked:false },
  // { id:5,  icon:'📜', name:'Thesis Defender',                desc:'Sidang skripsi SIMARA berhasil — SUS Score tinggi & black-box testing 100% pass',    year:'2024', locked:false },
  { id:4,  icon:'👑', name:'Head Division Techfest 2024',    desc:'Head of Security & Equipment Division — Techfest 2024, Binus University (Jul 2024)', year:'2024', locked:false },
  // { id:7,  icon:'🤝', name:'Team Player',                    desc:'Kontribusi di project tim: Arsip Terpadu & Koperasi Management System',              year:'2024', locked:false },
  { id:5,  icon:'🏫', name:'Virtual Based Exam Invigilator', desc:'Memantau para perawat yang sedang mengikuti ujina Virtual Based di seluruh indonesia — PPNI (Des 2024)',   year:'2024', locked:false },
  { id:6,  icon:'🧑‍💻', name:'GDSC Member',                   desc:'Bergabung di Google Developer Student Club Malang (Feb 2023 – Jan 2025)',           year:'2023', locked:false },
  { id:7, icon:'💼', name:'Freelancer Unlocked',            desc:'Pertama kali menerima project freelance — web development & akademis',               year:'2023', locked:false },
  { id:8, icon:'🚀', name:'First Deploy',                   desc:'Deploy pertama website ke production server',                                        year:'2022', locked:false },
  { id:9, icon:'🥈', name:'Vice Head VRam 2022',            desc:'Vice Chairperson event VRam 2022 — event besar Himpunan Mahasiswa TI Binus (Apr 2022)', year:'2022', locked:false },
  { id:10, icon:'🌱', name:'Teach For Indonesia',            desc:'Leader of activity di Teach For Indonesia — edukasi generasi muda (Okt 2022 – Okt 2023)', year:'2022', locked:false },
  // { id:14, icon:'⭐', name:'Full-Time Dev',                  desc:'???',                                                                                year:'',     locked:false  },
]

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch(e) {}
  return defaultAchievements
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch(e) {}
}

const achievements = ref(load())

export function useAchievements() {
  function addAchievement(data) {
    achievements.value.push({ ...data, id: Date.now() })
    save(achievements.value)
  }
  function updateAchievement(id, data) {
    const i = achievements.value.findIndex(a => a.id === id)
    if (i !== -1) { achievements.value[i] = { ...data, id }; save(achievements.value) }
  }
  function deleteAchievement(id) {
    achievements.value = achievements.value.filter(a => a.id !== id)
    save(achievements.value)
  }
  return { achievements, addAchievement, updateAchievement, deleteAchievement }
}
