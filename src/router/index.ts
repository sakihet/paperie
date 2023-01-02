import About from '../views/About.vue'
import Home from '../views/Home.vue'
import { createRouter, createWebHistory } from 'vue-router'
import { store } from '../store'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: Home,
    beforeEnter: () => {
      store.isAdding = false // TODO
      store.isEditing = false // TODO
      store.editorDialogOpen = false
    }
  },
  {
    path: '/new',
    name: 'New',
    component: Home,
    beforeEnter: () => {
      store.isEditing = false
      store.isAdding = true
      store.openEditorForAdd()
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
