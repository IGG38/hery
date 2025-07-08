<template>
  <div class="user-card">
    <div class="user-header">
      <img :src="safeAvatarUrl" class="user-avatar" />
      <div class="user-info">
        <div class="user-name-line">
          <span class="user-name">{{ userInfo.nickname }}</span>
        </div>
      </div>
    </div>
    <div class="user-stats">
      <div class="stat">
        <div class="stat-number">{{ parsedFriendsCount }}</div>
        <div class="stat-label">关注</div>
      </div>
      <div class="stat">
        <div class="stat-number">{{ parsedFollowersCount }}</div>
        <div class="stat-label">粉丝</div>
      </div>
      <div class="stat">
        <div class="stat-number">{{ parsedLikesCount }}</div>
        <div class="stat-label">点赞</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';

const props = defineProps({
  userInfo: Object,
});

// 替换新浪图床地址，避免头像加载失败
const safeAvatarUrl = computed(() => {
  const raw = props.userInfo?.avatar || '';
  return raw.replace(/^https:\/\/([^\/]*sinaimg\.cn)/, 'https://i0.wp.com/$1');
});

const parseCount = (str) => {
  if (typeof str === 'number') return str;
  if (!str) return 0;
  return parseFloat(str.replace(/[^\d]/g, '')) || 0;
};

const parsedFollowersCount = computed(() => parseCount(props.userInfo?.followers_count));
const parsedLikesCount = computed(() => parseCount(props.userInfo?.likes_count));
const parsedFriendsCount = computed(() => parseCount(props.userInfo?.friends_count));
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
.user-description {
  font-size: 14px;
  color: #555;
  margin-top: 4px;
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
