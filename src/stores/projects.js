import { ref } from 'vue'

const STORAGE_KEY = 'raden_projects_v4'

const defaultProjects = [
  {
    id: 1,
    name: 'SIMARA',
    type: 'INFORMATION SYSTEM',
    status: 'COMPLETED',
    year: '2026',
    shortDesc: 'Web-based Meeting Management Information System — undergraduate thesis at Binus University. Passed with grade B. Already live!',
    problem: 'Meetings in organizations are often poorly documented, agendas are unstructured, and meeting minutes are difficult to retrieve.',
    solution: 'Web-based management system to streamline meeting room booking and meeting documentation. Features: real-time reservation, automated notifications, minutes archive, and dashboard.',
    result: 'High SUS Score, black-box testing 100% pass. Passed thesis defense with grade B (May 2026). Already live and publicly accessible at my-simara.my.id.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Vue.js', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776577653/Screenshot_2232_amihs9.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577656/Screenshot_2233_b4lwcq.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577665/Screenshot_2234_cbxucx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577675/Screenshot_2235_bvzxkj.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577682/Screenshot_2236_nnlqqx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577690/Screenshot_2237_sz6yq3.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577715/Screenshot_2238_lbnjkb.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577721/Screenshot_2239_eayj4b.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577726/Screenshot_2240_xlgsxw.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776577729/Screenshot_2241_pgbbly.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776578073/Screenshot_2242_jmhj9j.png'],
    github: 'https://github.com/radenaja/Simara/tree/main',
    demo: 'https://www.my-simara.my.id/',
  },
  {
    id: 7,
    name: 'Koperasi Management System',
    type: 'FREELANCE',
    status: 'COMPLETED',
    year: '2026',
    shortDesc: 'Full-stack Cooperative Management System for real client PT. Crown Worldwide Indonesia. Live at kopkarcwi.com.',
    problem: 'The cooperative needed an integrated digital system to manage members, savings, loans, and financial reporting — replacing manual and paper-based processes.',
    solution: 'Developed a full-stack cooperative management system as primary developer. Features: JWT-based role authentication (administrator, pegawai, anggota), member management, savings & loan workflows, PDF export, settings page, and admin dashboard. Frontend in React, backend API in Laravel, deployed on Hostinger via GitLab.',
    result: 'System successfully deployed and live at kopkarcwi.com. All core modules running smoothly — member management, savings, loan payments, and PDF reporting fully operational.',
    tech: ['Laravel', 'PHP', 'MySQL', 'React', 'Tailwind CSS', 'JWT', 'GitLab', 'Hostinger'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776654995/Screenshot_2244_swzyka.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655001/Screenshot_2245_vnageb.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655006/Screenshot_2246_meddnk.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655011/Screenshot_2247_szvdpg.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655016/Screenshot_2248_cd6n3p.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655022/Screenshot_2249_snjwa7.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655027/Screenshot_2250_zflf7x.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776655032/Screenshot_2251_zjjvw7.png'],
    github: 'https://github.com/radenaja/Koperasi',
    demo: 'https://kopkarcwi.com/',
  },
  {
    id: 2,
    name: 'Bookber',
    type: 'WEB APP',
    status: 'COMPLETED',
    year: '2024',
    shortDesc: 'Digital book donation platform to support literacy across Indonesia.',
    problem: 'The book donation process was still manual with no centralized platform connecting donors to schools and communities in need.',
    solution: 'Built the Bookber frontend website — a platform connecting donors with schools, communities, and individuals who need books. Digital, accessible, and organized.',
    result: 'Platform successfully built as a 5th semester project. Contributed to raising literacy awareness through technology.',
    tech: ['Laravel', 'PHP', 'MySQL', 'Tailwind CSS', 'HTML', 'CSS', 'JavaScript'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776579260/Screenshot_462_ztjojx.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579264/Screenshot_461_ete3ln.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579269/Screenshot_460_rowjxm.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579274/Screenshot_463_hfqnl2.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579279/Screenshot_464_nqjo7b.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579284/Screenshot_466_tokq8g.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579288/Screenshot_469_bsmmio.png', 'https://res.cloudinary.com/doynrjor3/image/upload/v1776579292/Screenshot_468_qaefxb.png'],
    github: 'https://github.com/radenaja/Bookber',
    demo: '',
  },
  {
    id: 5,
    name: 'Breast Cancer Classification',
    type: 'PERSONAL',
    status: 'COMPLETED',
    year: '2024',
    shortDesc: 'Data analytics project — breast cancer classification using ML (KNN, Decision Tree, Random Forest).',
    problem: 'Manual breast cancer classification is time-consuming and prone to human error. An accurate ML model was needed to assist diagnosis.',
    solution: 'Analyzed a breast cancer dataset using multiple classification methods: KNN, Decision Tree, and Random Forest. Implemented using Jupyter Notebook with Python.',
    result: 'Successfully built a classification model with satisfactory performance. Accepted as final project for Data Analytics Semester 4 at Binus University.',
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
    shortDesc: 'AI research project — predicting mental health levels based on music consumption.',
    problem: 'Mental health is difficult to measure objectively. Can music consumption be a valid indicator for predicting an individual\'s mental health level?',
    solution: 'Built a predictive algorithm using AI (XGBoost) to estimate mental health levels based on music consumed. Dataset from a public source, implemented in Python.',
    result: 'Results were satisfactory, though it was concluded that predicting mental health through music consumption is not an effective method. Accepted as final project for Research Methodology Semester 4.',
    tech: ['Python', 'XGBoost', 'Machine Learning', 'Jupyter Notebook', 'Matplotlib'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776654409/c211e60d-19a9-4d55-b3ad-fcf5afc8fee5.png'],
    github: 'https://github.com/radenaja/Mental-Health-Music-AI',
    demo: '',
  },
  {
    id: 3,
    name: 'V Hotel',
    type: 'WEB APP',
    status: 'COMPLETED',
    year: '2022',
    shortDesc: 'Hotel booking website — final project for Human-Computer Interaction course, Semester 1.',
    problem: 'Users needed an easy platform to browse hotel facilities and make room reservations online.',
    solution: 'Built a hotel booking web app with room browsing, facilities viewing, and reservation system. Focused on intuitive UI/UX design.',
    result: 'Accepted as final project for HCI Semester 1 at Binus University. Became the foundation for early frontend development skills.',
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
    shortDesc: 'Mobile app UI/UX design to check parking availability at Binus campus — Semester 2.',
    problem: 'Students and staff at Binus frequently struggled to find empty parking slots, especially for cars, without real-time availability information.',
    solution: 'Designed the "Binus PLC" mobile app UI/UX using Figma. Features: interactive parking map, real-time slot check, registration/login, user profile. Coverage: Binus Alam Sutera & Kemanggisan campuses.',
    result: 'Accepted as final project for Entrepreneurship Semester 2. Developed UI/UX design and mobile app prototyping skills with Figma.',
    tech: ['Figma', 'UI/UX Design', 'Mobile Design'],
    photos: ['https://res.cloudinary.com/doynrjor3/image/upload/v1776653795/435652b0-cca2-4190-9b5f-596fb1bd52ca.png'],
    github: 'https://github.com/radenaja/Binus-Parking-Lot-Check',
    demo: 'https://www.figma.com/proto/R835aSinIDcKKr9LFSz2An/Prototype-Parking-Lot-Check?node-id=110-230&starting-point-node-id=110%3A287',
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