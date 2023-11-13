<template>
  <h3>单纹理：点精灵</h3>
  <canvas id="game" width="800" height="600"></canvas>
</template>

<script>
import { create, ortho } from "@/utils/esm/mat4";
let projMat4 = create();
let gl = null;

export default {
  mounted() {},
  methods: {},
};
</script>
