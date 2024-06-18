<script setup>

</script>

<template>
    <div class="container">
      <div class="category">
        <router-link to="/category" class="link">Category</router-link>
      </div>
      <div class="product">
        <router-link to="/product"  class="link" >Product</router-link>
      </div>
      <div class="order">
        <router-link to="/product"  class="link" >Order</router-link>
      </div>
    </div>
</template>

<style scoped>
.container {
  display: flex;
  justify-content: center; /* Canh giữa theo chiều ngang */
}

.category, .product, .order {
  width: 250px;
  height: 200px;
  background-color:  rgb(25, 34, 110);
  display: flex;
  justify-content:center;
  align-items: center;
  margin-left: 2%;
  margin-top: 15%;
}
.link {
  text-decoration: none;
  color: #fff;
  font-size: 30px;
  font-weight: 400;
}
</style>