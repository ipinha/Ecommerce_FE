<template>
  <div class="cartitem_container">
    <div class="image">
      <img :src="nimage" alt="">
    </div>
    <div class="name">{{ cart.product_name }}</div>
    <hr>
    <div class="price">{{ formatCurrency(nprice) }}</div>
    <hr>
    <div class="quantity">{{ cart.quantity }}</div>
    <hr>
    <div class="total">{{ formatCurrency(nprice * cart.quantity) }}</div>
    <div class="btn">
      <button class="removebtn" @click="showConfirmModal = true">Remove</button>
    </div>

    <!-- Modal xác nhận xóa -->
    <div class="modal" v-if="showConfirmModal">
      <div class="modal-content">
        <p>Bạn có chắc chắn muốn xóa sản phẩm này khỏi giỏ hàng?</p>
        <div class="modal-buttons">
          <button @click="removeItem">Đồng ý</button>
          <button @click="cancelRemove">Hủy</button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { defineProps, ref, defineEmits } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

const props = defineProps(['cart']);
const emits = defineEmits(['item-removed']);

const product = ref({});
const nprice = ref();
const nimage = ref("");
const showConfirmModal = ref(false);

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

const removeItem = async () => {
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
      emits('item-removed'); // Gửi sự kiện cho parent component biết rằng mục đã được xóa
      showConfirmModal.value = false; // Đóng modal sau khi xóa thành công
    });

  } catch (error) {
    console.error('Error removing item:', error);

    Swal.fire({
      icon: 'error',
      text: 'Failed to remove item. Please try again later.'
    });
  }
};

const cancelRemove = () => {
  showConfirmModal.value = false; // Đóng modal nếu hủy xóa
};

const formatCurrency = (value) => {
  if (value === undefined || value === null) return "0 VND";
  return value.toLocaleString('vi-VN', { style: 'currency', currency: 'VND' });
};

fetchProduct(); // Gọi hàm fetchProduct khi component được mount

</script>

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

.price, .quantity {
  width: 5%;
}
.total{
  width: 8%;
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

/* Modal styles */
.modal {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent black */
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

button {
  padding: 10px 20px;
  cursor: pointer;
  border: none;
  border-radius: 4px;
  background-color: #007bff;
  color: #fff;
}

button:hover {
  background-color: #0056b3;
}
</style>
