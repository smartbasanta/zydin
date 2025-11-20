import { createApp } from 'vue'
import { createPinia } from 'pinia'
import App from './App.vue'
import router from './router'
import { useTheme } from '@/composables/useTheme'
import type { RouteRecordNormalized } from 'vue-router'

// Initialize theme system
const { initTheme } = useTheme()
const cleanupTheme: () => void = initTheme()

const app = createApp(App)

app.use(createPinia()) 
app.use(router)
app.provide('cleanupTheme', cleanupTheme)
app.mount('#app')



// const routes: RouteRecordNormalized[] = router.getRoutes()
// console.log(routes);
// Extract name and path
// const routeList = routes.map(route => ({
//   name: route.name,
//   path: route.path
// }))

// console.log(routeList)