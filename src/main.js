import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入cs
import '@/assets/css/global.css'
//引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'

// createApp(App).use(store).use(router).mount('#app')
const app = createApp(App)
app.use(store)
app.use(ElementPlus, {locale: zhCn,})
app.use(router)
app.mount('#app')