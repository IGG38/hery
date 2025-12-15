import { defineStore } from 'pinia';
import http from '@/utils/http';

function mapWeatherType(desc) {
  if (!desc) return 'sunny';

  if (desc.includes('雪')) return 'snow';
  if (desc.includes('雨')) return 'rain';
  if (desc.includes('阴')) return 'overcast';
  if (desc.includes('云')) return 'cloudy';

  return 'sunny';
}

export const useWeatherStore = defineStore('weather', {
  state: () => ({
    city: '',
    temp: null,
    type: 'sunny', // 'sunny' | 'rain' | 'snow' | 'cloudy' | 'overcast'
    desc: '',
    humidity: null,
    windDirection: '',
    windPower: '',
    reportTime: '',
    loading: false,
    error: null,
  }),

  getters: {
    weatherBgClass: (state) => `weather-bg--${state.type}`,
    weatherIconName: (state) => {
      switch (state.type) {
        case 'sunny':
          return 'sun';
        case 'rain':
          return 'rain';
        case 'snow':
          return 'snow';
        case 'cloudy':
          return 'cloudy';
        case 'overcast':
          return 'overcast';
        default:
          return 'default';
      }
    },
  },

  actions: {
    async init() {
      this.loading = true;
      this.error = null;

      try {
        const resp = await http.get({
          url: 'https://restapi.amap.com/v3/weather/weatherInfo',
          data: {
            key: '00afb67c089dcb25d4f3424692cb3447',
            city: '320921',
            extensions: 'base',
            output: 'JSON',
          },
        });

        const data = resp;
        const live = data?.lives?.[0];
        if (!live) {
          throw new Error('weather empty');
        }

        this.city = live.city;
        this.temp = Number(live.temperature);
        this.type = mapWeatherType(live.weather);
        this.desc = live.weather;
        this.humidity = Number(live.humidity);
        this.windDirection = live.winddirection;
        this.windPower = live.windpower;
        this.reportTime = live.reporttime;
      } catch (e) {
        console.error('weather init error', e);
        this.error = e;
      } finally {
        this.loading = false;
      }
    },
  },
});
