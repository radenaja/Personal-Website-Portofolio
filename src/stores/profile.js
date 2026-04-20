import { ref } from 'vue'

const STORAGE_KEY = 'raden_profile_v3'

const defaultProfile = {
  photoUrl: 'https://res.cloudinary.com/doynrjor3/image/upload/v1776520939/raden_qu5srx.jpg',
  displayName: 'RADEN',
  fullName: 'Raden Aradeya Risqi Jagat Pertala',
  classTitle: 'DATA ANALYST | FRONTEND WEB DEV',
  level: 22,
  xp: 2450,
  xpMax: 3000,
  bio: 'Experienced as Data Analyst (Data Processing / Visualization / Reporting) and Frontend Developer (UI/UX Implementation / Web Development). Passionate about turning raw data into actionable insights and building user-friendly interfaces. Highly curious, adaptive, and eager to continuously learn in both analytics and development fields.',
  stats: [
    { name: 'Laravel / PHP', value: 85, color: '#f97316' },
    { name: 'HTML / CSS / JS', value: 82, color: '#8b5cf6' },
    { name: 'SQL / MySQL', value: 78, color: '#14b8a6' },
    { name: 'Python', value: 70, color: '#fbbf24' },
    { name: 'Vue.js', value: 65, color: '#60a5fa' },
    { name: 'React / .NET', value: 50, color: '#dc2626' },
    { name: 'Java / C++', value: 55, color: '#a78bfa' },
    { name: 'Java / Figma', value: 80, color: '#fa8bedff' },
  ],
  badges: ['PHP', 'Laravel', 'Vue.js', 'Python', 'React', '.NET', 'SQL', 'Figma', 'Canva'],
  email: 'rarjp.062004@gmail.com',
  phone: '+6282213293631',
  location: 'Pondok Aren, Tangerang Selatan',
  github: 'https://github.com/radenaja',
  linkedin: 'https://www.linkedin.com/in/raden-aradeya-risqi-jagat-pertala-204800218/',
  cvUrl: '/Personal-Website-Portofolio/cv-raden-aradeya-risqi-jagat-pertala.pdf',
  personalDrive: 'https://drive.google.com/drive/folders/18_eGJa7GHOB9fVTeqIGQfMrju5muNQUW',
}

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return { ...defaultProfile, ...JSON.parse(s) }
  } catch(e) {}
  return { ...defaultProfile }
}

function save(data) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(data)) } catch(e) {}
}

const profile = ref(load())

export function useProfile() {
  function updateProfile(data) {
    const cleaned = { ...data }
    if (cleaned.photoUrl) cleaned.photoUrl = cleaned.photoUrl.trim()
    profile.value = { ...profile.value, ...cleaned }
    save(profile.value)
  }
  return { profile, updateProfile }
}
