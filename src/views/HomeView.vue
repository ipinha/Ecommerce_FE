<script setup>
import ProductItem from '../components/ProductItem.vue'
import { ref, onMounted } from 'vue';
import axios from 'axios';

const productData = ref({});
onMounted(async () => {
  try {
    const response = await axios.get('http://127.0.0.1:8000/product/all');
    productData.value = response.data
    console.log(productData.value);

  } catch (error) {
    console.error('Error fetching product data:', error);
  }
});

</script>

<template>
<div class="home_container">
  <div class="list_product">
    <ProductItem class="product_item" v-for="product in productData" :key="product.id" :product="product" />
  </div>
</div>
</template>

<style scoped>
.home_container {
  min-width: 100%;
  
}
.list_product {
  margin-top: 2%;
  min-width: 80%;
  margin-left: 10%;
  margin-right: 10%;
  display: flex;
  justify-content: flex-start;
  gap: 1rem;
}

.product_item {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.product_item:hover {
  transform: scale(1.1);
}
</style>


