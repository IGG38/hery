<template>
  <div class="weather-widget" @click="goDetail">
    <!-- 加载中 -->
    <div v-if="loading" class="weather-widget__loading">
      <span class="weather-widget__spinner"></span>
      <span>天气加载中...</span>
    </div>

    <!-- 加载失败 -->
    <div v-else-if="error" class="weather-widget__error">
      <span>天气获取失败</span>
      <small>点击重试</small>
    </div>

    <!-- 正常显示 -->
    <div v-else class="weather-widget__content">
      <div class="weather-widget__main">
        <div class="weather-widget__left">
          <div class="weather-widget__city">
            {{ city || '未知城市' }}
          </div>
          <div class="weather-widget__desc">
            {{ desc || '——' }}
          </div>
        </div>

        <div class="weather-widget__right">
          <div class="weather-widget__temp">
            <span v-if="temp !== null">{{ temp }}</span>
            <span v-else>--</span>
            <span class="weather-widget__temp-unit">°C</span>
          </div>
          <div class="weather-widget__icon">
            {{ icon }}
          </div>
        </div>
      </div>

      <div class="weather-widget__extra">
        <span v-if="humidity !== null">湿度 {{ humidity }}%</span>
        <span v-if="windDirection">风向 {{ windDirection }}</span>
        <span v-if="windPower">风力 {{ windPower }}级</span>
        <span v-if="reportTime" class="weather-widget__time">
          {{ shortTime }}
        </span>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { useWeatherStore } from '@/stores/weather';

const router = useRouter();
const weather = useWeatherStore();

// 页面挂载时，如果还没拉过数据，就拉一次
onMounted(() => {
  if (!weather.city && !weather.loading && !weather.error) {
    weather.init();
  }
});

const loading = computed(() => weather.loading);
const error = computed(() => !!weather.error);

const city = computed(() => weather.city);
const temp = computed(() => weather.temp);
const desc = computed(() => weather.desc);
const humidity = computed(() => weather.humidity);
const windDirection = computed(() => weather.windDirection);
const windPower = computed(() => weather.windPower);
const reportTime = computed(() => weather.reportTime);

// 图标根据 type 简单映射
const icon = computed(() => {
  switch (weather.type) {
    case 'sunny':
      return '☀️';
    case 'rain':
      return '🌧';
    case 'snow':
      return '❄️';
    case 'cloudy':
      return '⛅️';
    case 'overcast':
      return '☁️';
    default:
      return '🌈';
  }
});

// 简短显示时间（只取 时:分）
const shortTime = computed(() => {
  if (!reportTime.value) return '';
  // 例如：2025-12-10 11:34:53 -> 11:34
  const parts = reportTime.value.split(' ');
  if (parts.length < 2) return reportTime.value;
  const timePart = parts[1];
  const hm = timePart.split(':').slice(0, 2).join(':');
  return hm;
});

const goDetail = () => {
  if (error.value) {
    // 如果是错误状态，点击当成重试
    weather.init();
  } else {
    // 正常情况下跳天气详情页（你路由里要有 /weather）
    router.push('/weather');
  }
};
</script>

<style scoped>
.weather-widget {
  width: 260px;
  padding: 14px 16px;
  border-radius: 16px;
  background: radial-gradient(circle at top left, rgba(255, 255, 255, 0.18), rgba(0, 0, 0, 0.35));
  color: #fff;
  backdrop-filter: blur(10px);
  box-shadow: 0 12px 30px rgba(0, 0, 0, 0.35);
  cursor: pointer;
  transition: transform 0.18s ease, box-shadow 0.18s ease, background 0.18s ease;
  display: flex;
  flex-direction: column;
  gap: 8px;
  box-sizing: border-box;
}

.weather-widget:hover {
  transform: translateY(-2px);
  box-shadow: 0 18px 40px rgba(0, 0, 0, 0.45);
}

.weather-widget__loading,
.weather-widget__error {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  gap: 4px;
  font-size: 13px;
  opacity: 0.9;
}

.weather-widget__error small {
  font-size: 11px;
  opacity: 0.7;
}

.weather-widget__spinner {
  width: 16px;
  height: 16px;
  border-radius: 999px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: #fff;
  animation: spin 0.7s linear infinite;
}

@keyframes spin {
  to {
    transform: rotate(360deg);
  }
}

.weather-widget__content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.weather-widget__main {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.weather-widget__left {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.weather-widget__city {
  font-size: 14px;
  font-weight: 600;
  letter-spacing: 0.03em;
}

.weather-widget__desc {
  font-size: 12px;
  opacity: 0.9;
}

.weather-widget__right {
  display: flex;
  align-items: center;
  gap: 8px;
}

.weather-widget__temp {
  display: flex;
  align-items: flex-start;
  line-height: 1;
}

.weather-widget__temp > span:first-child {
  font-size: 24px;
  font-weight: 700;
}

.weather-widget__temp-unit {
  font-size: 12px;
  margin-left: 2px;
  margin-top: 2px;
  opacity: 0.9;
}

.weather-widget__icon {
  font-size: 20px;
}

.weather-widget__extra {
  display: flex;
  flex-wrap: wrap;
  gap: 6px 10px;
  font-size: 11px;
  opacity: 0.9;
}

.weather-widget__time {
  margin-left: auto;
}
</style>
