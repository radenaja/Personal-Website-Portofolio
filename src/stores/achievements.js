import { ref } from 'vue'

const STORAGE_KEY = 'raden_achievements_v2'

const defaultAchievements = [
  // { id:1,  icon:'🎓', name:'Computer Science Graduate',      desc:'Graduated S1 Computer Science at Binus University — GPA 3.34',                                    year:'2026', locked:false },
  { id:1,  icon:'🏥', name:'Healthcare Tech Intern',         desc:'Data Analyst Internship at RSUD Tarakan Jakarta (Feb 2025 – Feb 2026)',                             year:'2025', locked:false },
  { id:2,  icon:'📊', name:'Data Analyst Unlocked',          desc:'Analyzed hospital data, built ERD, sequence diagrams & data visualizations at RSUD Tarakan',       year:'2025', locked:false },
  { id:3,  icon:'🌐', name:'Enterprise Developer',           desc:'Joined the Temiang Avicenna enterprise SIMRS project via internal VPN',                            year:'2025', locked:false },
  // { id:5,  icon:'📜', name:'Thesis Defender',                desc:'Successfully defended SIMARA thesis — high SUS Score & black-box testing 100% pass',              year:'2024', locked:false },
  { id:4,  icon:'👑', name:'Head Division Techfest 2024',    desc:'Head of Security & Equipment Division — Techfest 2024, Binus University (Jul 2024)',               year:'2024', locked:false },
  // { id:7,  icon:'🤝', name:'Team Player',                    desc:'Contributed to team projects: Arsip Terpadu & Koperasi Management System',                        year:'2024', locked:false },
  { id:5,  icon:'🏫', name:'Virtual Based Exam Invigilator', desc:'Monitored nurses taking Virtual Based exams across Indonesia — PPNI (Dec 2024)',                    year:'2024', locked:false },
  { id:6,  icon:'🧑‍💻', name:'GDSC Member',                   desc:'Joined Google Developer Student Club Malang (Feb 2023 – Jan 2025)',                               year:'2023', locked:false },
  { id:7,  icon:'💼', name:'Freelancer Unlocked',            desc:'First freelance project accepted — web development & academic projects',                           year:'2023', locked:false },
  { id:8,  icon:'🚀', name:'First Deploy',                   desc:'First website deployment to a production server',                                                  year:'2022', locked:false },
  { id:9,  icon:'🥈', name:'Vice Head VRam 2022',            desc:'Vice Chairperson of VRam 2022 — major event by Binus IT Student Association (Apr 2022)',           year:'2022', locked:false },
  { id:10, icon:'🌱', name:'Teach For Indonesia',            desc:'Leader of activity at Teach For Indonesia — educating the younger generation (Oct 2022 – Oct 2023)', year:'2022', locked:false },
  // { id:14, icon:'⭐', name:'Full-Time Dev',                  desc:'???',                                                                                             year:'',     locked:false  },
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