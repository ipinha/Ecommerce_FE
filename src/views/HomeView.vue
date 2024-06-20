<script setup>
import ProductItem from '../components/ProductItem.vue'
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import router from '@/router';

const searchValue = ref('');
const filteredProducts = ref([]);
const products = ref([]);
const categories = ref([]);
const selectedCategory = ref(null);

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/product/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    products.value = response.data;
    filterProducts();
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
};

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/category/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    categories.value = response.data;
  } catch (error) {
    console.error('Error fetching categories:', error.message);
  }
};

const filterProducts = () => {
  let filtered = products.value;
  
  if (selectedCategory.value) {
    filtered = filtered.filter(product => product.category_id === selectedCategory.value);
  }

  if (searchValue.value) {
    filtered = filtered.filter(product => product.name.toLowerCase().includes(searchValue.value.toLowerCase()));
  }

  filteredProducts.value = filtered;
};

const filterByCategory = (categoryId) => {
  selectedCategory.value = categoryId;
  filterProducts();
};

const handleSelect = (product) => {
  router.push(`/product/show/${product.product_id}`);
};

watch(searchValue, () => {
  filterProducts();
});

onMounted(() => {
  fetchCategories();
  fetchProducts();
});
</script>

<template>
<div class="home_container">
  <div class="header">
    <div class="header_top">
      <div class="search">
        <a-input-search
          v-model:value="searchValue"
          placeholder="input search text"
          size="large"
        ></a-input-search>
      </div>
    </div>
    <div class="header_bot">
      <div class="filter-container">
        <button
          v-for="category in categories"
          :key="category.id"
          @click="filterByCategory(category.category_id)"
          :class="{ active: selectedCategory === category.category_id }"
        >
          {{ category.name }}
        </button>
      </div>
    </div>
  </div>
  <div class="list_product">
    <ProductItem class="product_item" v-for="product in filteredProducts" :key="product.id" :product="product" @select="handleSelect" />
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

.header_top, .header_bot {
  margin-top: 1%;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
}

.search {
  width: 40%;
}

.filter-container {
  width: 80%;
  display: flex;
  align-items: center;
  justify-content: center;
}

button {
  border: none;
  background-color: #fff;
  color: rgb(25, 34, 110);
  margin: 1%;
  font-size: 15px;
  cursor: pointer;
}

button.active {
  font-weight: 500;
  font-size: 20px;
  
  
}
</style>
