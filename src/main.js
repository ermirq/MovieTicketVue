import { createApp } from 'vue'
import './style.css'
import App from './App.vue'
import router from './router'
import { createPinia } from 'pinia'
import { createI18n } from 'vue-i18n'

const messages = {
  en: {
    welcome: 'Welcome',
    logout: 'Logout'
  },
  fr: {
    welcome: 'Bienvenue',
    logout: 'Déconnexion'
  }
}

const i18n = createI18n({
  locale: 'en', 
  fallbackLocale: 'en',
  messages,
})

const app = createApp(App)
const pinia = createPinia()
app.use(pinia)
app.use(router)
app.mount('#app')