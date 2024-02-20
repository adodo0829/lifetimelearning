# 微前端 qiankun

## 动态子路由插入

要想正确渲染出主应用和子应用的组件，我们先来看路由解析的过程：

1.主应用需要拥有子应用的路由，否则第二步会直接报错
2./sub_app_xxx/home 对应的路由组件被渲染了两次

### 方法一：容器切换

比较合理的解决方法是，在主应用中添加一条不含 component 的通配路由

```js
path: "/sub_app_test/*"; // 通配路由，不含 component
```

```vue
<template>
  <section class="main-container">
    <!-- 非子应用路由时使用router-view -->
    <transition v-if="!isSubApp" name="fade-transform" mode="out-in">
      <router-view />
    </transition>
    <!-- 子应用路由时展示容器 Dom -->
    <div v-show="isSubApp" id="yourContainer" />
  </section>
</template>

<script>
computed: {
  //判断路由属于子应用还是主应用
  isSubApp() {
    return this.$route.path.indexOf('/sub_app') > -1
  }
 }
</script>
```

渲染子应用组件需要对 main 部分进行一些改造：判断路由属于主应用时，main 直接作为<router-view>渲染主应用本身的路由，而判断路由属于子应用时，main 作为 qiankun 的渲染容器。
需要注意的是，为了防止
qiankun 加载时找不到容器 DOM，该 DOM 需要使用 v-show 代替 v-if 控制显隐。

### 方法二：路由通配添加特殊组件

为通配路由增加特殊组件，该组件为 qiankun 的渲染容器

```js
{
  path: '/sub_app_test/*'，
  component: () => import('../Microapp.vue'),
}

//Microapp.vue
<template>
    <div id="yourContainer"/>
</template>

```
