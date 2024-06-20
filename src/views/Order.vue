<template>
  <div class="container">
    <table class="cart-table">
      <thead>
        <tr>
          <th>Product Name</th>
          <th>Quantity</th>
          <th>Price</th>
          <th>Total</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="cart in carts" :key="cart.cart_item_id">
          <td>{{ cart.product_name }}</td>
          <td>{{ cart.quantity }}</td>
          <td>{{ formatCurrency(cart.price) }}</td>
          <td>{{ formatCurrency(cart.price * cart.quantity) }}</td>
        </tr>
      </tbody>
    </table>
  
    <div class="footer">
      <div class="total">
        Tổng Tiền: {{ formatCurrency(total) }}
      </div>
      <div class="form-group">
        <label for="names">Name:</label>
        <input type="text" id="name" v-model="name" placeholder="Enter your name">
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" id="phone" v-model="phone" placeholder="Enter your phone number">
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" id="address" v-model="address" placeholder="Enter your address">
      </div>
      <div class="btn">
        <button @click="confirmOrder = true">Đặt Hàng</button>
      </div>
    </div>
  
    <!-- Modal for confirmation -->
    <div class="modal" v-if="confirmOrder">
      <div class="modal-content">
        <p>Bạn có chắc chắn muốn đặt hàng?</p>
        <div class="modal-buttons">
          <button style="margin-right: 10px;" @click="confirmOrder = false">Hủy</button>
          <button @click="placeOrderAndCloseModal">Đồng ý</button>
        </div>
      </div>
    </div>
  </div>
  </template>
  
  <script setup>
  import { eventBus } from '@/eventBus';
  import { onMounted, ref } from 'vue';
  import axios from 'axios';
import router from '@/router';
import Swal from 'sweetalert2';
  
  const carts = ref([]);
  const total = ref(0);
  const phone = ref('');
  const address = ref('');
  const name = ref('')
  const confirmOrder = ref(false); // State to manage confirmation modal
  
  onMounted(async () => {
    carts.value = eventBus.carts || [];
    await updateCartPrices();
    calculateTotal();
  });
  
  const fetchProductPrice = async (productId) => {
    try {
      const productResponse = await axios.get(`http://127.0.0.1:8000/product/show/${productId}`);
      return productResponse.data.price;
    } catch (error) {
      console.error(`Error fetching price for product ${productId}:`, error.message);
      Swal.fire({
        icon: 'error',
        text: 'Failed to update category. Please try again later.'
      });
      router.push('cart')
      return 0; 
    }
  };
  
  const updateCartPrices = async () => {
    const promises = carts.value.map(async (cart) => {
      cart.price = await fetchProductPrice(cart.product_id);
    });
    await Promise.all(promises); 
  };
  
  const calculateTotal = () => {
    total.value = carts.value.reduce((sum, cart) => {
      return sum + cart.price * cart.quantity;
    }, 0);
  };
  
  const formatCurrency = (value) => {
    if (value === undefined || value === null) return "0 VND";
    return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
  };
  
  const placeOrder = async () => {
    const token = localStorage.getItem('access_token'); 
  
    if (!token) {
      console.error('Token not found');
      return;
    }
  
    const orderData = {
      total: total.value,
      status: "Pending",
      name:name.value,
      phone: phone.value,
      address: address.value,
      order_items: carts.value.map(cart => ({
        product_id: cart.product_id,
        quantity: cart.quantity,
        price: cart.price
      }))
    };
  
    try {
      const response = await axios.post('http://127.0.0.1:8000/order/create_order', orderData, {
        headers: {
          Authorization: `Bearer ${token}` 
        }
      });
      Swal.fire({
      icon: 'success',
      text: 'Category added successfully!'
    }).then(() => {
      router.push('/orderhistory')
    });
      console.log('Order placed successfully:', response.data);
    } catch (error) {
      console.error('Error placing order:', error.message);
    }
  };
  
  const placeOrderAndCloseModal = () => {
    placeOrder(); 
    confirmOrder.value = false;
  };
  </script>
  
  <style scoped>
  .container {
    margin: 20px auto;
    width: 50%; 
  }
  
  .cart-table {
    width: 100%;
    border-collapse: collapse;
    margin-bottom: 20px;
  }
  
  .cart-table th, .cart-table td {
    border: 1px solid #ddd;
    padding: 8px;
    text-align: left;
  }
  
  .cart-table th {
    background-color: #f2f2f2;
  }
  
  .footer {
    display: flex;
    flex-direction: column;
    justify-content: space-between;
    align-items: center; 
  }
  
  .total {
    font-size: 20px;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 10px;
    width: 100%;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input {
    width: calc(100% - 10px);
    padding: 8px;
    margin-bottom: 10px;
    border: 1px solid #ddd;
    border-radius: 4px;
  }
  
  .btn {
    text-align: right;
    width: 100%;
  }
  
  button {
    width: 150px;
    height: 40px;
    background-color: rgb(25, 34, 110);
    color: #fff;
    border: none;
    font-size: 20px;
    cursor: pointer;
  }
  
 
  .modal {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-color: rgba(0, 0, 0, 0.5); 
    display: flex;
    justify-content: center;
    align-items: center;
  }
  
  .modal-content {
    background-color: #fff;
    padding: 20px;
    border-radius: 4px;
    width: 300px;
    text-align: center;
  }
  
  .modal-buttons {
    display: flex;
    justify-content: space-around;
    margin-top: 20px;
  }
  </style>
  