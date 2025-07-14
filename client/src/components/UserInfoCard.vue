<template>
  <NFlex class="user-card" vertical>
    <span class="user-extra">姓名：{{ userInfo.name }}</span>
    <span class="user-extra">性别：{{ userInfo.gender }}</span>
    <span class="user-extra">年龄：{{ userInfo.age }}</span>
    <span class="user-extra">出生日期：{{ userInfo.birth }}</span>
    <span class="user-extra">手机号：{{ userInfo.phone || '未填写' }}</span>
    <span class="user-extra">邮箱：{{ userInfo.email || '未填写' }}</span>
    <span class="user-extra">地区：{{ userInfo.ip }}</span>
  </NFlex>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { NFlex } from 'naive-ui';

const props = defineProps({
  userInfo: Object,
});
</script>

<style scoped>
.user-card {
  max-width: 460px;
  width: 280px;
  margin: 24px auto;
  padding: 18px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 16px rgba(0, 0, 0, 0.04);
  font-family: 'Helvetica Neue', sans-serif;
}

.user-extra {
  font-size: 13px;
  color: #999;
  margin-top: 4px;
}
</style>
