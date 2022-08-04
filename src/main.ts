import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

import './assets/css/base.css'
import './assets/css/utility.css'
import './assets/css/pattern.css'
import './assets/css/layout.css'

createApp(App).use(router).mount('#app')
