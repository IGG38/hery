<template>
  <div class="page">
    <canvas id="canvas" ref="canvasRef"></canvas>
  </div>
</template>
<script setup>
import { onMounted, onBeforeUnmount, ref } from 'vue';
import LiquidBackground from '@/lib/liquid.js';

import WYY from '@/assets/images/wyy.jpeg';
import Test from '@/assets/images/test.png';

const canvasRef = ref(null);
let appInstance = null;

onMounted(() => {
  if (!canvasRef.value) return;
  appInstance = LiquidBackground(canvasRef.value);
  if (!appInstance) return;
  // 加载用于液体背景渲染的纹理图片
  appInstance.loadImage(Test);
  // 设置液体平面的金属度（金属感越高越像金属反光）
  appInstance.liquidPlane.material.metalness = 0.75;
  // 设置液体平面的粗糙度（值越小表面越光滑、反射越明显）
  appInstance.liquidPlane.material.roughness = 0.25;
  // 控制液体表面的位移强度（数值越大波动越明显）
  appInstance.liquidPlane.uniforms.displacementScale.value = 5;
  // 关闭雨滴效果（如果想要雨滴，改为 true）
  appInstance.setRain(false);
});

onBeforeUnmount(() => {
  if (appInstance && typeof appInstance.destroy === 'function') {
    appInstance.destroy();
  }
});
</script>

<style>
.page {
  width: 100vw;
  height: 100vh;
  overflow: hidden;
}

#canvas {
  position: fixed;
  top: 0;
  right: 0;
  bottom: 0;
  left: 0;
  overflow: hidden;
}
</style>
