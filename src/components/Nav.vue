<script setup>
  import { ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';

  const router = useRouter();
  const isLoggedIn = ref(false);
  const isAdmin = ref(false);

  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
    isLoggedIn.value = false;
    isAdmin.value = false;
  };

  const login = async () => {
    try {
      const token = localStorage.getItem('access_token');
      
      if (!token) {
        isLoggedIn.value = false;
        isAdmin.value = false;
        return;
      }
      
      const userResponse = await axios.get('http://127.0.0.1:8000/user/role', {
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      isLoggedIn.value = true;
      isAdmin.value = userResponse.data.isAdmin === 'True';
    } catch (error) {
      console.error('Login error:', error.message);
      isLoggedIn.value = false;
      isAdmin.value = false;
    }
  };


  onMounted(login);



  window.addEventListener('login-success', () => {
    login(); 
  });
</script>

<template>
  <div class="container">
    <div class="left-container">
      <router-link to="/" class="link">DIAMOND</router-link>
    </div>

    <div class="right-container">
      <router-link v-if="isAdmin" to="/admin" class="link">Admin</router-link>
      <router-link to="/cart" class="link">Cart</router-link>
      <div class="btnlogin">
        <p v-if="isLoggedIn" @click="logout" class="link">Logout</p>
        <router-link v-else to="/login" class="link">Login</router-link>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .container {
    display: flex;
    width: 100%;
    justify-content: space-between;
    min-height: 5%;
    background-color: rgb(25, 34, 110);
    align-items: center;
    padding: 0.5%;
  }

  .left-container {
    font-size: 30px;
    margin-left: 5%;
    color: white;
  }

  .right-container {
    display: flex;
    margin-right: 5%;
  }

  .link {
    text-decoration: none;
    color: white;
    margin-left: 20px;
  }

  .btnlogin {
    display: inline-block;
  }

  .btnlogin:hover {
    cursor: pointer;
  }
</style>
