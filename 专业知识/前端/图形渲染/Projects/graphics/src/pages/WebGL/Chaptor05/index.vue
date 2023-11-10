<template>
  <h3>game</h3>
  <canvas id="game" width="500" height="500"></canvas>
</template>

<script>
let gl = null;
let anglex = 0;
let angley = 0;

let vsString = `
    attribute vec3 a_position;
    uniform float anglex;
    uniform float angley;
    void main() {
        // 平移
        gl_Position = vec4(a_position.x + anglex, a_position.y+angley, 0, 1.0);
        // 旋转
        // gl_Position =vec4(a_position.x*cos(angle)-a_position.y*sin(angle),a_position.x*sin(angle)+a_position.y*cos(angle),0,1.0);
        // 缩放 乘以一个系数
        //  gl_Position = vec4(a_position.x*scale, a_position.y*scale, 0, 1.0);
    }
`;

let fsString = `
    precision mediump float;
    void main(){
        gl_FragColor =  vec4(0.0,0.0,1.0,1.0);
    }
`;

export default {
  mounted() {
    this.loopGame();
  },

  methods: {
    init() {
      this.initGL();
      this.initShader();
      this.initBuffer();
      this.initEvent();
      this.draw();
    },

    initGL() {
      let glDom = document.getElementById("game");
      gl = glDom.getContext("webgl");
      gl.viewport(0, 0, glDom.clientWidth, glDom.clientHeight);
    },

    initShader() {
      let vsShader = gl.createShader(gl.VERTEX_SHADER);
      let fsShader = gl.createShader(gl.FRAGMENT_SHADER);
      gl.shaderSource(vsShader, vsString);
      gl.shaderSource(fsShader, fsString);
      gl.compileShader(vsShader);
      gl.compileShader(fsShader);
      if (!gl.getShaderParameter(vsShader, gl.COMPILE_STATUS)) {
        let err = gl.getShaderInfoLog(vsShader);
        alert(err);
        return;
      }
      if (!gl.getShaderParameter(fsShader, gl.COMPILE_STATUS)) {
        let err = gl.getShaderInfoLog(fsShader);
        alert(err);
        return;
      }
      let program = gl.createProgram();
      gl.attachShader(program, vsShader);
      gl.attachShader(program, fsShader);
      gl.linkProgram(program);
      gl.useProgram(program);
      gl.program = program;
    },

    initBuffer() {
      let jsArr = [0.1, 0.4, 0, 0.1, 0.5, 0, 0.2, 0.4, 0];
      let typeArr = new Float32Array(jsArr);

      const buffer = gl.createBuffer();
      gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
      gl.bufferData(gl.ARRAY_BUFFER, typeArr, gl.STATIC_DRAW);

      let aPosition = gl.getAttribLocation(gl.program, "a_position");
      gl.vertexAttribPointer(aPosition, 3, gl.FLOAT, false, 0, 0);
      gl.enableVertexAttribArray(aPosition);

      let uAnglex = gl.getUniformLocation(gl.program, "anglex");
      gl.uniform1f(uAnglex, anglex);
      let uAngley = gl.getUniformLocation(gl.program, "angley");
      gl.uniform1f(uAngley, angley);
    },

    initEvent() {
      document.onkeydown = (event) => {
        if (String.fromCharCode(event.keyCode) == "W") {
          angley += 0.01;
        } else if (String.fromCharCode(event.keyCode) == "S") {
          angley -= 0.01;
        } else if (String.fromCharCode(event.keyCode) == "A") {
          anglex -= 0.01;
        } else if (String.fromCharCode(event.keyCode) == "D") {
          anglex += 0.01;
        }
      };
    },

    draw() {
      gl.clearColor(1.0, 0.0, 0.0, 1.0);
      gl.clear(gl.COLOR_BUFFER_BIT);
      gl.drawArrays(gl.TRIANGLES, 0, 3);
    },

    loopGame() {
      this.init();
      window.requestAnimationFrame(this.loopGame);
    },
  },
};
</script>
