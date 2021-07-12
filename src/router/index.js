import Vue from 'vue';
import VueRouter from 'vue-router';
import Login from '../views/pages/Login.vue';
import Dashboard from '../views/pages/Dashboard.vue';

Vue.use(VueRouter)

const routes = [{
    path: '/login',
    name: 'Login',
    component: Login
  },
  {
    path: '/',
    name: 'Dashboard',
    component: Dashboard,
    children: [{
        path: 'menu',
        name: 'Menu',
        component: () => import('../views/pages/master/Menu.vue')
      }, {
        path: 'food',
        name: 'Food',
        component: () => import('../views/pages/master/Food.vue')
      }, {
        path: 'user',
        name: 'User',
        component: () => import('../views/pages/master/User.vue')
      },
      {
        path: '*',
        component: () => import('../views/pages/NotFound.vue')
      }
    ]
  },
  {
    path: '*',
    component: () => import('../views/pages/NotFound.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router