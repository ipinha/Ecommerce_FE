  
  <script setup>
  import { ref, onMounted } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const orders = ref([]);
  const router = useRouter();
  
  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('access_token');
      const response = await axios.get('http://127.0.0.1:8000/order/orders', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      orders.value = response.data;
    } catch (error) {
      console.error('Error fetching orders:', error.message);
      Swal.fire('Error', 'Failed to fetch orders', 'error');
    }
  };
  
  const goToOrderDetails = (orderId) => {
    // console.log(orderId);
    router.push(`/order/details/${orderId}`);
  };
  
  onMounted(() => {
    fetchOrders();
  });
  </script>
<template>
    <div>
      <h1 class="title">Đơn hàng của người dùng</h1>
      <div class="list_order">
        <table>
          <thead>
            <tr>
              <th>Tên</th>
              <th>Số điện thoại</th>
              <th>Địa chỉ</th>
              <th>Tổng tiền</th>
              <th>Trạng thái</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="order in orders" :key="order.order_id" @click="goToOrderDetails(order.order_id)">
              <td>{{ order.name }}</td>
              <td>{{ order.phone }}</td>
              <td>{{ order.address }}</td>
              <td>{{ order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</td>
              <td>{{ order.status }}</td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </template>

  
  <style scoped>
  .title, .list_order {
    width: 100%;
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    justify-content: center;
  }
  table {
    width: 60%;
    border-collapse: collapse;
  }
  table,
  th,
  td {
    border: none;
  }
  th,
  td {
    padding: 10px;
    text-align: left;
  }
  tr {
    cursor: pointer;
    border-bottom:1px solid black ;
    padding-top: 10px;
  }
  </style>
  