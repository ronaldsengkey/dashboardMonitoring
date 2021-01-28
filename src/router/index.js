import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Monitor from '../views/Monitor.vue'

Vue.use(VueRouter)

const routes = [
  {
    path: '/',
    name: 'Login',
    component: Login
  },
  {
    path: '/home',
    name: 'Home',
    component: Home,
    children : [
      {
        path: '/',
        component: () => import('../views/Landing.vue')
      },
      {
        path: '/monitor',
        component: Monitor
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
