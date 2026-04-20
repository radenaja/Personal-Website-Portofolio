import { ref } from 'vue'

const STORAGE_KEY = 'raden_projects_v3'

const defaultProjects = [
  {
    id: 1,
    name: 'SIMARA',
    type: 'SISTEM INFORMASI',
    status: 'COMPLETED',
    year: '2026',
    shortDesc: 'Sistem Informasi Manajemen Rapat berbasis web — skripsi S1 Binus University. Sudah live!',
    problem: 'Rapat di instansi sering tidak terdokumentasi dengan baik, agenda tidak terstruktur, dan notulensi sulit diakses kembali.',
    solution: 'Web-based management system untuk streamline booking ruang rapat dan dokumentasi rapat. Fitur: reservasi real-time, notifikasi otomatis, arsip notulensi, dan dashboard.',
    result: 'SUS Score tinggi, black-box testing 100% pass. Diterima sebagai skripsi S1. Sudah live dan dapat diakses publik di my-simara.my.id.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Vue.js', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776577653/Screenshot_2232_amihs9.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577656/Screenshot_2233_b4lwcq.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577665/Screenshot_2234_cbxucx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577675/Screenshot_2235_bvzxkj.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577682/Screenshot_2236_nnlqqx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577690/Screenshot_2237_sz6yq3.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577715/Screenshot_2238_lbnjkb.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577721/Screenshot_2239_eayj4b.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577726/Screenshot_2240_xlgsxw.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577729/Screenshot_2241_pgbbly.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776578073/Screenshot_2242_jmhj9j.png'],
    github: 'https://github.com/radenaja/Simara/tree/main',
    demo: 'https://www.my-simara.my.id/',
  },
  {
    id: 2,
    name: 'Bookber',
    type: 'WEB APP',
    status: 'COMPLETED',
    year: '2024',
    shortDesc: 'Platform donasi buku digital untuk mendukung literasi di seluruh Indonesia.',
    problem: 'Proses donasi buku masih manual dan tidak ada platform terpusat yang menghubungkan donatur dengan sekolah/komunitas yang membutuhkan.',
    solution: 'Membangun frontend website Bookber — platform yang menghubungkan donatur dengan sekolah, komunitas, dan individu yang membutuhkan buku. Digital, accessible, dan organized.',
    result: 'Platform berhasil dibuat sebagai project semester 5. Berkontribusi dalam meningkatkan kesadaran literasi melalui teknologi.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776579260/Screenshot_462_ztjojx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579264/Screenshot_461_ete3ln.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579269/Screenshot_460_rowjxm.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579274/Screenshot_463_hfqnl2.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579279/Screenshot_464_nqjo7b.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579284/Screenshot_466_tokq8g.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579288/Screenshot_469_bsmmio.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579292/Screenshot_468_qaefxb.png'],
    github: 'https://github.com/radenaja/Bookber',
    demo: '',
  },
  {
    id: 3,
    name: 'V Hotel',
    type: 'WEB APP',
    status: 'COMPLETED',
    year: '2022',
    shortDesc: 'Website hotel booking — final project mata kuliah Human-Computer Interaction, Semester 1.',
    problem: 'Pengguna membutuhkan platform yang mudah untuk melihat fasilitas hotel dan melakukan reservasi kamar secara online.',
    solution: 'Membangun web app hotel booking dengan fitur browse kamar, lihat fasilitas, dan sistem reservasi. Fokus pada UI/UX yang intuitif.',
    result: 'Diterima sebagai final project HCI Semester 1 Binus University. Menjadi fondasi awal pengembangan skill frontend.',
    tech: ['HTML', 'CSS', 'JavaScript'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776653385/4dea2c50-2005-4033-a3e8-6ec794b89347.png'],
    github: 'https://github.com/radenaja/V-Hotel',
    demo: 'https://radenaja.github.io/V-Hotel',
  },
  {
    id: 4,
    name: 'Binus Parking Lot Check',
    type: 'PERSONAL',
    status: 'COMPLETED',
    year: '2022',
    shortDesc: 'Mobile app UI/UX design untuk cek ketersediaan parkir di kampus Binus — Semester 2.',
    problem: 'Mahasiswa dan staff Binus sering kesulitan mencari parkir kosong, terutama untuk mobil, tanpa informasi real-time ketersediaan slot.',
    solution: 'Merancang UI/UX mobile app "Binus PLC" menggunakan Figma. Fitur: peta parkir interaktif, cek slot real-time, registrasi/login, profil pengguna. Coverage: Binus Alam Sutera & Kemanggisan.',
    result: 'Diterima sebagai final project Entrepreneurship Semester 2. Mengembangkan skill UI/UX design dan mobile app prototyping dengan Figma.',
    tech: ['Figma', 'UI/UX Design', 'Mobile Design'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776653795/435652b0-cca2-4190-9b5f-596fb1bd52ca.png'],
    github: 'https://github.com/radenaja/Binus-Parking-Lot-Check',
    demo: 'https://www.figma.com/proto/R835aSinIDcKKr9LFSz2An/Prototype-Parking-Lot-Check?node-id=110-230&starting-point-node-id=110%3A287',
  },
  {
    id: 5,
    name: 'Breast Cancer Classification',
    type: 'PERSONAL',
    status: 'COMPLETED',
    year: '2024',
    shortDesc: 'Data analytics project — klasifikasi kanker payudara menggunakan ML (KNN, Decision Tree, Random Forest).',
    problem: 'Klasifikasi kanker payudara secara manual membutuhkan waktu lama dan rawan human error. Dibutuhkan model ML yang akurat untuk membantu diagnosis.',
    solution: 'Menganalisis dataset kanker payudara menggunakan berbagai metode klasifikasi: KNN, Decision Tree, dan Random Forest. Implementasi menggunakan Jupyter Notebook dengan Python.',
    result: 'Berhasil membangun model klasifikasi dengan performa yang memuaskan. Diterima sebagai final project Data Analytics Semester 4 Binus University.',
    tech: ['Python', 'Jupyter Notebook', 'KNN', 'Decision Tree', 'Random Forest', 'Pandas'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776654147/a7542333-8d80-4582-a309-75d2e2d74aff.png'],
    github: 'https://github.com/radenaja/Breast-Cancer-Classification',
    demo: '',
  },
  {
    id: 6,
    name: 'Mental Health & Music AI',
    type: 'PERSONAL',
    status: 'COMPLETED',
    year: '2024',
    shortDesc: 'AI research project — prediksi level kesehatan mental berdasarkan konsumsi musik.',
    problem: 'Kesehatan mental sulit diukur secara objektif. Apakah konsumsi musik bisa menjadi indikator yang valid untuk memprediksi level kesehatan mental seseorang?',
    solution: 'Membangun algoritma prediktif menggunakan AI (XGBoost) untuk mengestimasi level kesehatan mental berdasarkan musik yang dikonsumsi. Dataset dari public source, implementasi di Python.',
    result: 'Hasil cukup memuaskan meski disimpulkan bahwa prediksi kesehatan mental via konsumsi musik bukan metode yang efektif. Diterima sebagai final project Research Methodology Semester 4.',
    tech: ['Python', 'XGBoost', 'Machine Learning', 'Jupyter Notebook', 'Matplotlib'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776654409/c211e60d-19a9-4d55-b3ad-fcf5afc8fee5.png'],
    github: 'https://github.com/radenaja/Mental-Health-Music-AI',
    demo: '',
  },
  {
    id: 7,
    name: 'Koperasi Management System',
    type: 'FREELANCE',
    status: 'IN PROGRESS',
    year: '2026',
    shortDesc: 'Backend sistem manajemen koperasi — kolaborasi tim via GitLab.',
    problem: 'Koperasi butuh sistem digital terintegrasi untuk kelola anggota, simpanan, dan pinjaman.',
    solution: 'Kontribusi di backend Laravel, resolve migration ordering conflict, setup SSH key untuk kolaborasi GitLab.',
    result: 'Backend modul inti berjalan, Git workflow tim berjalan lancar.',
    tech: ['Laravel', 'PHP', 'MySQL', 'GitLab', 'React', 'Tailwind CSS'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776654995/Screenshot_2244_swzyka.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655001/Screenshot_2245_vnageb.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655006/Screenshot_2246_meddnk.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655011/Screenshot_2247_szvdpg.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655016/Screenshot_2248_cd6n3p.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655022/Screenshot_2249_snjwa7.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655027/Screenshot_2250_zflf7x.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655032/Screenshot_2251_zjjvw7.png'],
    github: 'https://github.com/radenaja/Koperasi',
    demo: 'https://kopkarcwi.com/',
  },
]

function loadProjects() {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) return JSON.parse(stored)
  } catch (e) {}
  return defaultProjects
}

function saveProjects(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch (e) {}
}

const projects = ref(loadProjects())

export function useProjects() {
  function addProject(data) {
    const item = {
      ...data, id: Date.now(),
      tech: typeof data.tech === 'string' ? data.tech.split(',').map(t => t.trim()).filter(Boolean) : data.tech,
      photos: data.photos || [],
    }
    projects.value.push(item)
    saveProjects(projects.value)
  }
  function updateProject(id, data) {
    const idx = projects.value.findIndex(p => p.id === id)
    if (idx === -1) return
    projects.value[idx] = {
      ...projects.value[idx], ...data, id,
      tech: typeof data.tech === 'string' ? data.tech.split(',').map(t => t.trim()).filter(Boolean) : data.tech,
      photos: data.photos || [],
    }
    saveProjects(projects.value)
  }
  function deleteProject(id) {
    projects.value = projects.value.filter(p => p.id !== id)
    saveProjects(projects.value)
  }
  return { projects, addProject, updateProject, deleteProject }
}
