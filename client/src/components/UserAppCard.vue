<template>
  <div class="user-card">
    <div class="user-header">
      <img :src="safeAvatarUrl" class="user-avatar" />
      <div class="user-info">
        <NFlex class="user-name-line" vertical>
          <span class="user-name">{{ userInfo.nickname }}</span>
          <span class="user-desc">{{ userInfo.desc }}</span>
        </NFlex>
      </div>
    </div>
    <div class="user-stats">
      <div class="stat">
        <div class="stat-number">{{ userInfo.follows || 0 }}</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat">
        <div class="stat-number">{{ userInfo.fans || 0 }}</div>
        <div class="stat-label">粉丝</div>
      </div>
      <div class="stat">
        <div class="stat-number">{{ userInfo.interaction || 0 }}</div>
        <div class="stat-label">获赞</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { NFlex } from 'naive-ui';

const props = defineProps({
  userInfo: Object,
});

// 替换新浪图床地址，避免头像加载失败
const safeAvatarUrl = computed(() => {
  const raw = props.userInfo?.avatar || '';
  return raw.replace(/^https:\/\/([^\/]*sinaimg\.cn)/, 'https://i0.wp.com/$1');
});
</script>

<style scoped>
.user-card {
  max-width: 460px;
  width: 280px;
  margin: 30px auto;
  padding: 20px;
  border-radius: 12px;
  background: #fff;
  box-shadow: 0 4px 20px rgba(0, 0, 0, 0.05);
  font-family: 'Helvetica Neue', sans-serif;
}
.user-header {
  display: flex;
  align-items: center;
  margin-bottom: 16px;
}
.user-avatar {
  width: 72px;
  height: 72px;
  border-radius: 50%;
  object-fit: cover;
  margin-right: 16px;
  border: 1px solid #eee;
}
.user-info {
  flex: 1;
}
.user-name-line {
  font-size: 18px;
  font-weight: 600;
}
.user-desc {
  font-size: 14px;
  line-height: 16px;
  height: 16px;
  color: #555;
}
.user-stats {
  display: flex;
  justify-content: space-around;
  margin-top: 16px;
  border-top: 1px solid #f0f0f0;
  padding-top: 12px;
}
.stat {
  text-align: center;
}
.stat-number {
  font-size: 16px;
  font-weight: bold;
  color: #222;
}
.stat-label {
  font-size: 12px;
  color: #666;
  margin-top: 2px;
}
</style>
