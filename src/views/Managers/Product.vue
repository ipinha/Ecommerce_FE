<script setup>
import { ref, reactive, onMounted, watch } from 'vue'
import axios from 'axios'
import ProductItem from '@/components/ProductItem.vue'
import Swal from 'sweetalert2';
const isNew = ref(true)
const categories = ref([])
const selectedCategoryName = ref('')

const nproduct = reactive({
  name: '',
  description: '',
  price: 0,
  stock: 0,
  category_id: null,
  image_url: ''
})

const productID = ref()
// get category
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
// lay category_id tuowng ung voi dropdown
const updateCategoryId = () => {
  const selectedCategory = categories.value.find(category => category.name === selectedCategoryName.value);
  if (selectedCategory) {
    nproduct.category_id = selectedCategory.category_id;
  } else {
    nproduct.category_id = null;
  }
};
// get product selecitem
const selectItem = (product) => {
  nproduct.name = product.name;
  nproduct.description = product.description;
  nproduct.price = product.price;
  nproduct.stock = product.stock;
  nproduct.image_url = product.image_url;
  nproduct.category_id = product.category_id
  productID.value = product.product_id
  const selectedCategory = categories.value.find(category => category.category_id === product.category_id);
  isNew.value= false

 
  if (selectedCategory) {
    selectedCategoryName.value = selectedCategory.name;
  } else {
    selectedCategoryName.value = '';
  }

};


//search
const searchValue = ref('');
const filteredProducts = ref([]);
const products = ref([]);

const fetchProducts = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/product/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    products.value = response.data;
    filteredProducts.value = response.data; // Initialize filteredProducts with all products
  } catch (error) {
    console.error('Error fetching products:', error.message);
  }
};

onMounted(fetchProducts);

watch(searchValue, (newValue) => {
  filterProducts(newValue);
});

const filterProducts = (searchTerm) => {
  filteredProducts.value = products.value.filter((product) => {
    return product.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
};



onMounted(() => {
  fetchProducts();
  fetchCategories();
  updateCategoryId();
});


// xoa sach du lieu trong form
const clearForm = () => {
  nproduct.name = '';
  nproduct.description = '';
  nproduct.price = 0;
  nproduct.stock = 0;
  nproduct.image_url = '';
  nproduct.category_id = null;
  selectedCategoryName.value = null;
  isNew.value = true
};


//update product

const updateProduct = async () => {
  const productData = {
    name: nproduct.name,
    description: nproduct.description,
    price: nproduct.price,
    stock: nproduct.stock,
    category_id: nproduct.category_id,
    image_url: nproduct.image_url
  };

  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.put(`http://127.0.0.1:8000/product/update/${productID.value}`, productData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    Swal.fire({
      icon: 'success',
      text: 'Product updated successfully!'
    }).then(() => {
      console.log('Product updated:', response.data);
      clearForm();
      fetchProducts();
    });
  } catch (error) {
    console.error('Error updating product:', error);
    Swal.fire({
      icon: 'error',
      text: 'Failed to update product. Please try again later.'
    });
  }
};

// create
const add = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.post('http://127.0.0.1:8000/product/create', nproduct, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    Swal.fire({
      icon: 'success',
      text: 'Product added successfully!'
    }).then(() => {
      console.log('Product added:', response.data);
      clearForm();
      fetchProducts();
    });
  } catch (error) {
    console.error('Error adding product:', error);
    Swal.fire({
      icon: 'error',
      text: 'Failed to add product. Please try again later.'
    });
  }
};


// remove product
const removeProduct = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.delete(`http://127.0.0.1:8000/product/delete/${productID.value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    Swal.fire({
      icon: 'success',
      text: 'Product deleted successfully!'
    }).then(() => {
      console.log('Product deleted:', response.data);
      fetchProducts();
      clearForm(); // Reload products after deletion
    });
  } catch (error) {
    console.error('Error deleting product:', error);
    Swal.fire({
      icon: 'error',
      text: 'Failed to delete product. Please try again later.'
    });
  }
};


</script>

<template>
  <div class="product_container">
    <div class="left_container">
      <div class="header">
        <div class="search">
          <a-input-search
            v-model:value="searchValue"
            placeholder="input search text"
            size="large"
            @search="filterProduct"
          ></a-input-search>
        </div>
      </div>

      <div class="list_product">
        <ProductItem
          v-for="product in filteredProducts"
          :key="product.product_id"
          :product="product"
          @select="selectItem"
          class="product_item"
        />
      </div>
    </div>
    <hr>
    <div class="right_container">
      <div class="input_container">
        <input type="text" placeholder="Name" v-model="nproduct.name" />
        <textarea placeholder="Description" v-model="nproduct.description"></textarea>
        <input type="number" placeholder="Price" v-model="nproduct.price" />
        <input type="number" placeholder="Stock" v-model="nproduct.stock" />
        <div>
          <label for="category">Category:</label>
          <select id="category" v-model="selectedCategoryName" @change="updateCategoryId">
            <option value="" disabled>Select category</option>
            <option v-for="category in categories" :key="category.id" :value="category.name">
              {{ category.name }}
            </option>
          </select>
        </div>
        <input type="text" placeholder="Image URL" v-model="nproduct.image_url" />
      </div>

      <div class="button_container">
        <a-button v-if="isNew" @click="add" type="primary" ghost>Add</a-button>
        <a-button v-else @click="updateProduct" type="primary" ghost>Update</a-button>
        <a-button v-if="!isNew" @click="removeProduct" type="primary" danger ghost>Remove</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.product_container {
  min-width: 100%;
  display: flex;
}

.left_container {
  min-width: 60%;
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}

.header {
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  width: 40%;
}

.list_product {
  width: 80%;
  justify-content: flex-start;
  margin-top: 2%;
  margin-left: 10%;
  display: flex;
  gap: 3rem;
  flex-wrap: wrap;
}

.right_container {
  width: 30%;
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}

.input_container {
  margin-bottom: 1rem;
}

.input_container input,
textarea,
select {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}
textarea {
  min-height: 180px;
}

.button_container button {
  margin-right: 0.5rem;
  cursor: pointer;
}


.product_item {
    transition: transform 0.3s ease;
    cursor: pointer;
  }
  
  .product_item:hover {
    transform: scale(1.1);
  }
</style>
