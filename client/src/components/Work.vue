<template>
  <n-space vertical size="large">
    <!-- 工资总览卡片 -->
    <n-card>
      <n-statistic label="工资" :value="salary" suffix="元" />
    </n-card>

    <n-card v-if="result">
      <n-grid cols="2" x-gap="16" y-gap="16">
        <n-grid-item>
          <n-card size="small" embedded>
            <n-space vertical size="small">
              <n-text strong>今日收入</n-text>
              <n-text type="success" depth="3" style="font-size: 18px"> {{ liveResult.today }} 元 </n-text>
              <n-text depth="3">上班时间：{{ startTime }} - {{ endTime }}</n-text>
            </n-space>
          </n-card>
        </n-grid-item>

        <n-grid-item>
          <n-card size="small" embedded>
            <n-space vertical size="small">
              <n-text strong>本月收入</n-text>
              <n-text type="warning" depth="3" style="font-size: 18px"> {{ liveResult.month }} 元 </n-text>
              <n-text depth="3"> 本月工作日：{{ result.workDays }} 天，已工作：{{ workedDays }} 天 </n-text>
            </n-space>
          </n-card>
        </n-grid-item>

        <n-grid-item span="2">
          <n-card size="small" embedded>
            <n-space vertical size="small">
              <n-text strong>收入速率</n-text>
              <n-descriptions bordered :column="2" size="small">
                <n-descriptions-item label="每秒收入"> {{ result.perSecond }} 元 </n-descriptions-item>
                <n-descriptions-item label="每分钟收入"> {{ result.perMinute }} 元 </n-descriptions-item>
                <n-descriptions-item label="每小时收入"> {{ result.perHour }} 元 </n-descriptions-item>
                <n-descriptions-item label="每日收入"> {{ result.perDay }} 元 </n-descriptions-item>
              </n-descriptions>
            </n-space>
          </n-card>
        </n-grid-item>
      </n-grid>
    </n-card>
  </n-space>
</template>
<script setup>
// 引入依赖
import { ref, computed, watch } from 'vue';
import moment from 'moment';
import { isWorkingDay } from '@swjs/chinese-holidays';
import { NCard, NText, NSpace, NStatistic, NGrid, NGridItem, NDescriptions, NDescriptionsItem } from 'naive-ui';

// 定义传入的 props，包含工资、上班时间、下班时间等
const props = defineProps({
  data: {
    type: Object,
    default: {},
  },
});

// 从 props 中提取数据，并设置默认值
const salary = computed(() => props.data?.salary ?? 0);
const startTime = computed(() => props.data?.startTime ?? '09:00');
const endTime = computed(() => props.data?.endTime ?? '18:00');

// 存放计算结果
const result = ref(null);

// 存放实时收入
const liveResult = ref({
  today: '0.00',
  month: '0.00',
});

// 存放本月已工作的天数
const workedDays = ref(0);

let intervalId = null;

/**
 * 计算今天已工作的秒数
 */
const computeSecondsToday = () => {
  const now = moment();
  const start = moment(startTime.value, 'HH:mm');
  const end = moment(endTime.value, 'HH:mm');

  if (now.isBefore(start)) return 0;
  if (now.isAfter(end)) return end.diff(start, 'seconds');
  return now.diff(start, 'seconds');
};

/**
 * 计算本月截至目前已工作的总秒数
 */
const computeSecondsThisMonth = async () => {
  const now = moment();
  const start = moment(startTime.value, 'HH:mm');
  const end = moment(endTime.value, 'HH:mm');
  const workSecondsPerDay = end.diff(start, 'seconds');
  const daysInMonth = now.daysInMonth();

  let secondsMonth = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${now.format('YYYY-MM')}-${String(d).padStart(2, '0')}`;
    const dateMoment = moment(dateStr, 'YYYY-MM-DD');
    const isWorkdayFlag = await isWorkingDay(dateStr);
    if (!isWorkdayFlag) continue;

    if (dateMoment.isBefore(now, 'day')) {
      secondsMonth += workSecondsPerDay;
    } else if (dateMoment.isSame(now, 'day')) {
      secondsMonth += computeSecondsToday();
    }
  }

  return secondsMonth;
};

/**
 * 开始每秒刷新收入数据
 */
const startLiveCalculation = (perSecondIncome) => {
  if (intervalId) clearInterval(intervalId);

  intervalId = setInterval(async () => {
    const secondsToday = computeSecondsToday();
    const secondsMonth = await computeSecondsThisMonth();

    liveResult.value.today = (secondsToday * perSecondIncome).toFixed(2);
    liveResult.value.month = (secondsMonth * perSecondIncome).toFixed(2);
  }, 1000);
};

/**
 * 计算本月已工作天数
 */
const calcWorkedDays = async () => {
  const now = moment();
  let count = 0;

  for (let d = 1; d <= now.date(); d++) {
    const dateStr = `${now.format('YYYY-MM')}-${String(d).padStart(2, '0')}`;
    const dateMoment = moment(dateStr, 'YYYY-MM-DD');
    const isWorkdayFlag = await isWorkingDay(dateStr);
    if (!isWorkdayFlag) continue;

    if (dateMoment.isBefore(now, 'day')) {
      count++;
    } else if (dateMoment.isSame(now, 'day')) {
      const start = moment(startTime.value, 'HH:mm');
      if (now.isAfter(start)) {
        count++;
      }
    }
  }
  workedDays.value = count;
};

/**
 * 初始化工资计算
 */
const init = async () => {
  const now = moment();
  const year = now.year();
  const month = String(now.month() + 1).padStart(2, '0');

  const workDays = await getWorkDaysInMonth(year, month);
  const dailySalary = workDays > 0 ? salary.value / workDays : 0;
  const start = moment(startTime.value, 'HH:mm');
  const end = moment(endTime.value, 'HH:mm');
  const hours = moment.duration(end.diff(start)).asHours();

  result.value = {
    workDays,
    perDay: dailySalary.toFixed(2),
    perHour: hours > 0 ? (dailySalary / hours).toFixed(2) : '0.00',
    perMinute: hours > 0 ? (dailySalary / hours / 60).toFixed(2) : '0.00',
    perSecond: hours > 0 ? (dailySalary / hours / 3600).toFixed(3) : '0.000',
  };

  startLiveCalculation(parseFloat(result.value.perSecond));
};

/**
 * 获取本月法定工作日天数
 */
const getWorkDaysInMonth = async (year, month) => {
  const daysInMonth = moment(`${year}-${month}`, 'YYYY-MM').daysInMonth();
  let count = 0;

  for (let d = 1; d <= daysInMonth; d++) {
    const dateStr = `${year}-${month}-${String(d).padStart(2, '0')}`;
    if (await isWorkingDay(dateStr)) count++;
  }
  return count;
};

// 监听 props.data 的变化，重新计算数据
watch(
  () => props.data,
  () => {
    init();
    calcWorkedDays();
  },
  { immediate: true, deep: true }
);
</script>
