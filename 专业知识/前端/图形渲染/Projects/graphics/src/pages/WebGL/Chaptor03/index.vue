<template>
  <h3>draw node</h3>
  <canvas id="node" width="300" height="300"></canvas>
  <p>
    requestAnimationFrame特点：
    【1】requestAnimationFrame会把每一帧中的所有DOM操作集中起来，在一次重绘或回流中就完成，并且重绘或回流的时间间隔紧紧跟随浏览器的刷新频率
    【2】在隐藏或不可见的元素中，requestAnimationFrame将不会进行重绘或回流，这当然就意味着更少的CPU、GPU和内存使用量
    【3】requestAnimationFrame是由浏览器专门为动画提供的API，在运行时浏览器会自动优化方法的调用，并且如果页面不是激活状态下的话，动画会自动暂停，有效节省了CPU开销
  </p>
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
        attribute vec3 a_position;
        uniform     mat4    proj;
        void main(void) {
            gl_Position = proj *  vec4(a_position,1.0);
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
      // 准备数据， 值在-1和1之间
      let lineArray = [50, 50, 0, 150, 100, 0, 200, 200, 0, 250, 130, 0];

      let pointPosition = new Float32Array(lineArray);

      const lineArrayBuffer = gl.createBuffer();
      // 方法将给定的 WebGLBuffer 绑定到目标
      gl.bindBuffer(gl.ARRAY_BUFFER, lineArrayBuffer);
      // 创建数据储存区
      gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
      // 激活属性
      let aPsotion = gl.getAttribLocation(gl.program, "a_position");
      gl.enableVertexAttribArray(aPsotion);
      // 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
      gl.vertexAttribPointer(pointPosition, 3, gl.FLOAT, false, 0, 0);

      const uniformProj = gl.getUniformLocation(gl.program, "proj");
      gl.uniformMatrix4fv(uniformProj, false, projMat4);
    },

    drawNode() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // 绘制图元的方式, 开始点，个数
      // gl.LINES: 绘制一系列单独线段。每两个点作为端点，线段之间不连接
      // gl.LINE_STRIP: 绘制一个线条。即，绘制一系列线段，上一点连接下一点
      // gl.LINE_LOOP: 绘制一个线圈
      gl.drawArrays(gl.LINE_LOOP, 0, 4);
    },
  },
};
</script>
