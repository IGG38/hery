import { createRouter, createWebHistory, createWebHashHistory } from 'vue-router';

const routes = [
  {
    path: '/',
    redirect: '/welcome',
    component: () => import('@/views/Welcome.vue'),
  },

  {
    path: '/welcome',
    name: 'Weclome',
    component: () => import('@/views/Welcome.vue'),
    meta: {
      title: '',
    },
  },
  {
    path: '/home',
    name: 'Home',
    component: () => import('@/views/Home.vue'),
    meta: {
      title: '首页',
    },
  },
  // {
  //   path: '/weather',
  //   name: 'WeatherDetail',
  //   component: () => import('@/views/WeatherDetail.vue'),
  //   meta: {
  //     title: '天气详情',
  //   },
  // },
  // {
  //   path: '/tickets',
  //   name: 'Tickets',
  //   component: () => import('@/views/Tickets.vue'),
  //   meta: {
  //     title: '车票管理',
  //   },
  // },
  // {
  //   path: '/social',
  //   name: 'SocialMonitor',
  //   component: () => import('@/views/SocialMonitor.vue'),
  //   meta: {
  //     title: '社交监控',
  //   },
  // },
  // {
  //   path: '/settings',
  //   name: 'Settings',
  //   component: () => import('@/views/SettingsView.vue'),
  //   meta: {
  //     title: '设置',
  //   },
  // },
];

const router = createRouter({
  history: createWebHashHistory(),
  routes,
});

router.afterEach((to) => {
  if (to.meta?.title) {
    document.title = to.meta.title;
  }
});

export default router;
