# canvas

Canvas 最常见的用途是渲染动画。渲染动画的基本原理，无非是反复地擦除和重绘。为了动画的流畅，留给我渲染一帧的时间，只有短短的 16ms。在这 16ms 中，不仅需要处理一些游戏逻辑，计算每个对象的位置、状态，还需要把它们都画出来。如果消耗的时间稍稍多了一些，用户就会感受到「卡顿」。

## 计算与渲染

计算：处理游戏逻辑，计算每个对象的状态，不涉及 DOM 操作（当然也包含对 Canvas 上下文的操作）。
渲染：真正把对象绘制出来。
2.1. JavaScript 调用 DOM API（包括 Canvas API）以进行渲染。 2.2. 浏览器（通常是另一个渲染线程）把渲染后的结果呈现在屏幕上的过程

结论：动画流畅的前提是，以上所有工作都在 16ms 中完成，所以 javascript 层面消耗的时间最好控制在 10ms 以内（指 1 和 2.1，2.2 在浏览器另一个单独线程）

通常情况下，渲染比计算的开销大很多（3~4 个量级）。除非我们用到了一些时间复杂度很高的算法。所以主要针对渲染环境进行优化。

在每一帧中，尽可能减少调用渲染相关 API 的次数（通常是以计算的复杂化为代价的）。
在每一帧中，尽可能调用那些渲染开销较低的 API。
在每一帧中，尽可能以「导致渲染开销较低」的方式调用渲染相关 API。

## Canvas 上下文是状态机

Canvas API 都在其上下文对象 context 上调用。

var context = canvasElement.getContext('2d');
context 是一个状态机。你可以改变 context 的若干状态，而几乎所有的渲染操作，最终的效果与 context 本身的状态有关系。比如，调用 strokeRect 绘制的矩形边框，边框宽度取决于 context 的状态 lineWidth ，而后者是之前设置的。

context.lineWidth = 5;
context.strokeColor = 'rgba(1, 0.5, 0.5, 1)';
context.strokeRect(100, 100, 80, 80);

Canvas 上下文不是一个普通的对象，当你调用了 context.lineWidth = 5 时，浏览器会需要立刻地做一些事情，这样你下次调用诸如 stroke 或 strokeRect 等 API 时，画出来的线就正好是 5 个像素宽了（不难想象，这也是一种优化，否则，这些事情就要等到下次 stroke 之前做，更加会影响性能）。对 context.lineWidth 赋值的开销远远大于对一个普通对象赋值的开销

如果你赋的值是非法的，浏览器还需要一些额外时间来处理非法输入

somePlainObject.lineWidth = 5; // 3ms (10^6 times)
context.lineWidth = 5; // 40ms
context.lineWidth = 'Hello World!'; // 140ms
context.lineWidth = {}; // 600ms

与真正的绘制操作相比，改变 context 状态的开销已经算比较小了，毕竟我们还没有真正开始绘制操作。我们需要了解，改变 context 的属性并非是完全无代价的。我们可以通过适当地安排调用绘图 API 的顺序，降低 context 状态改变的频率。

## 分层 Canvas

分层 Canvas 在几乎任何动画区域较大，动画较复杂的情形下都是非常有必要的。分层 Canvas 能够大大降低完全不必要的渲染性能开销。

分层 Canvas 的出发点是，动画中的每种元素（层），对渲染和动画的要求是不一样的。对很多游戏而言，主要角色变化的频率和幅度是很大的（他们通常都是走来走去，打打杀杀的），而背景变化的频率或幅度则相对较小（基本不变，或者缓慢变化，或者仅在某些时机变化）。很明显，我们需要很频繁地更新和重绘人物，但是对于背景，我们也许只需要绘制一次，也许只需要每隔 200ms 才重绘一次，绝对没有必要每 16ms 就重绘一次。

var contextBackground = canvasBackground.getContext('2d');
var contextForeground = canvasForeground.getContext('2d');

function render(){
drawForeground(contextForeground);
if(needUpdateBackground){
drawBackground(contextBackground);
}
requestAnimationFrame(render); //h5 新增的定时器,requestAnimationFrame 采用系统时间间隔，保持最佳绘制效率,标准 16.6ms 触发一次。不兼容 ie9-。
}

## 离屏绘制

绘制图像

context.drawImage(image, sx, sy, sWidth, sHeight, dx, dy, dWidth, dHeight); ![](http://photo.lustforlife.cn/45.png)
数据源与绘制的性能: 「把图片中的某一部分绘制到 Canvas 上」的能力，所以很多时候，我们会把多个游戏对象放在一张图片里面，以减少请求数量。这通常被称为「精灵图」。然而，这实际上存在着一些潜在的性能问题。我发现，使用 drawImage 绘制同样大小的区域，数据源是一张和绘制区域尺寸相仿的图片的情形，比起数据源是一张较大图片（我们只是把数据扣下来了而已）的情形，前者的开销要小一些。可以认为，两者相差的开销正是「裁剪」这一个操作的开销。

第一次看到 getImageData 和 putImageData 这一对 API，我有一种错觉，它们简直就是为了上面这个场景而设计的。前者可以将某个 Canvas 上的某一块区域保存为 ImageData 对象，后者可以将 ImageData 对象重新绘制到 Canvas 上面去。但实际上，putImageData 是一项开销极为巨大的操作，它根本就不适合在每一帧里面去调用。

视野之外的绘制
通过计算取代直接绘制的开销

drawImage 方法的第一个参数不仅可以接收 Image 对象，也可以接收另一个 Canvas 对象。而且，使用 Canvas 对象绘制的开销与使用 Image 对象的开销几乎完全一致。我们只需要实现将对象绘制在一个未插入页面的 Canvas 中，然后每一帧使用这个 Canvas 来绘制。

// 在离屏 canvas 上绘制
var canvasOffscreen = document.createElement('canvas');
canvasOffscreen.width = dw;
canvasOffscreen.height = dh;
canvasOffscreen.getContext('2d').drawImage(image, sx, sy, sw, sh, dx, dy, dw, dh);

// 在绘制每一帧的时候，绘制这个图形
context.drawImage(canvasOffscreen, x, y);

## 避免阻塞

所谓「阻塞」，可以理解为不间断运行时间超过 16ms 的 JavaScript 代码，以及「导致浏览器花费超过 16ms 时间进行处理」的 JavaScript 代码。

频繁（通常较小）的阻塞。其原因主要是过高的渲染性能开销，在每一帧中做的事情太多。
本文的前几种方案优化解决

较大（虽然偶尔发生）的阻塞。其原因主要是运行复杂算法、大规模的 DOM 操作等等。
使用 Web Worker，在另一个线程里进行计算。(时间复杂度比较高的算法)
将任务拆分为多个较小的任务，插在多帧中进行。
