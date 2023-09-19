<template>
  <div class="main-01">
    <h3>什么是Canvas？</h3>
    <p>Canvas 中文名叫 “画布”，是 HTML5 新增的一个标签。</p>
    <p>Canvas 允许开发者通过 JS在这个标签上绘制各种图案。</p>
    <p>Canvas 拥有多种绘制路径、矩形、圆形、字符以及图片的方法。</p>
    <p>Canvas 在某些情况下可以 “代替” 图片。</p>
    <p>Canvas 可用于动画、游戏、数据可视化、图片编辑器、实时视频处理等领域。</p>

    <h3>Canvas vs SVG</h3>
    <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="c" label="Canvas" />
      <el-table-column prop="s" label="SVG" />
    </el-table>

    <p>G6: https://antv-g6.gitee.io/zh, 基于canvas</p>
    <p>X6: https://antv-x6.gitee.io/zh,基于svg</p>

    <div>
      <p>
        如果要展示的数据量比较大，比如一条数据就是一个元素节点，那使用 canvas
        会比较合适；
      </p>
      <p>
        如果用户操作的交互比较多，而且对清晰度有要求（矢量图），那么使用 svg
        会比较合适。
      </p>
    </div>
  </div>
</template>

<script setup>
const tableData = [
  {
    c: "用JS动态生成元素",
    s: "用XML描述元素（类似HTML元素那样，可用多个元素来描述一个图形）",
  },
  {
    c: "位图（受屏幕分辨率影响）",
    s: "矢量图（不受屏幕分辨率影响）",
  },
  {
    c: "不支持事件",
    s: "支持事件",
  },
  {
    c: "数据发生变化需要重绘",
    s: "不需要重绘",
  },
];
</script>
