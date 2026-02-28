import { createApp } from 'vue'
import '@fontsource/ibm-plex-sans/latin-400.css'
import '@fontsource/ibm-plex-sans/latin-500.css'
import '@fontsource/ibm-plex-sans/latin-600.css'
import '@fontsource/noto-sans-sc/chinese-simplified-400.css'
import '@fontsource/noto-sans-sc/chinese-simplified-500.css'
import App from './App.vue'
import router from './router'
import './style.css'

const app = createApp(App)

app.use(router)
app.mount('#app')
