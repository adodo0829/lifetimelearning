<template>
  <p>多重纹理</p>
  <canvas id="canvas" width="800" height="600"></canvas>
</template>

<script>
import { create, ortho } from "@/utils/esm/mat4";
import fogUrl from "./fog.png";
import shangshuiUrl from "./shangshui.png";

let projMat4 = create();
let gl;
let uniformTexture = 0;
let uniformTexture1 = 0;
let uniformAnim = 0;
let count = 0;
let texture0;
let texture1;

export default {
  name: "xxx",
  components: {},
  data() {
    return {};
  },
  mounted() {
    this.startLoop();
  },
  methods: {
    startLoop() {
      this.init();
      this.tick();
    },

    init() {
      this.initWebgl();
      this.initShader();
      this.initBuffer();
    },

    initWebgl() {
      const div = document.getElementById("canvas");
      gl = div.getContext("webgl");
      gl.viewport(0, 0, div.clientWidth, div.clientHeight);
      ortho(projMat4, 0, div.clientWidth, div.clientHeight, 0, -1, 1);
    },

    initShader() {
      let vertexString = `
        attribute vec4 a_position;
        uniform   mat4    proj;
        attribute vec2 outUV;
        varying vec2 inUV;
        void main(void){
            gl_Position = a_position;
            inUV = outUV;
        }
      `;

      let fragmentString = `
        precision mediump float;
        uniform sampler2D texture;
        uniform sampler2D texture1;
        uniform float anim;
        varying vec2 inUV;

        void main(void){
          vec4 color1 =texture2D(texture,inUV);
          vec4 color2 =texture2D(texture1, vec2(inUV.x + anim, inUV.y));

          gl_FragColor = color1;
        }
      `;

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
      // 顶点数组
      let jsArr = [
        -0.5, -0.5, 0, 1, 0, 0, -0.5, 0.5, 0, 1, 0, 1, 0.5, 0.5, 0, 1, 1, 1,
        0.5, -0.5, 0, 1, 1, 0,
      ];
      // 索引数组
      let indexArr = [0, 1, 2, 2, 0, 3];

      //   顶点变量赋值启用
      let pointPosition = new Float32Array(jsArr);
      let aPsotion = gl.getAttribLocation(gl.program, "a_position");
      let triangleBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, triangleBuffer);
      gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
      gl.enableVertexAttribArray(aPsotion);
      gl.vertexAttribPointer(aPsotion, 4, gl.FLOAT, false, 6 * 4, 0);

      //   uniform变量传值
      let uniformProj = gl.getUniformLocation(gl.program, "proj");
      gl.uniformMatrix4fv(uniformProj, false, projMat4);

      //   attribOutUV传值
      let attribOutUV = gl.getAttribLocation(gl.program, "outUV");
      gl.enableVertexAttribArray(attribOutUV);
      gl.vertexAttribPointer(attribOutUV, 2, gl.FLOAT, false, 6 * 4, 4 * 4);

      //   创建索引缓冲区
      let indexTypeArr = new Uint8Array(indexArr);
      let indexBuffer = gl.createBuffer();
      gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
      gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexTypeArr, gl.STATIC_DRAW);

      //   纹理区0
      uniformTexture = gl.getUniformLocation(gl.program, "texture");
      //   纹理区1
      uniformTexture1 = gl.getUniformLocation(gl.program, "texture1");

      texture0 = this.initTexture(fogUrl);
      texture1 = this.initTexture(shangshuiUrl);
    },

    initTexture(imgUrl) {
      let textureHandle = gl.createTexture();
      textureHandle.image = new Image();
      textureHandle.image.src = imgUrl;
      textureHandle.image.onload = () => {
        this.handleLoadedTexture(textureHandle);
      };
    },

    handleLoadedTexture(texture) {
      console.log("texture", texture);
      gl.bindTexture(gl.TEXTURE_2D, texture);
      //   gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, 666);

      gl.texImage2D(
        gl.TEXTURE_2D,
        0,
        gl.RGBA,
        gl.RGBA,
        gl.UNSIGNED_BYTE,
        texture.image
      );
      //   LINEAR
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT); // CLAMP_TO_EDGE
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
    },

    tick() {
      this.draw();
      //   window.requestAnimationFrame(() => {
      //     this.tick();
      //   });
    },

    draw() {
      gl.clearColor(0.0, 1.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
      gl.enable(gl.DEPTH_TEST);

      // 纹理变动
      uniformAnim = gl.getUniformLocation(gl.program, "anim");

      count = count + 0.01;
      gl.uniform1f(uniformAnim, count);
      //   激活纹理0
      gl.activeTexture(gl.TEXTURE0);
      gl.bindTexture(gl.TEXTURE_2D, texture0);
      gl.uniform1i(uniformTexture, 0);

      //   激活纹理1
      gl.activeTexture(gl.TEXTURE1);
      gl.bindTexture(gl.TEXTURE_2D, texture1);
      gl.uniform1i(uniformTexture1, 1);

      gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_BYTE, 0);
    },
  },
};
</script>
