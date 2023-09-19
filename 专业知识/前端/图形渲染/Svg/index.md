# svg

https://codepen.io/HunorMarton/full/PoGbgqj

SVG 标签包含图像元素并定义图像的框架。
它具有宽度和高度属性，定义图像在文档中占用的空间大小。
还有一个定义坐标系的 viewBox 属性。 每个图像元素都基于该坐标系定位。

## 基础图形

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle cx="0" cy="20" r="70" fill="#D1495B" />

  <circle
    cx="0"
    cy="-75"
    r="12"
    fill="none"
    stroke="#F79257"
    stroke-width="2"
  />

  <rect x="-17.5" y="-65" width="35" height="20" fill="#F79257" />
</svg>
```

## 多边形

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <polygon points="0,0 80,120 -80,120" fill="#234236" />
  <polygon points="0,-40 60,60 -60,60" fill="#0C5C4C" />
  <polygon points="0,-80 40,0 -40,0" fill="#38755B" />
  <rect x="-20" y="120" width="40" height="30" fill="brown" />
</svg>
```

```html
<svg class=“gingerbread" width="200" height="200" viewBox="-100 -100 200 200">
  <circle class="body" cx="0" cy="-50" r="30" />

  <circle class="eye" cx="-12" cy="-55" r="3" />
  <circle class="eye" cx="12" cy="-55" r="3" />
  <rect class="mouth" x="-10" y="-40" width="20" height="5" rx="2" />

  <line class="limb" x1="-40" y1="-10" x2="40" y2="-10" />
  <line class="limb" x1="-25" y1="50" x2="0" y2="-15" />
  <line class=“limb" x1="25" y1="50" x2="0" y2="-15" />

  <circle class="button" cx="0" cy="-10" r="5" />
  <circle class="button" cx="0" cy="10" r="5" />
</svg>
```

```css
/* 图形样式 */
.gingerbread .body {
  fill: #cd803d;
}

.gingerbread .eye {
  fill: white;
}

.gingerbread .mouth {
  fill: none;
  stroke: white;
  stroke-width: 2px;
}

.gingerbread .limb {
  stroke: #cd803d;
  stroke-width: 35px;
  stroke-linecap: round;
}
```

## g 标签

在此示例中，每个机翼由两个多边形组成。 它们需要以相同的方式旋转，因此我们可以使用 g 标签将它们分组并一起旋转。 您可以将 g 标签视为 HTML 中的 div 标签。 它本身并不代表任何东西。 但它可以包含组标记上定义的其他元素和属性，并应用于其子项。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <g transform="translate(0 5)">
    <g>
      <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
      <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g transform="rotate(72)">
      <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
      <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g transform="rotate(-72)">
      <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
      <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g transform="rotate(144)">
      <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
      <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
    <g transform="rotate(-144)">
      <polygon points="0,0 36,-50 0,-100" fill="#EDD8B7" />
      <polygon points="0,0 -36,-50 0,-100" fill="#E5C39C" />
    </g>
  </g>
</svg>
```

## path 标签

分支被定义为路径。 路径是最强大的 SVG 标签。 我们可以用路径定义几乎任何东西，如果你打开任何 SVG 文件，你大部分都会看到路径。

路径的形状由 d 属性定义。 这里我们定义了几个绘图命令。 命令始终以定义命令类型的字母开头，以坐标结尾。 这里我们只有两个最简单的命令，move to 和 line to。 移动到命令将光标移动到一个点而不绘制直线，而直线到命令从前一个点绘制一条直线。 命令总是延续前一个命令，因此当我们绘制一条线时，我们只定义端点。 起点将是上一个命令的终点。 这条路径有点不寻常，因为其中有几个 move to 命令来绘制具有相同路径的主分支和每个侧分支

defs 定义引用

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <defs>
    <path
      id="branch"
      d="
        M 0 0 L 0 -90
        M 0 -20 L 20 -34
        M 0 -20 L -20 -34
        M 0 -40 L 20 -54
        M 0 -40 L -20 -54
        M 0 -60 L 20 -74
        M 0 -60 L -20 -74"
      stroke="#E5C39C"
      stroke-width="5"
    />
  </defs>

  <use href="#branch" />
  <use href="#branch" transform="rotate(60)" />
  <use href="#branch" transform="rotate(120)" />
  <use href="#branch" transform="rotate(180)" />
  <use href="#branch" transform="rotate(240)" />
  <use href="#branch" transform="rotate(300)" />
</svg>
```

## 形状的填充可以定义为渐变

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <defs>
    <radialGradient id="shine" cx="0.25" cy="0.25" r="0.35">
      <stop offset="0%" stop-color="#e3a8b0" />
      <stop offset="100%" stop-color="#D1495B" />
    </radialGradient>
  </defs>

  <circle cx="0" cy="20" r="70" fill="url(#shine)" />
  <circle
    cx="0"
    cy="-75"
    r="12"
    fill="none"
    stroke="#F79257"
    stroke-width="2"
  />
  <rect x="-17.5" y="-65" width="35" height="20" fill="#F79257" />
</svg>
```

## 贝塞尔曲线

路径元素变得非常强大。 其中之一是二次贝塞尔曲线，它不仅定义线段的端点，而且还具有控制点。 控制点是一个不可见的坐标，线弯曲到该坐标，但不接触它。 这里我们有一系列二次贝塞尔曲线，随着路径的下降，控制点距离树的中心越来越远。

```html
<!-- 二次 -->
<svg width="200" height="400" viewBox="-100 -200 200 400">
  <path
    d="
      M 0 -80
      Q 5 -75 0 -70
      Q -10 -65 0 -60
      Q 15 -55 0 -50
      Q -20 -45 0 -40
      Q 25 -35 0 -30
      Q -30 -25 0 -20
      Q 35 -15 0 -10
      Q -40 -5 0 0
      Q 45 5 0 10
      Q -50 15 0 20
      Q 55 25 0 30
      Q -60 35 0 40
      Q 65 45 0 50
      Q -70 55 0 60
      Q 75 65 0 70
      Q -80 75 0 80
      Q 85 85 0 90
      Q -90 95 0 100
      Q 95 105 0 110
      Q -100 115 0 120
      L 0 140
      L 20 140
      L -20 140"
    fill="none"
    stroke="#0C5C4C"
    stroke-width="5"
  />
</svg>

<!-- 三次bezier -->
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <circle cx="0" cy="-50" r="10" fill="#a9172a" />
  <rect class="box" x="-60" y="-40" width="120" height="100" />
  <rect class="box" x="-70" y="-47" width="140" height="20" />
  <rect class="stripe" x="-20" y="-40" width="40" height="100" />
  <rect class="stripe" x="-25" y="-47" width="50" height="20" />

  <path
    class="ribbon"
    d="
      M 0 -50
      L 30 -50
      C 50 -50 50 -70 30 -65
      L 0 -50"
  />

  <path
    class="ribbon"
    d="
      M 0 -50
      L -30 -50
      C -50 -50 -50 -70 -30 -65
      L 0 -50"
  />
</svg>
```

## 弧线

arc

```html
<svg width="200" height="400" viewBox="-100 -200 200 400">
  <path
    d="
      M 50 120
      L 50 -80
      A 50 50 0 0 0 -50 -80"
    stroke="#cd803d"
    stroke-width="45"
    class="body"
  />

  <path
    d="
      M 50 120
      L 50 -80
      A 50 50 0 0 0 -50 -80"
    stroke="white"
    stroke-width="40"
    class="body"
  />

  <line class="green-mark" x1="-35" y1="-90" x2="-60" y2="-100" />
  <line class="red-mark" x1="-15" y1="-115" x2="-25" y2="-135" />
  <line class="green-mark" x1="20" y1="-110" x2="35" y2="-130" />
  <line class="red-mark" x1="40" y1="-60" x2="60" y2="-80" />
  <line class="green-mark" x1="40" y1="-10" x2="60" y2="-30" />
  <line class="red-mark" x1="40" y1="40" x2="60" y2="20" />
  <line class="green-mark" x1="40" y1="90" x2="60" y2="70" />
</svg>
```

## 文本

绘制形状并不是路径的唯一用例。 我们还可以使用它们沿着不可见的路径渲染文本。 我们可以在定义部分定义一个路径以确保它不可见。 然后我们在 textPath 属性中引用它，使文本绕一圈。 这里我们再次使用圆弧，但您可以使用任何其他路径，文本将跟随它。

```html
<svg width="200" height="200" viewBox="-100 -100 200 200">
  <defs>
    <path id="text-arc" d="M 0, 50 A 50 50 0 1 1 1,50" />
  </defs>

  <text
    fill="#0c5c4c"
    font-family="Tahoma"
    font-size="0.77em"
    font-weight="bold"
  >
    <textPath href="#text-arc">
      Happy Holidays! Happy Holidays! Happy Holidays!
    </textPath>
  </text>
</svg>
```
