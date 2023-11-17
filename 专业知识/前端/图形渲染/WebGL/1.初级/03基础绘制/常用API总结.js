/**
 *  1.WebGL初始化相关方法
 */
// 获取容器
const dom = document.getElementById("xxx");
// 获取上下文
let gl = dom.getContext("weblg");
// 设置可视区域
gl.viewport(0, 0, dom.clientWidth, dom.clientHeight);

/**
 * 2.着色器相关方法
 */
// 创建着色器
let vshader = gl.createShader(gl.VERTEX_SHADER);
let fshader = gl.createShader(gl.FRAGMENT_SHADER);
// 用于设置程序代码的 WebGLShader
gl.shaderSource(vshader, vertexString);
gl.shaderSource(fshader, fragmentString);
// 着色器编译
gl.compileShader(vshader);
gl.compileShader(fshader);
// 验证GLSL字符串
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

/**
 * 3.缓冲区相关方法
 */
// 获取GLSL里面的变量：getAttribLocation & getUniformLocation
let aPsotion = gl.getAttribLocation(gl.program, "a_position");

// 准备顶点数据，类型数组，提前声明类型
let lineArray = [50, 50, 0, 150, 100, 0, 200, 200, 0, 250, 130, 0];
let pointPosition = new Float32Array(lineArray);
// 创建缓冲区
const lineArrayBuffer = gl.createBuffer();
// 方法将给定的 WebGLBuffer 绑定到目标
gl.bindBuffer(gl.ARRAY_BUFFER, lineArrayBuffer);
// 创建数据储存区
gl.bufferData(gl.ARRAY_BUFFER, pointPosition, gl.STATIC_DRAW);
// 顶点缓冲区和GPU渲染管线之间存在一个硬件单元可以决定GPU是否能读取顶点缓冲区中的顶点数据，开启方法是enableVertexAttribArray(),
// 能开启自然能够关闭，关闭的方法是disableVertexAttribArray()， 两个方法的参数都是顶点着色器程序中顶点变量的索引位置
gl.enableVertexAttribArray(aPsotion);
// 告诉显卡从当前绑定的缓冲区（bindBuffer() 指定的缓冲区）中读取顶点数据。
// 顶点索引缓冲区不需要该方法，该方法的作用是规定GPU从顶点缓冲去中读取数据的方式，
// 很多时候为了提高顶点数据的传输读取效率，往往会把顶点位置、顶点颜色、顶点法向量、纹理坐标交叉定义在一个类型数组中， 
// 一次性传入顶点缓冲区中，CPU和GPU不需要多次通信，只要执行一次databuffer()方法，这时候GPU为了使用顶点缓冲去区的不同用途数据，就要按照一定规律读取，所以类型数据中的数据会把同一个顶点的所有用途数据连续放在一起， 不同顶点的数据依次排列。

// 可以在同一个WebGL程序中定义多个该方法，每个方法的参数location分别只想一个不同的顶点变量，然后控制后面其它的参数保证取用不用的数据，最简单的思路就是每间隔几个数据，取用几个。
gl.vertexAttribPointer(pointPosition, 3, gl.FLOAT, false, 0, 0);
const uniformProj = gl.getUniformLocation(gl.program, "proj");
gl.uniformMatrix4fv(uniformProj, false, projMat4);

// 顶点数据配置
// 创建缓冲区对象
// var buffer=gl.createBuffer();
// //绑定缓冲区对象
// gl.bindBuffer(gl.ARRAY_BUFFER,buffer);
// //顶点数组data数据传入缓冲区
// gl.bufferData(gl.ARRAY_BUFFER,data,gl.STATIC_DRAW);
// //缓冲区中的数据按照一定的规律传递给位置变量apos
// gl.vertexAttribPointer(aposLocation,3,gl.FLOAT,false,0,0);
// //允许数据传递
// gl.enableVertexAttribArray(aposLocation)

// 顶点索引配置
// createBuffer()和deleteBuffer()
// createBuffer()方法会在GPU控制的显存上创建一个缓冲区用来存储顶点或顶面索引数据，通过deleteBuffer(buffer)方法的作用是删除某个缓冲区，参数buffer表示顶点或顶点索引缓冲区的名字，也就是执行createBuffer()方法返回的对象变量名。
// 创建缓冲区对象
var indexesBuffer = gl.createBuffer();
//绑定缓冲区对象: target相同，也就是同类缓冲区在同一时刻只能绑定一个，只有处于绑定状态才能传入数据。
gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexesBuffer);
//索引数组indexes数据传入缓冲区,bufferData()方法的作用是把CPU控制的主存中类型数组数据传入GPU控制的显存顶点或顶点索引缓冲区中
gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, indexes, gl.STATIC_DRAW);

/**
 * 4.绘制方法
 */

gl.clearColor(0.0, 0.0, 0.0, 1.0);
gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
gl.drawArrays(gl.LINE_LOOP, 0, 4); // gl.drawElements
