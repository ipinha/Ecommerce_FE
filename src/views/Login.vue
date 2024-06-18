<template>
    <div class="login-container">
      <h2>Login</h2>
      <form @submit.prevent="login">
        <div class="form-group">
          <label for="email">Email:</label>
          <input type="email" id="email" v-model="email" required>
        </div>
        <div class="form-group">
          <label for="password">Password:</label>
          <input type="password" id="password" v-model="password" required>
        </div>
        <button type="submit">Login</button>
      </form>

      <div class="btnSignup">
        <p>You are new ? </p>
        <router-link to="/register" class="link"> Signup</router-link>
      </div>

    
    </div>

    
  </template>
  
  <script setup>
import axios from 'axios';
import { ref } from 'vue';
import router from '@/router';

const email = ref('');
const password = ref('');


const login = async () => {
  try {
    const response = await axios.post('http://127.0.0.1:8000/login', new URLSearchParams({
      username: email.value,
      password: password.value
    }));

    localStorage.setItem('access_token', response.data.access_token);


    const userResponse = await axios.get('http://127.0.0.1:8000/user/role', {
      headers: {
        Authorization: `Bearer ${response.data.access_token}`
      }
    });

    console.log('User details response:', userResponse.data);

    const isAdmin = userResponse.data.isAdmin === 'True' ? true : false;

    if (isAdmin) {
      router.push('/admin');
    } else {
      router.push('/');
    }

    window.dispatchEvent(new CustomEvent('login-succes', {detail: response.data.access_token}))

    

  } catch (error) {
    console.error('Login error:', error.message);
  }
};
</script>
  
  <style scoped>
  .login-container {
    max-width: 400px;
    margin: auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 5px;
    margin-top: 10%;
  }

  
  .form-group {
    margin-bottom: 10px;
  }
  
  label {
    display: block;
    margin-bottom: 5px;
  }
  
  input[type="email"],
  input[type="password"] {
    width: 100%;
    padding: 8px;
    font-size: 16px;
    border: 1px solid #ccc;
    border-radius: 4px;
  }
  
  button {
    width: 100%;
    padding: 10px 20px;
    background-color: rgb(25, 34, 110);
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 16px;
  }
  
  button:hover {
    background-color: rgb(25, 34, 110);
  }


  .btnSignup {
    margin-top: 4%;
    display: flex;
  }
  </style>
  