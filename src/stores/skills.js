import { ref } from 'vue'

const STORAGE_KEY = 'raden_skills'

const defaultSkills = [
  {
    id: 1, name: 'Backend & Languages', icon: '⚙',
    skills: [
      { id:11, name:'Laravel', level:'ADVANCED', xp:85, detail:'Primary framework for web development. Used intensively in SIMARA, Arsip Terpadu, Koperasi, Booking Meeting Room RSUD Tarakan, and many freelance projects.', projects:['SIMARA','Arsip Terpadu','Koperasi BE','RSUD Tarakan','Freelance'] },
      { id:12, name:'PHP', level:'ADVANCED', xp:85, detail:'Primary backend language since 2022. Comfortable with OOP, MVC pattern, and REST API development.', projects:['SIMARA','RSUD Tarakan','Freelance'] },
      { id:13, name:'.NET', level:'INTERMEDIATE', xp:50, detail:'Learned for enterprise project development. Actively reading enterprise codebases and starting to develop new features.', projects:['Enterprise Project'] },
      { id:14, name:'Python', level:'INTERMEDIATE', xp:70, detail:'Used for data processing, data visualization, and reporting during the RSUD Tarakan Jakarta internship. Familiar with pandas and matplotlib for healthcare data analysis.', projects:['RSUD Tarakan','Data Analysis'] },
      { id:15, name:'Java', level:'INTERMEDIATE', xp:60, detail:'Studied intensively during coursework at Binus University. Familiar with OOP, data structures, and algorithms using Java.', projects:['Binus University'] },
      { id:16, name:'C / C++', level:'INTERMEDIATE', xp:55, detail:'Studied during coursework. Comfortable with pointers, structs, memory management, and basic algorithm implementation.', projects:['Binus University'] },
    ]
  },
  {
    id: 2, name: 'Frontend', icon: '◈',
    skills: [
      { id:21, name:'HTML / CSS / JavaScript', level:'ADVANCED', xp:82, detail:'Solid in semantic HTML5, responsive CSS3 (Flexbox & Grid), and vanilla JavaScript DOM manipulation. Strong foundation for all web projects.', projects:['SIMARA','Arsip Terpadu','Portfolio','RSUD Tarakan'] },
      { id:22, name:'Vue.js', level:'INTERMEDIATE', xp:65, detail:'Learning Vue 3 Composition API for personal portfolio and SIMRS project. Increasingly comfortable with reactive state and component-based architecture.', projects:['Portfolio','SIMARA'] },
      { id:23, name:'React', level:'INTERMEDIATE', xp:50, detail:'Familiar with React hooks, component lifecycle, and basic state management. Used in Koperasi Management System frontend.', projects:['Koperasi BE','Personal Projects'] },
      { id:24, name:'Tailwind CSS', level:'ADVANCED', xp:80, detail:'Primary CSS framework for modern UI development. Used extensively in SIMARA, Koperasi Management System, and portfolio website for responsive and clean designs.', projects:['SIMARA','Koperasi BE','Portfolio','RSUD Tarakan'] },
      { id:25, name:'Bootstrap', level:'INTERMEDIATE', xp:72, detail:'Used for rapid prototyping and projects requiring fast responsive UI. Foundational CSS framework learned early in web development journey.', projects:['RSUD Tarakan','Freelance'] },
      { id:26, name:'Figma', level:'INTERMEDIATE', xp:65, detail:'Used to create wireframes and UI/UX mockups before the coding phase. Applied in SIMARA and the RSUD Tarakan internship project.', projects:['SIMARA','RSUD Tarakan'] },
    ]
  },
  {
    id: 3, name: 'Data & Database', icon: '▣',
    skills: [
      { id:31, name:'SQL / MySQL', level:'ADVANCED', xp:78, detail:'Comfortable with complex queries, JOINs, aggregations, stored procedures, migrations and seeders in Laravel. Used intensively during the RSUD Tarakan internship for hospital data analysis.', projects:['SIMARA','Koperasi BE','RSUD Tarakan','Arsip Terpadu'] },
      { id:32, name:'Excel / Data Analysis', level:'INTERMEDIATE', xp:72, detail:'In-depth hospital data analysis using Excel. Created structured reports, pivot tables, and identified patient & operational data trends at RSUD Tarakan.', projects:['RSUD Tarakan'] },
      { id:33, name:'Pandas & Matplotlib', level:'INTERMEDIATE', xp:65, detail:'Used during RSUD Tarakan internship for healthcare data processing, visualization, and generating structured analytical reports.', projects:['RSUD Tarakan','Data Analysis'] },
    ]
  },
  {
    id: 4, name: 'Tools & Design', icon: '🛠',
    skills: [
      { id:41, name:'Git / GitLab', level:'INTERMEDIATE', xp:70, detail:'Used daily for version control. Familiar with branching strategies, merge conflict resolution, and team collaboration via internal GitLab.', projects:['All Projects'] },
      { id:42, name:'Canva', level:'INTERMEDIATE', xp:68, detail:'Used for designing presentations, event posters, and visual materials for organizations and freelance work.', projects:['TFI','Techfest 2024','Freelance'] },
      { id:43, name:'Visual Paradigm', level:'INTERMEDIATE', xp:65, detail:'Used for creating UML diagrams including Use Case, ERD, Sequence Diagrams, and Class Diagrams. Applied extensively in SIMARA thesis project.', projects:['SIMARA','RSUD Tarakan'] },
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