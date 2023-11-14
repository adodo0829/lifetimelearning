<template>
  <h3>单纹理：点精灵</h3>
  <canvas id="game" width="800" height="600"></canvas>
</template>

<script>
// const imgUrl = new URL("./point64.png", import.meta.url).href;
import imgUrl from "./point64.png";

import { create, ortho } from "@/utils/esm/mat4";
let projMat4 = create(); // 正交投影
let gl = null;
let uniformTexture = 0;
let textureHandle;

const vertexString = `
  attribute vec3 a_position;
  uniform     mat4    proj;
  void main(void){
    // gl_Position = proj *   a_position;
    gl_Position = proj *  vec4(a_position, 1.0);
    gl_PointSize = 64.0;
  }
`;

const fragmentString = `
  precision mediump float;
  uniform sampler2D texture;
  void main(void) {
    vec4 color = texture2D(texture, gl_PointCoord);
    if(color.a < 0.1) {
      discard;
    }
    gl_FragColor = color;         
  }
`;

export default {
  mounted() {
    this.init();
  },
  methods: {
    init() {
      this.initGL();
      this.initShader();
      this.initBuffer();
    },

    initGL() {
      const div = document.getElementById("game");
      gl = div.getContext("webgl");
      gl.viewport(0, 0, div.clientWidth, div.clientHeight);
      ortho(projMat4, 0, div.clientWidth, div.clientHeight, 0, -1, 1);
    },

    initShader() {
      let vsshader = gl.createShader(gl.VERTEX_SHADER);
      let fsshader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vsshader, vertexString);
      gl.shaderSource(fsshader, fragmentString);
      gl.compileShader(vsshader);
      gl.compileShader(fsshader);
      if (!gl.getShaderParameter(vsshader, gl.COMPILE_STATUS)) {
        var err = gl.getShaderInfoLog(vsshader);
        alert(err);
        return;
      }
      if (!gl.getShaderParameter(fsshader, gl.COMPILE_STATUS)) {
        var err = gl.getShaderInfoLog(fsshader);
        alert(err);
        return;
      }

      let program = gl.createProgram();
      gl.attachShader(program, vsshader);
      gl.attachShader(program, fsshader);

      gl.linkProgram(program);
      gl.useProgram(program);
      gl.program = program;
    },

    initBuffer() {
      // js点位置数据转为类型数组
      const jsPointTypeArray = new Float32Array([
        0, 0, 0, 100, 100, 0, 200, 200, 0,
      ]);

      // 从gl program获取顶点着色器变量a_position
      let aPsotion = gl.getAttribLocation(gl.program, "a_position");
      let triangleBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, jsPointTypeArray, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aPsotion); // 开启变量
      gl.vertexAttribPointer(aPsotion, 3, gl.FLOAT, false, 0, 0); // 使用方式

      // 从gl program获取顶点着色器变量proj
      let uniformProj = gl.getUniformLocation(gl.program, "proj");
      gl.uniformMatrix4fv(uniformProj, false, projMat4); // 赋值

      // 从gl program获取片元着色器变量texture
      uniformTexture = gl.getUniformLocation(gl.program, "texture");
      gl.enable(gl.BLEND); // 激活片元的颜色融合计算
      gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA); // 混合颜色的公式

      // this.initTexture("point64.png");
      this.initTexture();
    },

    initTexture() {
      textureHandle = gl.createTexture();
      textureHandle.image = new Image();
      textureHandle.image.src = imgUrl;
      textureHandle.image.onload = () => {
        this.handleLoadedTexture(textureHandle);
      };
    },

    handleLoadedTexture(texture) {
      console.log("texture", texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
      );
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
      //因为异步原因所以要加在这里
      gl.uniform1i(uniformTexture, 0);
      this.draw();
    },

    draw() {
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);
      gl.drawArrays(gl.POINTS, 0, 3);
    },
  },
};
</script>
