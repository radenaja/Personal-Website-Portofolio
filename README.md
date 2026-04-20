# Raden Portfolio — Vue.js + Vite

Website portfolio bertema game space pixel art untuk Raden Aradeya Risqi Jagat Pertala.

## Cara Setup Lokal

```bash
# 1. Extract zip, masuk ke folder
cd raden-portfolio

# 2. Install dependencies
npm install

# 3. Jalankan dev server
npm run dev

# 4. Buka browser di http://localhost:5173
```

## Cara Deploy ke GitHub Pages

```bash
# 1. Build project
npm run build

# 2. Push folder dist ke branch gh-pages
# Atau pakai GitHub Actions otomatis (lihat di bawah)
```

### GitHub Actions otomatis (disarankan)

Buat file `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages
on:
  push:
    branches: [main]
jobs:
  deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      - uses: actions/setup-node@v3
        with:
          node-version: 18
      - run: npm install
      - run: npm run build
      - uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist
```

## Cara Tambah Project

1. Buka website → section "Quest Log"
2. Klik card "+ ADD PROJECT"
3. Isi form dan submit
4. Project muncul langsung di grid

Atau edit langsung di `src/components/ProjectsSection.vue`, array `projects`.

## Cara Update Info Pribadi

- **Nama & bio**: `src/components/HeroSection.vue`
- **Skill levels**: `src/components/HeroSection.vue` → array `stats`
- **Skill tree detail**: `src/components/SkillsContact.vue` → array `skillTree`
- **Timeline**: `src/components/AchievementsSection.vue` → array `timeline`
- **Achievements**: `src/components/AchievementsSection.vue` → array `achievements`
- **Contact links**: `src/components/SkillsContact.vue`
- **CV link**: Taruh file CV di folder `public/` dengan nama `cv-raden-aradeya-risqi-jagat-pertala.pdf`

## Konami Code Easter Egg

Ketik: ↑ ↑ ↓ ↓ ← → ← → B A di keyboard untuk unlock secret achievement!

## Tech Stack

- Vue.js 3 (Composition API)
- Vite
- Google Fonts: Press Start 2P, Orbitron, Share Tech Mono
- Pure CSS animations (no animation library)
