<template>
  <Work :data="workJSON.data" />
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import Work from '@/components/Work.vue';
import workJSON from '@/assets/data/work.json';

const init = async () => {
  // any future init logic
};

onMounted(() => {
  init();
});
</script>
