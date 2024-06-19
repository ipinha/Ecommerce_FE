<script setup>
import CartItem from '@/components/CartItem.vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';
import { useRouter } from 'vue-router';
import { eventBus } from '@/eventBus';

const router = useRouter();

const TotalPrice = ref(0);

const carts = ref([]);

const fetchCarts = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/cart/cart', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    const cartItems = response.data.items;
    carts.value = response.data.items;
    
    const fetchProductPrice = async (productId) => {
      try {
        const productResponse = await axios.get(`http://127.0.0.1:8000/product/show/${productId}`);
        return productResponse.data.price;
      } catch (error) {
        console.error(`Error fetching price for product ${productId}:`, error.message);
        return 0; // Default to 0 if there's an error
      }
    };


    for (const item of cartItems) {
      const price = await fetchProductPrice(item.product_id);
      TotalPrice.value += item.quantity * price;
      
    }

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


const placeOrder = () => {
  eventBus.carts = carts.value;
  eventBus.total = TotalPrice.value;
  router.push({ name: 'order' });
};
</script>

<template>
<div class="container">
  <div class="title">CART</div>
  <div class="list_item">
    <CartItem v-for="cart in carts" :key="cart.cart_item_id" :cart="cart" @item-removed="reloadCartItems" />
  </div>
  <div class="footer">
    <div class="total">
     Tổng Tiền: {{ TotalPrice }}
    </div>
    <div class="btn">
      <button @click="placeOrder">Đặt Hàng</button>
    </div>
  </div>
</div>
</template>

<style scoped>

.footer{
  margin-top: 5%;
  display: flex;
  justify-content: space-around;
}
.total {
  margin-left: 20%;
  font-size: 20px;
}
.btn {
  margin-right: 12%;
}
button {
  width: 150px;
  height: 40px;
  background-color:  rgb(25, 34, 110);
  color: #fff;
  border: none;
  font-size: 20px;
}
</style>
