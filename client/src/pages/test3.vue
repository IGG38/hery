<template>
  <div class="app">
    <div class="header">
      <div class="assets-title">
        我的资产 <span>{{ assets.length }}</span>
      </div>
      <div class="assets-total">总资产 ¥{{ totalAsset }}</div>
      <div class="assets-daily">总日均 ¥{{ totalDaily }}</div>
    </div>

    <div class="asset-list">
      <div v-for="item in assets" :key="item.name" class="asset-card">
        <div class="asset-name">{{ item.name }}</div>
        <div class="asset-info">
          <div class="asset-value">¥{{ item.value }}</div>
          <div class="asset-daily">¥{{ getUseDaily(item) }}/天</div>
        </div>
        <div class="asset-days">已使用 {{ getUsedDays(item.purchaseDate) }} 天</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import moment from 'moment';
import Property from '@/assets/data/property.json';

const assets = ref(Property.properties || []);
const totalAsset = ref('0.00');
const totalDaily = ref('0.00');

// 根据数据计算总资产和总日均
function calcTotal() {
  let sum = 0;
  let dailySum = 0;
  assets.value.forEach((item) => {
    sum += parseFloat(item.value) || 0;
    const daily = parseFloat(getUseDaily(item)) || 0;
    dailySum += daily;
  });
  totalAsset.value = sum.toFixed(2);
  totalDaily.value = dailySum.toFixed(2);
}
calcTotal();

function getUsedDays(purchaseDate) {
  if (!purchaseDate) return 0;
  const start = moment(purchaseDate, 'YYYY-MM-DD');
  const now = moment();
  return now.diff(start, 'days');
}

function getUseDaily(item) {
  const usedDays = getUsedDays(item.purchaseDate);
  if (usedDays === 0) return '0.00';
  const daily = parseFloat(item.value) / usedDays;
  return daily.toFixed(2);
}
</script>

<style scoped>
.app {
  width: 500px;
  background: #000;
  color: #fff;
  min-height: 100vh;
  padding: 20px;
}

.header {
  background: #2877ff;
  padding: 16px;
  border-radius: 10px;
  margin-bottom: 20px;
}

.assets-title {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.assets-title span {
  font-size: 14px;
}

.assets-total,
.assets-daily {
  font-size: 16px;
}

.asset-list {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.asset-card {
  background: #00b893;
  padding: 16px;
  border-radius: 10px;
}

.asset-name {
  font-size: 18px;
  font-weight: bold;
  margin-bottom: 10px;
}

.asset-info {
  font-size: 16px;
  margin-bottom: 8px;
}

.asset-days {
  font-size: 14px;
  color: #d0f5ea;
}
</style>
