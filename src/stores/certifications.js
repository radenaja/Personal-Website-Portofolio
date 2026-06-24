import { ref } from 'vue'

const STORAGE_KEY = 'raden_certifications'

const defaultCertifications = [
  {
    id: 1,
    name: 'Data Analysis with Python',
    issuer: 'IBM',
    platform: 'Cognitive Class.ai, IBM Developer Skills Network',
    year: '2024',
    month: 'May',
    tags: ['Python', 'Data Analysis', 'IBM'],
    photoUrl: 'https://res.cloudinary.com/doynrjor3/image/upload/v1780219670/Cuplikan_layar_2024-05-19_205637_olfezr.png',
    verifyUrl: 'https://courses.cognitiveclass.ai/certificates/da25f4e2bb2c437ea64e1b6be2b1313b',
  },
  {
    id: 2,
    name: 'Introduction to Cloud',
    issuer: 'IBM',
    platform: 'Cognitive Class.ai, IBM Developer Skills Network',
    year: '2024',
    month: 'May',
    tags: ['Cloud', 'IBM', 'Infrastructure'],
    photoUrl: 'https://res.cloudinary.com/doynrjor3/image/upload/v1780219670/Cuplikan_layar_2024-05-19_204506_saskce.png',
    verifyUrl: 'https://courses.cognitiveclass.ai/certificates/53d3a2e1b39f40d599ab3314c30ba57c',
  },
]

function load() {
  try {
    const s = localStorage.getItem(STORAGE_KEY)
    if (s) return JSON.parse(s)
  } catch (e) {}
  return defaultCertifications
}

function save(list) {
  try { localStorage.setItem(STORAGE_KEY, JSON.stringify(list)) } catch (e) {}
}

const certifications = ref(load())

export function useCertifications() {
  function addCertification(data) {
    certifications.value.push({
      ...data,
      id: Date.now(),
      tags: typeof data.tags === 'string'
        ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
        : data.tags,
    })
    save(certifications.value)
  }

  function updateCertification(id, data) {
    const i = certifications.value.findIndex(c => c.id === id)
    if (i !== -1) {
      certifications.value[i] = {
        ...data,
        id,
        tags: typeof data.tags === 'string'
          ? data.tags.split(',').map(t => t.trim()).filter(Boolean)
          : data.tags,
      }
      save(certifications.value)
    }
  }

  function deleteCertification(id) {
    certifications.value = certifications.value.filter(c => c.id !== id)
    save(certifications.value)
  }

  return { certifications, addCertification, updateCertification, deleteCertification }
}
