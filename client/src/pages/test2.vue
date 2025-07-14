<template>
  <NFlex style="width: 380px" :size="[0, 0]">
    <UserInfoCard v-if="userInfo" :userInfo="userInfo" />

    <template v-for="item in userList">
      <template v-for="(items, index) in item">
        <template v-if="index === 0">
          <UserAppCard :userInfo="items" />
        </template>
      </template>
    </template>
  </NFlex>
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { Http } from '@/tools/http';
import { NFlex } from 'naive-ui';
import { useRoute, useRouter } from 'vue-router';

import UserInfoCard from '@/components/UserInfoCard.vue';
import UserAppCard from '@/components/UserAppCard.vue';

import { LR } from '@/assets/data/LR.json';

import douyin from '@/assets/data/creator/douyin_creator_creator_2025-07-14.json';
import weibo from '@/assets/data/creator/weibo_creator_creators_2025-07-14.json';
import xhs from '@/assets/data/creator/xhs_creator_creator_2025-07-15.json';

const userInfo = ref({});
const userList = ref([]);

const lrIndex = 0;

const parseIDCard = (user) => {
  const id = user.id;
  const birth = user.birth;
  const ip = douyin[lrIndex].ip_location.replace('IP属地：', '');
  if (!/^\d{17}[\dXx]$/.test(id)) return null;

  const gender = parseInt(id[16]) % 2 === 1 ? '男' : '女';

  const [year, month, day] = birth.split('-').map(Number);
  const today = new Date();
  const birthDate = new Date(year, month - 1, day);

  let age = today.getFullYear() - year;
  const hasBirthdayPassed = today.getMonth() > birthDate.getMonth() || (today.getMonth() === birthDate.getMonth() && today.getDate() >= birthDate.getDate());
  if (!hasBirthdayPassed) age--;

  return { gender, age, ip };
};
console.log();

userList.value = [douyin, weibo, xhs];
userInfo.value = Object.assign(LR[0], parseIDCard(LR[0]));
</script>

<style scoped></style>
