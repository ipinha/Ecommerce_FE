<template>
    <div class="register">
      <h2>Register</h2>
      <div class="form-group">
        <label for="username">Username:</label>
        <input type="text" v-model="user.username" required />
      </div>
      <div class="form-group">
        <label for="email">Email:</label>
        <input type="email" v-model="user.email" required />
      </div>
      <div class="form-group">
        <label for="password">Password:</label>
        <input type="password" v-model="user.password" required />
      </div>
      <div class="form-group">
        <label for="full_name">Full Name:</label>
        <input type="text" v-model="user.full_name" required />
      </div>
      <div class="form-group">
        <label for="address">Address:</label>
        <input type="text" v-model="user.address" required />
      </div>
      <div class="form-group">
        <label for="phone">Phone:</label>
        <input type="text" v-model="user.phone" required />
      </div>
      <button @click="register" class="btn">Register</button>
    </div>
  </template>
  
  <script>
  import axios from 'axios';
  import router from '@/router';
  
  export default {
    data() {
      return {
        user: {
          username: '',
          email: '',
          password: '',
          full_name: '',
          address: '',
          phone: ''
        }
      };
    },
    methods: {
      async register() {
        try {
          const response = await axios.post('http://127.0.0.1:8000/user/register', this.user);
          console.log('User registered successfully:', response.data);

          router.push('/login');
          // Redirect to login or another page if needed
        } catch (error) {
          console.error('Error registering user:', error);
          // Handle error (e.g., show error message)
        }
      }
    }
  };
  </script>
  
  <style scoped>
  .register {
    max-width: 500px;
    margin: 0 auto;
    padding: 20px;
    border: 1px solid #ccc;
    border-radius: 10px;
    box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
    background-color: #fff;
    margin-top: 2%;
  }
  
  h2 {
    text-align: center;
    margin-bottom: 20px;
  }
  
  .form-group {
    margin-bottom: 15px;
  }
  
  .form-group label {
    display: block;
    margin-bottom: 5px;
    font-weight: bold;
  }
  
  .form-group input {
    width: calc(100% - 10px);
    padding: 8px;
    border: 1px solid #ccc;
    border-radius: 5px;
  }
  
  .btn {
    width: 100%;
    padding: 10px;
    background-color: rgb(25, 34, 110);
    color: white;
    border: none;
    border-radius: 5px;
    cursor: pointer;
    font-size: 16px;
  }
  
  .btn:hover {
    background-color: rgb(25, 34, 110);
  }
  </style>
  