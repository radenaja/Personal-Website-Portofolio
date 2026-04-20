import { ref } from 'vue'

const STORAGE_KEY = 'raden_timeline_v2'

const defaultTimeline = [
  {
    id:1, year:'2019',
    title:'Lulus MAN 19 Jakarta',
    desc:'Lulus dari MAN 19 Jakarta jurusan IPA. Mulai tertarik dengan teknologi dan komputer sebagai bekal untuk kuliah.',
    tags:['Pendidikan','IPA','Jakarta']
  },
  {
    id:2, year:'2022',
    title:'Masuk Binus University',
    desc:'Diterima di jurusan Computer Science Binus University (Sep 2022). Mulai serius belajar programming — C/C++, Java, HTML/CSS/JavaScript, SQL.',
    tags:['Binus','Computer Science','C/C++, Java, HTML/CSS/JavaScript, SQL']
  },
  {
    id:3, year:'2022',
    title:'Vice Head Division VRam 2022',
    desc:'Dipilih sebagai Vice Chairperson event VRam 2022 — event besar Himpunan Mahasiswa Teknik Informatika yang melibatkan mahasiswa lintas kampus Binus. Belajar leadership dan manajemen kolaborasi tim.',
    tags:['Leadership','VRam','Organisasi','Binus']
  },
  {
    id:4, year:'2022',
    title:'Teach For Indonesia (TFI)',
    desc:'Bergabung sebagai Leader of activity di Teach For Indonesia (Okt 2022 – Okt 2023). Memberikan edukasi kepada generasi muda tentang toleransi antar agama dan pentingnya ilmu pengetahuan.',
    tags:['TFI','Leadership','Pendidikan','Komunitas']
  },
  {
    id:5, year:'2023',
    title:'Google Developer Student Club Malang',
    desc:'Bergabung di GDSC Malang (Feb 2023 – Jan 2025) untuk memperdalam pengetahuan dan pengalaman, serta berkolaborasi memecahkan masalah bersama komunitas developer.',
    tags:['GDSC','Google','Developer','Komunitas']
  },
  {
    id:6, year:'2023',
    title:'Freelance Pertama',
    desc:'Mulai menerima project freelance — web development dan jasa akademis. Pertama kali menghasilkan pendapatan dari skill coding yang telah dipelajari.',
    tags:['Freelance','Laravel','PHP','Web Development']
  },
  // {
  //   id:7, year:'2024',
  //   title:'SIMARA — Skripsi S1',
  //   desc:'Membangun Sistem Informasi Manajemen Rapat (SIMARA) sebagai project skripsi menggunakan Laravel dan metodologi Waterfall. Diuji dengan SUS Score tinggi dan black-box testing 100% pass.',
  //   tags:['Laravel','Skripsi','SUS Testing','Waterfall','Binus']
  // },
  {
    id:7, year:'2024',
    title:'Head Division Techfest 2024',
    desc:'Terpilih sebagai Head of Security & Equipment Division di Techfest 2024 (Jul 2024) — event besar yang diselenggarakan Himpunan Mahasiswa TI, melibatkan mahasiswa dari berbagai kampus Binus.',
    tags:['Leadership','Techfest','Binus','Event']
  },
  {
    id:8, year:'2024',
    title:'Team Projects',
    desc:'Berkontribusi di dua project tim secara bersamaan — Sistem Arsip Terpadu dan Koperasi Management System. Makin solid dalam Git workflow, code review, dan kolaborasi tim.',
    tags:['Laravel','Git','GitLab','Team','Arsip','Koperasi']
  },
  {
    id:9, year:'2024',
    title:'Virtual Based Exam Invigilator — PPNI',
    desc:'Mengisi sesi Virtual Based memantau para perawat yang sedang mengikuti ujina Virtual Based di seluruh indonesia (PPNI) Des 2024.',
    tags:['PPNI','Virtual Based Exam']
  },
  {
    id:10, year:'2025',
    title:'Internship RSUD Tarakan Jakarta',
    desc:'Internship sebagai Data Analyst di RSUD Tarakan Jakarta (Feb 2025 – Feb 2026). Menganalisis data rumah sakit dengan Excel & Python, merancang ERD & sequence diagram, membuat laporan visualisasi, dan membangun website booking meeting room.',
    tags:['Data Analyst','Python','SQL','Excel','Healthcare','Laravel']
  },
  // {
  //   id:12, year:'2025',
  //   title:'SIMRS Temiang Avicenna',
  //   desc:'Bergabung di project SIMRS enterprise Temiang Avicenna. Setup VPN untuk akses GitLab internal, mempelajari arsitektur .NET/C# dari codebase enterprise yang nyata, dan mulai contribute pengembangan fitur baru.',
  //   tags:['.NET','C#','Vue.js','Enterprise','VPN','GitLab']
  // },
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
