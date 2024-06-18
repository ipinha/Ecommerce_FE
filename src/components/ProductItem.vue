<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps(['product']);


const emit = defineEmits(['select']);

const selectItem = () => {
  emit('select', props.product);
};
</script>

<template>
    <div class="container" @click="selectItem">
        <div class="image" >
            <img :src="product.image_url" alt="">
        </div>
        <div class="name">{{product.name}}</div>
        <div class="price">{{product.price}}</div>
    </div>
</template>

<style scoped>
    .container {
        width: 140px;
        height: 210px;
        display: block;
        background-color: rgb(255, 255, 255);
        box-shadow:  1px 1px 1px #000;
        border-radius: 8px;

    }
    .image {
        display: flex;
        align-items: center;
        width: 100%;
        justify-content: center;
    }

    img {
        width: 130px;
        height: 130px;
        margin-top: 4%;
    }

    .name {
        display: -webkit-box;
        -webkit-line-clamp: 2; /* Số dòng tối đa hiển thị */
        -webkit-box-orient: vertical;
        overflow: hidden;
        padding:  2% 10px;
        margin-left: 4px;
        font-size: 14;
      }

      .price {
        font-size: 14px;
        padding: 0px 10px;
      }
</style>