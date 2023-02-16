import About from '../views/About.vue'
import Home from '../views/Home.vue'
import Sandbox from '../views/Sandbox.vue'
import Settings from '../views/Settings.vue'
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
      store.actions.openEditorForAdd(store)
    },
  },
  {
    path: '/about',
    name: 'About',
    component: About
  },
  {
    path: '/settings',
    name: 'Settings',
    component: Settings
  },
  {
    path: '/sandbox',
    name: 'Sandbox',
    component: Sandbox
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes
})

export default router
