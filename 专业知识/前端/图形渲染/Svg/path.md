# path

path 元素是 SVG 基本形状中最强大的一个，它不仅能创建其他基本形状，还能创建更多其他形状。

比如矩形（直角矩形或者圆角矩形）、圆形、椭圆、折线形、多边形等。

更重要的是能够绘制一些曲线，如贝塞尔曲线、二次曲线等。

path 元素的形状是通过属性 d 来定义的，d 属性通过“命令和坐标”的序列来控制整个 path 绘制的路径

## path 的坐标命令

M = moveto
L = lineto
H = horizontal lineto
V = vertical lineto
C = curveto
S = smooth curveto
Q = quadratic Bézier curve
T = smooth quadratic Bézier curveto
A = elliptical Arc
Z = closepath

### 直线命令主要有以下几种：

M（moveto）：需要两个参数（x 轴和 y 轴坐标，移动到的点的 x 轴和 y 轴的坐标
L（lineto）：需要两个参数（x 轴和 y 轴坐标），它会在当前位置和最新的位置（L 前面画笔所在的点）之间画一条线段。
H（horizontal lineto）：一个参数，标明在 x 轴移动到的位置，绘制水平线
V（vertical lineto）：一个参数，标明在 y 轴移动到的位置，绘制垂直线
Z（ closepath）：从当前点画一条直线到路径的起点

### 曲线命令

#### C（curveto）三次贝塞尔曲线

三次贝塞尔曲线需要定义一个点和两个控制点，用 C 命令来创建。

(x,y)表示的是曲线的终点，(x1,y1)是起点的控制点，(x2,y2)是终点的控制点。控制点描述的是曲线起始点的斜率，曲线上各个点的斜率，是从起点斜率到终点斜率的渐变过程。

#### Q（quadratic Bézier curve）二次贝塞尔曲线

二次贝塞尔曲线 Q，只需要一个控制点，用来确定起点和终点的曲线斜率。因此它需要两组参数，控制点和终点坐标

#### A（elliptical Arc）弧形

A rx ry x-axis-rotation large-arc-flag sweep-flag x y
a rx ry x-axis-rotation large-arc-flag sweep-flag dx dy

弧形命令 A 前两个参数 rx 和 ry 分别是 x 轴半径和 y 轴半径。
弧形命令 A 的第三个参数表示弧形的旋转情况。
large-arc-flag 决定弧线是大于还是小于 180 度，0 表示小角度弧，1 表示大角度弧。
sweep-flag 表示弧线的方向，0 表示从起点到终点沿逆时针画弧，1 表示从起点到终点沿顺时针画弧。
x：结束点 x 坐标。
y：结束点 y 坐标。
