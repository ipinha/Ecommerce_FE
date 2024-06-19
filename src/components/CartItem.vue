<script setup>
import { defineProps, onMounted, ref, defineEmits } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps(['cart']);
const emits = defineEmits(['item-removed']);

const product = ref({});
const nprice = ref();
const nimage = ref("");

const fetchProduct = async () => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/product/show/${props.cart.product_id}`);
    product.value = response.data;
    nprice.value = product.value.price;
    nimage.value = product.value.image_url;
  } catch (error) {
    console.error('Error fetching product:', error.message);
  }
};

// Fetch product data when component is mounted
onMounted(() => {
  fetchProduct();
});

// Function to remove item from cart
const remove = async () => {
  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.delete(`http://127.0.0.1:8000/cart/remove_from_cart/${props.cart.cart_item_id}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    console.log('Item removed:', response.data);

    Swal.fire({
      icon: 'success',
      text: 'Item removed successfully!'
    }).then(() => {
      // Emit event to parent component to inform about item removal
      emits('item-removed');
    });

  } catch (error) {
    console.error('Error removing item:', error);

    Swal.fire({
      icon: 'error',
      text: 'Failed to remove item. Please try again later.'
    });
  }
};
</script>

<template>
  <div class="cartitem_container">
    <div class="image">
      <img :src="nimage" alt="">
    </div>
    <div class="name">{{ cart.product_name }}</div>
    <hr>
    <div class="price">{{ nprice }}</div>
    <hr>
    <div class="quantity">{{ cart.quantity }}</div>
    <hr>
    <div class="total">{{ nprice * cart.quantity }}</div>
    <div class="btn">
      <button class="removebtn" @click="remove">Remove</button>
    </div>
  </div>
</template>

<style scoped>
.cartitem_container {
  display: flex;
  margin-top: 3%;
  margin-left: 5%;
  align-items: center;
  justify-content: center;
}
.image {
  width: 70px;
  height: 105px;
  margin-right: 10px;
}
.name {
  margin-right: 3%;
  width: 15%;
}
.price {
  width: 5%;
}
.quantity {
  width: 5%;
}
.total {
  width: 5%;
}
.btn {
  display: flex;
  align-items: center;
  justify-content: center;
}
.removebtn {
  height: 30px;
  background-color: rgb(25, 34, 110);
  border: none;
  color: #fff;
  cursor: pointer;
}
.image img {
  max-width: 100%;
  max-height: 100%;
  object-fit: cover;
}
</style>
