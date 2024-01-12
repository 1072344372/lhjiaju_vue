import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import store from './store'
// 引入cs
import '@/assets/css/global.css'
//引入ElementPlus
import ElementPlus from 'element-plus'
import 'element-plus/dist/index.css'
import * as ElementPlusIconsVue from '@element-plus/icons-vue'
import zhCn from 'element-plus/dist/locale/zh-cn.mjs'
// 粒子特效
import VueParticles from 'vue-particles'


// createApp(App).use(store).use(router).mount('#app')
const app = createApp(App)
app.use(store)
app.use(ElementPlus, {locale: zhCn,})
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
    app.component(key, component)
}
app.use(router)
app.use(VueParticles)
app.mount('#app')