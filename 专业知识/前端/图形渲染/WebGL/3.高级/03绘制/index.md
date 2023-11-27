# typeArrray

一个字节 = 8 位二进制数， 长度 0-255

# 性能提升

- 数据方面提升
  数据组织的方式

结构数组：把不同类型的数据交叉保存在同一个数组中 （如：顶点位置，颜色，UV 坐标放到同一个数组）
vertexAttribPointer( )

- 绘制方面提升

三角带：引入索引奇数 3 个,偶数 2 个
构造退化三角形： 至少有两个索引或顶点是相同的

# 绘制 API 性能对比

同样绘制 8 个三角形

## webgl.drawArrays(webgl.TRIANGLES,0,24);

24 个点，每个点 4 个浮动数坐标， 一个浮点数 4 个字节
字节数 （24 x 4） x 4

## webgl.drawArrays(webgl.TRIANGLE_STRIP, 0, 14);

字节数 （8 + 4 + 2 x 1） x 4 x 4

## webgl.drawElements(webgl.TRIANGLES, 6, webgl.UNSIGNED_BYTE, 0);


