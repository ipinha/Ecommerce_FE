<script setup>
import { eventBus } from '@/eventBus';
import { onMounted, ref } from 'vue';

const carts = ref([]);
const total = ref(0);

onMounted(() => {
  carts.value = eventBus.carts || [];
  total.value = eventBus.total || 0;
});
</script>

<template>
<div class="container">
  <table class="cart-table">
    <thead>
      <tr>
        <th>Product Name</th>
        <th>Quantity</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="cart in carts" :key="cart.cart_item_id">
        <td>{{ cart.product_name }}</td>
        <td>{{ cart.quantity }}</td>
      </tr>
    </tbody>
  </table>

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
.container {
  margin: 20px auto; /* Center align horizontally */
  width: 50%; /* Set container width to 50% of viewport */
}

.cart-table {
  width: 100%;
  border-collapse: collapse;
  margin-bottom: 20px; /* Add some space below the table */
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
  justify-content: space-between;
  align-items: center; /* Align items vertically */
}

.total {
  font-size: 20px;
}

.btn {
  text-align: right;
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
</style>
