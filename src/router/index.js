import Vue from 'vue'
import VueRouter from 'vue-router'
import Home from '../views/Home.vue'
import Login from '../views/Login.vue'
import Log from '../views/Log.vue'
import Profile from '../views/Profile.vue'
import Master from '../views/Master.vue'

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
        path: '/log',
        component: Log
      },
      {
        path: '/profile',
        component: Profile
      },
      {
        path: '/master',
        component: Master
      }
    ]
  },
]

const router = new VueRouter({
  routes
})

export default router
