<template>
  寄
  <!-- <DY :uid="DYUid" />
  <WB :uid="WBUid" />
  <XHS :uid="XHSUid" /> -->
</template>
<script setup>
import { ref, onMounted } from 'vue';
import { Http } from '@/tools/http';
import { useRoute, useRouter } from 'vue-router';
import { Info } from '@/assets/data/LR.json';

// Left
import DY from '@/components/UserInfo/DY.vue';
import WB from '@/components/UserInfo/WB.vue';
import XHS from '@/components/UserInfo/XHS.vue';

const WBInfo = Info.find((item) => item.app === 'WB');
const DYInfo = Info.find((item) => item.app === 'DY');
const XHSInfo = Info.find((item) => item.app === 'XHS');

const WBUid = ref(WBInfo?.uid || '');
const DYUid = ref(DYInfo?.uid || '');
const XHSUid = ref(XHSInfo?.uid || '');
</script>

<style scoped></style>
