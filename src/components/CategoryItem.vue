<script setup>
import { defineProps, defineEmits } from 'vue';
const props = defineProps(['category']);

const emit = defineEmits(['select']);

const selectItem = () => {
  emit('select', props.category);
};

</script>
<template>
    <div class="container" @click="selectItem" >
        <div class="name">
            {{category.name}}
        </div>
        <div class="des">
            {{ category.description }}
        </div>
    </div>
</template>

<style scoped>
.container {
    width: 200px;
    height: 200px;
    padding: 3px;
    box-shadow: 1px 1px 1px 1px #c0c0c0;

}
.name {
    font-size: 18px;
    font-weight: 500;
}


</style>