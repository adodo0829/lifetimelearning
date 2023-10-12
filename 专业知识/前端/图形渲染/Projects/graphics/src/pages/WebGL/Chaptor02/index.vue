<template>
  <h3>draw dynamic node</h3>
  <canvas id="node" width="300" height="300"></canvas>
</template>

<script>
import { create, ortho } from "@/utils/esm/mat4";

let gl = null;
let projMat4 = create();

export default {
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initWebgl();
      this.initShader();
      this.initBuffer();
      this.drawNode();
    },
    initWebgl() {
      const webglDom = document.getElementById("node");
      gl = webglDom.getContext("webgl2");
      // webgl可视区,  视口原点左下角的坐标为原点
      gl.viewport(0, 0, webglDom.clientWidth, webglDom.clientHeight);
      // 坐标系转换 https://blog.csdn.net/u011332271/article/details/110477155
      // 设置webgl投影坐标系
      // https://registry.khronos.org/OpenGL-Refpages/gl2.1/xhtml/glOrtho.xml
      // 把屏幕坐标区间 转换为 webgl的坐标区间
      ortho(projMat4, 0, webglDom.clientWidth, webglDom.clientHeight, 0, -1, 1);
    },
    initShader() {
      let vertexString = `
          attribute vec4 a_position;
          uniform     mat4    proj;
          void main(void) {
              gl_Position = proj *  a_position;
              gl_PointSize = 20.0;
          }
          `;

      let fragmentString = `
          void main(void) {
            gl_FragColor = vec4(1.0,0,0,1.0);
          }
          `;

      // 创建&装载着色器
      let vshader = gl.createShader(gl.VERTEX_SHADER);
      let fshader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vshader, vertexString);
      gl.shaderSource(fshader, fragmentString);
      gl.compileShader(vshader);
      gl.compileShader(fshader);

      if (!gl.getShaderParameter(vshader, gl.COMPILE_STATUS)) {
        let err = gl.getShaderInfoLog(vshader);
        alert(err);
        return;
      }
      if (!gl.getShaderParameter(fshader, gl.COMPILE_STATUS)) {
        let err = webgl.getShaderInfoLog(fshader);
        alert(err);
        return;
      }

      // 装载着色器程序
      let program = gl.createProgram();
      gl.attachShader(program, vshader);
      gl.attachShader(program, fshader);

      gl.linkProgram(program);
      gl.useProgram(program);

      gl.program = program;
    },

    initBuffer() {
      let points = [];

      // 获取鼠标位置
      document.getElementById("node").addEventListener("click", (e) => {
        console.log("eeee", e);
      });

      // 准备数据， 值在-1和1之间
      let pointPosition = new Float32Array([150, 150, 0, 1.0]);
      // 获取gpu着色器代码的变量地址
      let aPsotion = gl.getAttribLocation(gl.program, "a_position");
      // 为顶点 attibute 变量赋值
      gl.vertexAttrib4fv(aPsotion, pointPosition);
      // 同上
      let uniformProj = gl.getUniformLocation(gl.program, "proj");
      gl.uniformMatrix4fv(uniformProj, false, projMat4);
    },

    drawNode() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // 绘制图元的方式, 开始点，点个数
      gl.drawArrays(gl.POINTS, 0, 1);
    },
  },
};
</script>
