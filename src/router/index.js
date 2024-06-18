import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Admin from '@/views/Managers/Admin.vue'
import Category from '@/views/Managers/Category.vue'
import Product from '@/views/Managers/Product.vue'

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      name: 'home',
      component: HomeView
    },
    {
      path: '/login',
      name: 'login',
      component: Login
    },
    {
      path:'/register',
      name:'/register',
      component: Register
    },
    {
      path:'/admin',
      name:'admin',
      component:Admin
    }, 
    {
      path:'/category',
      name:'category',
      component:Category
    },
    {
      path:'/product',
      name:'product',
      component:Product
    }
  ]
})

export default router
