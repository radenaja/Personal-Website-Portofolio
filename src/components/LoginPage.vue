<template>
  <div class="login-wrap">
    <div class="stars-bg"></div>
    <div class="login-box pixel-border">
      <div class="login-planet"></div>
      <div class="login-title">
        <span class="lt-bracket">[</span>
        <span class="lt-name">RADEN</span>
        <span class="lt-bracket">]</span>
      </div>
      <div class="login-subtitle">ADMIN ACCESS REQUIRED</div>

      <div class="login-form">
        <div class="field">
          <label>USERNAME_</label>
          <input
            v-model="username"
            type="text"
            placeholder="enter username"
            @keyup.enter="tryLogin"
            autocomplete="username"
          />
        </div>
        <div class="field">
          <label>PASSWORD_</label>
          <input
            v-model="password"
            type="password"
            placeholder="enter password"
            @keyup.enter="tryLogin"
            autocomplete="current-password"
          />
        </div>

        <div class="error-msg" v-if="error">
          <span>✗ {{ error }}</span>
        </div>

        <button class="btn-login" @click="tryLogin" :disabled="loading">
          {{ loading ? 'AUTHENTICATING...' : '> LOGIN' }}
        </button>

        <div class="back-link" @click="$emit('cancel')">
          ← BACK TO PORTFOLIO
        </div>
      </div>

      <div class="login-hint">
        <span>HR? No need to login — just explore freely.</span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useAuth } from '../stores/auth.js'

const emit = defineEmits(['success', 'cancel'])
const { login } = useAuth()

const username = ref('')
const password = ref('')
const error = ref('')
const loading = ref(false)

function tryLogin() {
  if (!username.value || !password.value) {
    error.value = 'Username and password required.'
    return
  }
  loading.value = true
  error.value = ''
  setTimeout(() => {
    const ok = login(username.value, password.value)
    loading.value = false
    if (ok) {
      emit('success')
    } else {
      error.value = 'Invalid credentials. Access denied.'
      password.value = ''
    }
  }, 800)
}
</script>

<style scoped>
.login-wrap {
  position: fixed; inset: 0;
  background: #050310;
  z-index: 9998;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem;
}
.login-planet {
  width: 56px; height: 56px;
  border-radius: 50%;
  background: radial-gradient(circle at 35% 35%, #c084fc, #7c3aed 50%, #3b0764);
  margin: 0 auto 1.5rem;
  animation: float 3s ease-in-out infinite;
  box-shadow: 0 0 20px rgba(139,92,246,0.5);
}
.login-box {
  background: #1a1230;
  padding: 2.5rem;
  width: 100%;
  max-width: 420px;
  border-radius: 2px;
  text-align: center;
  animation: fadeInUp 0.4s ease;
}

@media (max-width: 480px) {
  .login-box { padding: 1.8rem 1.2rem; }
  .login-title { font-size: 18px; }
  .login-subtitle { font-size: 7px; letter-spacing: 2px; }
  .field label { font-size: 8px; }
  .field input { font-size: 14px; padding: 9px 12px; }
  .btn-login { font-size: 9px; padding: 12px; }
}
.login-title {
  font-family: 'Press Start 2P', monospace;
  font-size: 22px;
  margin-bottom: 6px;
}
.lt-bracket { color: #dc2626; }
.lt-name { color: #e2d9f3; margin: 0 6px; text-shadow: 0 0 15px rgba(139,92,246,0.7); }
.login-subtitle {
  font-family: 'Press Start 2P', monospace;
  font-size: 8px;
  color: #dc2626;
  letter-spacing: 3px;
  margin-bottom: 2.5rem;
}
.login-form { text-align: left; }
.field { margin-bottom: 1.2rem; }
.field label {
  display: block;
  font-family: 'Press Start 2P', monospace;
  font-size: 9px;
  color: #14b8a6;
  letter-spacing: 2px;
  margin-bottom: 8px;
}
.field input {
  width: 100%;
  background: #0a0612;
  border: 1px solid #2d1f4e;
  color: #e2d9f3;
  font-family: 'Share Tech Mono', monospace;
  font-size: 15px;
  padding: 10px 14px;
  outline: none;
  transition: border-color 0.15s;
}
.field input:focus {
  border-color: #8b5cf6;
}
.error-msg {
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  color: #dc2626;
  margin-bottom: 1rem;
  padding: 8px 12px;
  background: rgba(220,38,38,0.1);
  border: 1px solid rgba(220,38,38,0.3);
}
.btn-login {
  width: 100%;
  font-family: 'Press Start 2P', monospace;
  font-size: 11px;
  padding: 14px;
  background: transparent;
  color: #8b5cf6;
  border: 2px solid #8b5cf6;
  cursor: pointer;
  letter-spacing: 2px;
  transition: all 0.15s;
  margin-bottom: 1rem;
}
.btn-login:hover:not(:disabled) {
  background: #8b5cf6;
  color: #050310;
  box-shadow: 0 0 20px rgba(139,92,246,0.6);
}
.btn-login:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
.back-link {
  text-align: center;
  font-family: 'Share Tech Mono', monospace;
  font-size: 12px;
  color: #5c5078;
  cursor: pointer;
  transition: color 0.15s;
  padding: 6px;
}
.back-link:hover { color: #9d8fc0; }
.login-hint {
  margin-top: 2rem;
  padding-top: 1.2rem;
  border-top: 1px solid #2d1f4e;
  font-size: 11px;
  color: #5c5078;
  font-family: 'Share Tech Mono', monospace;
}
</style>
