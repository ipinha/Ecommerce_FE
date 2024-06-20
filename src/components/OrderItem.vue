 <script setup>
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import axios from 'axios';
  import Swal from 'sweetalert2';
  
  const route = useRoute();
  const order = ref(null);
  
  const fetchOrderDetails = async () => {
    try {
      const orderId = route.params.orderId;
      const token = localStorage.getItem('access_token');
      const response = await axios.get(`http://127.0.0.1:8000/order/orders/${orderId}`, {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });
      order.value = response.data;
    } catch (error) {
      console.error('Error fetching order details:', error.message);
      Swal.fire('Error', 'Failed to fetch order details', 'error');
    }
  };
  
  const cancelOrder = async () => {
    try {
      const orderId = route.params.orderId;
      const token = localStorage.getItem('access_token');
      const response = await axios.put(`http://127.0.0.1:8000/order/orders/${orderId}?status=Canceled`, null, {
  headers: {
    Authorization: `Bearer ${token}`
  }
});

      order.value = response.data;
      Swal.fire('Success', 'Order has been canceled successfully', 'success');
      
    } catch (error) {
      console.error('Error canceling order:', error.message);
      Swal.fire('Error', 'Failed to cancel order', 'error');
    }
  };
  
  const confirmCancelOrder = () => {
    Swal.fire({
      title: 'Bạn có chắc chắn muốn hủy đơn hàng này?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Đồng ý',
      cancelButtonText: 'Hủy bỏ'
    }).then((result) => {
      if (result.isConfirmed) {
        cancelOrder();
      }
    });
  };
  
  onMounted(() => {
    fetchOrderDetails();
  });
  </script>

<template>
    <div class="order-details-container">
      <div class="tittle">
        <h1>Chi tiết đơn hàng</h1>
      </div>
      <div class="body">
        <div v-if="order" class="order-details">
            <table>
              <tr>
                <th>Tên</th>
                <td>{{ order.name }}</td>
              </tr>
              <tr>
                <th>Số điện thoại</th>
                <td>{{ order.phone }}</td>
              </tr>
              <tr>
                <th>Địa chỉ</th>
                <td>{{ order.address }}</td>
              </tr>
              <tr>
                <th>Tổng tiền</th>
                <td>{{ order.total.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}</td>
              </tr>
              <tr>
                <th>Trạng thái</th>
                <td>{{ order.status }}</td>
              </tr>
              <tr>
                <th colspan="2">Danh sách sản phẩm</th>
              </tr>
              <tr v-for="item in order.order_items" :key="item.product_id">
                <td colspan="2">
                  Sản phẩm: {{ item.product_id }} - Số lượng: {{ item.quantity }} - Giá: {{ item.price.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' }) }}
                </td>
              </tr>
            </table>
            <button @click="confirmCancelOrder" v-if="order.status !== 'Canceled'" class="cancel-button">Hủy đơn hàng</button>
          </div>
        </div>
    </div>
  </template>
  
 
  
  <style scoped>


  .tittle {
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: 600px;
  }
  .body{
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .order-details {
    width: 60%;
    margin-top: 20px;
  }
  
  table {
    width: 100%;
    border-collapse: collapse;
    margin-top: 10px;
  }
  
  th, td {
    border: 1px solid black;
    padding: 8px;
    text-align: left;
  }
  

  
  .cancel-button {
    margin-top: 10px;
    padding: 8px 16px;
    background-color: #f44336;
    color: white;
    border: none;
    cursor: pointer;
  }
  
  .cancel-button:hover {
    background-color: #d32f2f;
  }

  
  </style>
  