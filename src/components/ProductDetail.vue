<script setup>
 import { ref, onMounted, computed } from 'vue';
import axios from 'axios';
import { useRoute } from 'vue-router';
import Swal from 'sweetalert2';

const route = useRoute();
const productId = route.params.id;
const product = ref(null);
const loading = ref(true);
const error = ref(null);
const quantityCart = ref(1);

const fetchProduct = async (id) => {
  try {
    const response = await axios.get(`http://127.0.0.1:8000/product/show/${id}`);
    product.value = response.data;
    console.log(product.value);
  } catch (err) {
    error.value = err;
  } finally {
    loading.value = false;
  }
};

const formatPrice = computed(() => {
  if (product.value) {
    return new Intl.NumberFormat('vi-VN', { }).format(product.value.price);
  }
});

const increment = () => {
  if (quantityCart.value < product.value.stock) {
    quantityCart.value++;
  } else {
    alert('Số lượng hàng trong kho không đủ!');
  }
};

const decrement = () => {
  if (quantityCart.value > 1) {
    quantityCart.value--;
  }
};
const AddToCart = () => {
  const data = {
    product_id: productId,
    quantity: quantityCart.value,
  };
  const token = localStorage.getItem('access_token');
  const config = {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  };
  

  axios.post('http://127.0.0.1:8000/cart/add_to_cart', data, config)
    .then(response => {
      console.log('Đã thêm vào giỏ hàng:', response.data);
      Swal.fire({
        icon: 'success',
        text: 'Added to cart successfully!'
      }).then(() => {
        
        console.log('Cart updated:', response.data);
        
      });
    })
    .catch(error => {
      console.error('Lỗi khi thêm vào giỏ hàng:', error);
      Swal.fire({
        icon: 'error',
        text: 'Failed to add to cart!'
      });
    });
};

onMounted(() => {
  fetchProduct(productId);
});
</script>

<template>
    <div class="product_detail">
        <div v-if="loading">Loading....</div>
        <div v-else-if="product" class="detail_container">
            <div class="left_cotainer">
                <div class="image">
                    <img :src="product.image_url" alt="">
                </div>
            </div>
            <hr>
            <div class="right_container">
                <div class="top">
                    <div class="name">{{product.name}}</div>
                    <div class="descriptions">{{product.description}}</div>
                    <div class="price">{{formatPrice}}  VND</div>
                </div>

                <div class="bottom">
                    <div>
                        <button @click="decrement">-</button>
                        <span class="quantity">{{ quantityCart }}</span>
                        <button @click="increment">+</button>
                    </div>
                    <div class="stock">Số lượng còn trong kho: {{ product.stock }}</div>
                    <button  class="Addtocart" @click="AddToCart">Add To Cart</button>
                </div>
            </div>
        </div>
    </div>
</template>


<style scoped>
.product_detail {
    display: flex;
    align-items: center;
    justify-content: center;
    min-height: 100%;
    min-width: 100%;
}
.detail_container{
    display: flex;
    margin: 5% 5%;
    width: 100%;
}

.left_cotainer {
    margin-right: 5%;
    margin-left: 10%;
    width: 30%;
    align-items: center;
    justify-content: center;
}
.right_container {
    margin-left: 5%;
    width: 50%;
}
.name {
    font-size: 30px;
    font-weight: 600;
    color: rgb(25, 34, 110);

}
.descriptions {
    font-size: 15px;
    font-weight: 300;
    color: rgb(25, 34, 110);
    
}
.price {
    font-size: 27px;
    margin-top: auto;
}
.bottom {
    margin-top: 1%;
    font-size: 18px;
}
.quantity {
    width: 10%;
    padding: 0 5%;
}
button {

    width: 40px;
    height: 20px;
    background-color:#fff;
    color:  rgb(25, 34, 110) ;
    border:  1px rgb(25, 34, 110) solid ;

}
.stock {
    font-size: 14px;
    color: rgb(25, 34, 110) ;
}



img {
    width: 300px;
}
.Addtocart{
    width: 32%;
    height: 30px;
    margin-top:5% ;
    background-color: rgb(25, 34, 110)  ;
    color: #fff;
    font-size: 20px;
    font-weight: 400;

}
</style>