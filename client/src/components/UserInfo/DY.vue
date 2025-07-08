<template>
  <UserCard v-if="userInfo" :userInfo="userInfo" />
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { Http } from '@/tools/http';
import UserCard from '@/components/UserCard.vue';

const props = defineProps({
  uid: { type: String, default: '' },
});

const http = Http.getInstance();
const userInfo = ref(null);

onMounted(async () => {
  const resp = await http.get({
    url: 'http://localhost:3002/api/dy-info',
    params: { uid: props.uid },
  });
  userInfo.value = resp.data;
});
</script>
