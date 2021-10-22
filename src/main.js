import { createApp } from 'vue'
import App from './app/component.vue'
import './registerServiceWorker'
import { router } from './app/router'

createApp(App).use(router).mount('#app')
