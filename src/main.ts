import { createApp } from 'vue'
import App from './App.vue'
import 'normalize.css/normalize.css'
import router from './router'
import {provideEventBus} from './utils/eventBus'
const app  = createApp(App)
provideEventBus(app)
app.use(router).mount('#app')
