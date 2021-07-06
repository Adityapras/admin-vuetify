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
      path: '/master/menu',
      name: 'Menu',
      component: () => import( /* webpackChunkName: "demo" */ '../views/pages/master/Menu.vue')
    }, {
      path: '/master/food',
      name: 'Food',
      component: () => import( /* webpackChunkName: "demo" */ '../views/pages/master/Food.vue')
    }, ]
  },
  {
    path: '/about',
    name: 'About',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import( /* webpackChunkName: "about" */ '../views/About.vue')
  }
]

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes
})

export default router