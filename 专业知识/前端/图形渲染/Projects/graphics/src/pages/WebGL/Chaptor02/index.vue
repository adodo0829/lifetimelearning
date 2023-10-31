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
          attribute vec3 a_color;
          varying vec3 inColor;
          void main(void) {
              // 乘以投影坐标系
              gl_Position = proj * a_position;
              gl_PointSize = 20.0;
              inColor = a_color;
          }
          `;

      let fragmentString = `
          precision mediump float;
          varying vec3 inColor;
          void main(void) {
            gl_FragColor = vec4(inColor, 1.0);
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
      let colors = [];
      let aPsotion = gl.getAttribLocation(gl.program, "a_position");
      let aColor = gl.getAttribLocation(gl.program, "a_color");

      // 获取鼠标位置
      document.getElementById("node").addEventListener("click", (e) => {
        const mx = e.clientX;
        const my = e.clientY;
        // console.log("mosue xy:", mx, my);
        // 使用了投影坐标系后，就可画布坐标系一致了，不需要在做装换了
        // 如果不乘矩阵, 就需要转换到-1和1之间
        // let px = ((x - rect.left) - reac.width/2) / reac.width/2;
        // let py = (rect.height/2 - (y - rect.top)) / rect.height/2;
        let rect = e.target.getBoundingClientRect();
        const px = mx - rect.left;
        const py = my - rect.top;
        console.log("pxy:", px, py, 0);
        points.push(px, py, 0);

        if (px > 150 && py > 150) {
          colors.push(1.0);
          colors.push(0.0);
          colors.push(0.0);
        } else if (px < 150 && py > 150) {
          colors.push(0.0);
          colors.push(1.0);
          colors.push(0.0);
        } else if (px < 150 && py < 150) {
          colors.push(0.0);
          colors.push(0.0);
          colors.push(1.0);
        } else {
          colors.push(0.0);
          colors.push(1.0);
          colors.push(1.0);
        }

        let pointPosition = new Float32Array(points);
        let pointColor = new Float32Array(colors);

        // 传递多个数据
        // 可创建并初始化一个用于储存顶点数据或着色数据的WebGLBuffer对象
        let pointBuffer = gl.createBuffer();
        let colorBuffer = gl.createBuffer();
        // 方法将给定的 WebGLBuffer 绑定到目标
        gl.bindBuffer(gl.ARRAY_BUFFER, pointBuffer);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        // 创建并初始化了 Buffer 对象的数据存储区。
        gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
        gl.bufferData(gl.ARRAY_BUFFER, pointColor, gl.STATIC_DRAW);
        // 可以打开属性数组列表中指定索引处的通用顶点属性数组。
        // 无论怎样，都需要你使用 enableVertexAttribArray() 方法，来激活每一个属性以便使用，不被激活的属性是不会被使用的。
        // 一旦激活，以下其他方法就可以获取到属性的值了，包括vertexAttribPointer()、vertexAttrib*() 和 getVertexAttrib() (en-US)。
        gl.enableVertexAttribArray(aPsotion);
        gl.enableVertexAttribArray(aColor);
        // 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
        gl.vertexAttribPointer(aPsotion, 3, gl.FLOAT, false, 0, 0);
        gl.vertexAttribPointer(aColor, 3, gl.FLOAT, false, 0, 0);

        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        gl.drawArrays(gl.POINTS, 0, points.length / 3);
      });

      let uniformProj = gl.getUniformLocation(gl.program, "proj");
      // 为 uniform 变量指定了矩阵值
      gl.uniformMatrix4fv(uniformProj, false, projMat4);
    },

    drawNode() {
      gl.clearColor(0.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      // 绘制图元的方式, 开始点，点个数
      // gl.drawArrays(gl.POINTS, 0, 1);
    },
  },
};
</script>
