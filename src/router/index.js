import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/HomeView.vue'
import Login from '@/views/Login.vue'
import Register from '@/views/Register.vue'
import Admin from '@/views/Managers/Admin.vue'
import Category from '@/views/Managers/Category.vue'
import Product from '@/views/Managers/Product.vue'
import ProductDetail from '@/components/ProductDetail.vue'
import Cart from '@/views/Cart.vue'
import Order from '@/views/Order.vue'
import OrderHistory from '@/views/OrderHistory.vue'
import OrderItem from '@/components/OrderItem.vue'


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
    },
    {
      path: '/product/show/:id',
      name: 'ProductDetail',
      component: ProductDetail,
    },
    {
      path:'/cart',
      name:'cart',
      component:Cart
    },
    {
      path:'/order',
      name:'order',
      component:Order
    },
    {
      path:'/orderhistory',
      name:'orderhistory',
      component:OrderHistory
    },
    {
      path: '/order/details/:orderId',
      name: 'orderitem',
      component: OrderItem,
    }


  ]
})

export default router
