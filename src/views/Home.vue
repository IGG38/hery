<template>
  <div class="min-h-screen flex items-center justify-center bg-gray-100">
    <div class="p-8 bg-white rounded-xl shadow-lg w-96">
      <h1 class="text-2xl font-bold text-center mb-4">Vue3 + TailwindCSS</h1>
      <input v-model="name" placeholder="请输入用户名" class="w-full px-4 py-2 border rounded-md focus:ring-2 focus:ring-blue-500" />
      <button @click="submit" class="mt-14 w-full bg-blue-500 text-white py-2 rounded-md hover:bg-blue-600">提交</button>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
const name = ref('');
const submitted = ref(false);
const submit = () => {
  if (name.value) submitted.value = true;
};
</script>
