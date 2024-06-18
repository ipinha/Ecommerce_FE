<script setup>
import CartItem from '@/components/CartItem.vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const carts = ref([]);

const fetchCarts = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/cart/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    carts.value = response.data.items;
    console.log(carts.product_id);
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
}; 

onMounted (() => {
    fetchCarts()
})
const reloadCartItems = () => {
  fetchCarts()
};
</script>

<template>


    <CartItem v-for="cart in carts" :key="cart.cart_item_id" :cart="cart" @item-removed="reloadCartItems" />


</template>
