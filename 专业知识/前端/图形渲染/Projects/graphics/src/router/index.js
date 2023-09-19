import { createRouter, createWebHistory } from "vue-router";

// 开启历史模式
const routerHistory = createWebHistory();

import Canvas from "@/pages/Canvas/index.vue";
import Canvas01 from "@/pages/Canvas/Ch01/index.vue";
import Canvas02 from "@/pages/Canvas/Ch02/index.vue";

import WebGL from "@/pages/WebGL/index.vue";
import WebGL01 from "@/pages/WebGL/Chaptor01/index.vue";

const router = createRouter({
  history: routerHistory,
  routes: [
    {
      path: "/",
      redirect: "/canvas",
    },
    {
      path: "/canvas",
      name: "Canvas",
      component: Canvas,
      redirect: "/canvas01",
      children: [
        {
          path: "/canvas01",
          name: "Canvas-01",
          component: Canvas01,
        },
        {
          path: "/canvas02",
          name: "Canvas-02",
          component: Canvas02,
        },
      ],
    },
    {
      path: "/webgl",
      name: "WebGL",
      component: WebGL,
      redirect: "/webgl01",
      children: [
        {
          path: "/webgl01",
          name: "WebGL-01",
          component: WebGL01,
        },
      ],
    },
  ],
});

export default router;
