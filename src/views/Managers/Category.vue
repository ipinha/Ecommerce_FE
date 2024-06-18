<script setup>
import CategoryItem from '@/components/CategoryItem.vue';
import { ref, onMounted, watch } from 'vue';
import axios from 'axios';
import Swal from 'sweetalert2';

// Search
const searchValue = ref('');
const filteredCategories = ref([]);
const categories = ref([]);

const fetchCategories = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const response = await axios.get('http://127.0.0.1:8000/category/all', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    categories.value = response.data;
    filteredCategories.value = response.data; // Initialize filteredCategories with all categories
  } catch (error) {
    console.error('Error fetching categories:', error.message);
  }
};

onMounted(fetchCategories);

watch(searchValue, (newValue) => {
  filterCategories(newValue);
});

const filterCategories = (searchTerm) => {
  filteredCategories.value = categories.value.filter((category) => {
    return category.name.toLowerCase().includes(searchTerm.toLowerCase());
  });
};




const name = ref("");
const description = ref("");
const isLogin = ref(true);
const categoryID = ref(null); 

const selectItem = (category) => {
  name.value = category.name;
  description.value = category.description;
  isLogin.value = false;
  categoryID.value = category.category_id; 
};

//clear form
const clearForm = () => {
  name.value = "";
  description.value = "";
  isLogin.value = true;
};

// Update category
const updateCategory = async () => {
  const categoryData = {
    name: name.value,
    description: description.value
  };

  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.put(`http://127.0.0.1:8000/category/update/${categoryID.value}`, categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });
    Swal.fire({
      icon: 'success',
      text: 'Category added successfully!'
    }).then(() => {
      console.log('Category updated:', response.data);
      clearForm();
      fetchCategories();
    });
  } catch (error) {
    console.error('Error updating category:', error);
    Swal.fire({
      icon: 'error',
      text: 'Failed to update category. Please try again later.'
    });
  }
};


//add category
const add = async () => {
  const categoryData = {
    name: name.value,
    description: description.value
  };

  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.post('http://127.0.0.1:8000/category/create', categoryData, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    });

    Swal.fire({
      icon: 'success',
      text: 'Category added successfully!'
    }).then(() => {
      console.log('Category updated:', response.data);
      clearForm();
      fetchCategories();
    });

  } catch (error) {
    console.error('Error adding category:', error);

    Swal.fire({
      icon: 'error',
      text: 'Failed to add category. Please try again later.'
    });
  }
};


//remove 
const remove = async () => {
  if (!categoryID.value) {
    console.error('No category selected');
    return;
  }

  const token = localStorage.getItem('access_token');

  try {
    const response = await axios.delete(`http://127.0.0.1:8000/category/delete/${categoryID.value}`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    console.log('Category removed:', response.data);
    fetchCategories(); 

  
    Swal.fire({
      icon: 'success',
      text: 'Category removed successfully!'
    }).then(() => {
      clearForm();
    });

  } catch (error) {
    console.error('Error removing category:', error);
 
    Swal.fire({
      icon: 'error',
      text: 'Failed to remove category. Please try again later.'
    });
  }
};
</script>

<template>
  <div class="category_container">
    <div class="left_container">
      <div class="header">
        <div class="search">
          <a-input-search
            v-model:value="searchValue"
            placeholder="input search text"
            size="large"
            @search="filterCategories"
          ></a-input-search>

      
        </div>
      </div>

        <div class="list_cate">
          <CategoryItem class="category_item" v-for="category in filteredCategories" :key="category.category_id" :category="category" @select="selectItem" />
        </div>
      
    </div>
    <hr/>

    <div class="right_container">
      <div class="input_container">
        <input type="text" placeholder="Name" v-model="name" />
        <textarea type="text" placeholder="Description" v-model="description" />
      </div>
    
      <div class="button_container">
        <a-button v-if="isLogin" @click="add" type="primary" ghost>Add</a-button>
        <a-button v-else @click="updateCategory" type="primary" ghost>Update</a-button>
        <a-button v-if="!isLogin" @click="remove" type="primary"danger ghost>Remove</a-button>
      </div>
    </div>
  </div>
</template>

<style scoped>
.category_container {
  min-width: 100%;
  display: flex;
}

.left_container {
  min-width: 60%;
  margin-top: 2%;
  margin-left: 5%;
  margin-right: 5%;
}

.header{
  width: 100%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.search {
  width: 40%;
}

.list_cate {
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

.input_container input , textarea {
  display: block;
  width: 100%;
  padding: 0.5rem;
  margin-bottom: 0.5rem;
}

.button_container button {
  margin-right: 0.5rem;
  cursor: pointer;
}

.category_item {
  transition: transform 0.3s ease;
  cursor: pointer;
}

.category_item:hover {
  transform: scale(1.1);
}
</style>
