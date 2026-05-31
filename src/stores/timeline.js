import { ref } from 'vue'

const STORAGE_KEY = 'raden_timeline_v3'

const defaultTimeline = [
  {
    id:1, year:'2019',
    title:'Graduated from MAN 19 Jakarta',
    desc:'Graduated from MAN 19 Jakarta majoring in Natural Sciences. Developed a growing interest in technology and computers as a foundation for university studies.',
    tags:['Education','Natural Sciences','Jakarta']
  },
  {
    id:2, year:'2022',
    title:'Enrolled at Binus University',
    desc:'Accepted into the Computer Science program at Binus University (Sep 2022). Started seriously learning programming — C/C++, Java, HTML/CSS/JavaScript, SQL.',
    tags:['Binus','Computer Science','C/C++','Java','HTML/CSS/JavaScript','SQL']
  },
  {
    id:3, year:'2022',
    title:'Vice Head Division VRam 2022',
    desc:'Selected as Vice Chairperson of VRam 2022 — a major event by the Informatics Engineering Student Association involving students from multiple Binus campuses. Gained experience in leadership and team collaboration management.',
    tags:['Leadership','VRam','Organization','Binus']
  },
  {
    id:4, year:'2022',
    title:'Teach For Indonesia (TFI)',
    desc:'Joined as Leader of Activity at Teach For Indonesia (Oct 2022 – Oct 2023). Provided education to young people on inter-religious tolerance and the importance of knowledge.',
    tags:['TFI','Leadership','Education','Community']
  },
  {
    id:5, year:'2023',
    title:'Google Developer Student Club Malang',
    desc:'Joined GDSC Malang (Feb 2023 – Jan 2025) to deepen knowledge and experience, and to collaborate in solving problems within the developer community.',
    tags:['GDSC','Google','Developer','Community']
  },
  {
    id:6, year:'2023',
    title:'First Freelance Project',
    desc:'Started accepting freelance projects — web development and academic services. First time earning income from coding skills developed throughout university.',
    tags:['Freelance','Laravel','PHP','Web Development']
  },
  {
    id:7, year:'2024',
    title:'Head Division Techfest 2024',
    desc:'Selected as Head of Security & Equipment Division at Techfest 2024 (Jul 2024) — a major event organized by the IT Student Association, involving students from various Binus campuses.',
    tags:['Leadership','Techfest','Binus','Event']
  },
  {
    id:8, year:'2024',
    title:'Arsip Terpadu — Team Project',
    desc:'Contributed to an Integrated Archive Management System as part of a team project. Built file preview modal for PDF and image files, set up GitLab repository, and created Excel import templates for member and user data.',
    tags:['Laravel','Git','GitLab','Team','Archive','PHP']
  },
  {
    id:9, year:'2024',
    title:'KopkarCwi — Freelance Client Project',
    desc:'Developed a full-stack Cooperative Management System for a real client, PT. Crown Worldwide Indonesia. Built and deployed the system at kopkarcwi.com with features including member management, savings, loan payment workflows, PDF export, and JWT-based authentication.',
    tags:['Laravel','React','MySQL','Tailwind CSS','GitLab','Freelance','Koperasi']
  },
  {
    id:10, year:'2025',
    title:'Internship at RSUD Tarakan Jakarta',
    desc:'Interned as a Data Analyst at RSUD Tarakan Jakarta (Feb 2025 – Feb 2026). Analyzed hospital data using Excel & Python, designed ERDs & sequence diagrams, created visualization reports, and built a meeting room booking website.',
    tags:['Data Analyst','Python','SQL','Excel','Healthcare','Laravel']
  },
  {
    id:11, year:'2026',
    title:'SIMARA — Thesis Defense',
    desc:'Successfully defended undergraduate thesis SIMARA (Sistem Informasi Manajemen Rapat Berbasis Digital) at Binus University. Passed with grade B, May 2026. Built with Laravel, Vue.js, MySQL, and Tailwind CSS using Waterfall methodology. High SUS Score, black-box testing 100% pass. Already live at my-simara.my.id.',
    tags:['Laravel','Vue.js','MySQL','Tailwind CSS','Thesis','Binus','SIMARA','2026']
  },
]

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch(e) {}
  return defaultTimeline
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch(e) {}
}

const timeline = ref(load())

export function useTimeline() {
  function addEntry(data) {
    timeline.value.push({
      ...data, id: Date.now(),
      tags: typeof data.tags === 'string' ? data.tags.split(',').map(t=>t.trim()).filter(Boolean) : data.tags
    })
    save(timeline.value)
  }
  function updateEntry(id, data) {
    const i = timeline.value.findIndex(t => t.id === id)
    if (i !== -1) {
      timeline.value[i] = {
        ...data, id,
        tags: typeof data.tags === 'string' ? data.tags.split(',').map(t=>t.trim()).filter(Boolean) : data.tags
      }
      save(timeline.value)
    }
  }
  function deleteEntry(id) {
    timeline.value = timeline.value.filter(t => t.id !== id)
    save(timeline.value)
  }
  return { timeline, addEntry, updateEntry, deleteEntry }
}