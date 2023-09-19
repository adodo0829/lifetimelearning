<template>
  <div>
    <h2>基本属性</h2>
    <div>
      <p>宽高： 默认300*150， 画布绘制区需要设置宽高，与元素本身css宽高分离</p>
      <p>绘图环境：getContext()</p>
      <p>数据地址：toDataURL（)</p>
      <p>blob对象：toBlob（）</p>
    </div>
    <h2>绘图环境属性和方法</h2>
    <a
      href="https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/canvas"
    >
      https://developer.mozilla.org/zh-CN/docs/Web/API/CanvasRenderingContext2D/canvas
    </a>
    <canvas id="cvs" width="800" height="600"></canvas>
  </div>
</template>
<script setup>
import { onMounted } from "vue";

onMounted(() => {
  const canvas = document.getElementById("cvs");
  console.log(canvas);
  var ctx = canvas.getContext("2d");
  //  文字方向
  ctx.font = "bold 40px serif";
  ctx.fillText("Hi1", 200, 50);
  ctx.direction = "rtl";
  ctx.fillText("Hi2", 200, 100);

  //  填充背景
  ctx.fillStyle = "blue";
  ctx.fillRect(10, 10, 100, 100);
});
</script>

<style lang="less" scoped>
#cvs {
  background-color: #ccc;
}
</style>
