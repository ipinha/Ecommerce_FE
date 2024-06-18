<script setup>
  import { RouterLink } from 'vue-router';
  import { computed,watchEffect, ref, onMounted, watch } from 'vue';
  import { useRouter } from 'vue-router';
  import axios from 'axios';
  
  const router = useRouter();
  const AdminIS = ref(false);
  const isLoggedIn = ref(false)


  const logout = () => {
    localStorage.removeItem('access_token');
    router.push('/login');
    isLoggedIn.value = false;
    AdminIS.value = false;

  };

  const login = async () => {
  try {
    const token = localStorage.getItem('access_token');
    const userResponse = await axios.get('http://127.0.0.1:8000/user/role', {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    isLoggedIn.value = true;
    const isAdmin = userResponse.data.isAdmin === 'True' ? true : false;
    if (isAdmin) {
      AdminIS.value = true
    }
    console.log(isAdmin);
    
  } catch (error) {
    console.error('Login error:', error.message);
  }
};




window.addEventListener('login-succes', (event) => {
  isLoggedIn.value= true
  login()
})


</script>

<template>
  <div class="container">
    <div class="left-container">
      <router-link to="/" class="link">DIAMOND</router-link>
    </div>


    <div class="right-container">
      <router-link v-if="AdminIS" to="/admin" class="link">Admin</router-link>
      <div class="btnlogin">
        
        <p v-if="isLoggedIn"  @click="logout"  class="link">Logout</p>
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

  .center-container {
    color: white;
  }

  .right-container {
    display: flex;
    margin-right: 5%;
    text-decoration: none;
  }

  .btnSignup {
    margin-left: 10%;
  }

  .link {
    text-decoration: none;
    color: white;
    margin-left: 20%;
  }

  .btnlogin {
    display: inline-block;
  }

  .btnlogin:hover,
  .btnSignup:hover {
    cursor: pointer;
  }
</style>