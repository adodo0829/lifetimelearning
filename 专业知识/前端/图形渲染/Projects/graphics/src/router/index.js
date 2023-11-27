import { createRouter, createWebHistory } from "vue-router";

// 开启历史模式
const routerHistory = createWebHistory();

import Canvas from "@/pages/Canvas/index.vue";
import Canvas01 from "@/pages/Canvas/Ch01/index.vue";
import Canvas02 from "@/pages/Canvas/Ch02/index.vue";

import WebGL from "@/pages/WebGL/index.vue";
import WebGL01 from "@/pages/WebGL/Chaptor01/index.vue";
import WebGL02 from "@/pages/WebGL/Chaptor02/index.vue";
import WebGL03 from "@/pages/WebGL/Chaptor03/index.vue";
import WebGL04 from "@/pages/WebGL/Chaptor04/index.vue";
import WebGL05 from "@/pages/WebGL/Chaptor05/index.vue";

import Three from "@/pages/Three/index.vue";
import Three01 from "@/pages/Three/01/index.vue";

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
      name: "WebGL-Junior",
      component: WebGL,
      redirect: "/webgl01",
      children: [
        {
          path: "/webgl01",
          name: "WebGL-01",
          component: WebGL01,
        },
        {
          path: "/webgl02",
          name: "WebGL-02",
          component: WebGL02,
        },
        {
          path: "/webgl03",
          name: "WebGL-03",
          component: WebGL03,
        },
        {
          path: "/webgl04",
          name: "WebGL-04",
          component: WebGL04,
        },
        {
          path: "/webgl05",
          name: "WebGL纹理",
          component: WebGL05,
        },
      ],
    },
    {
      path: "/Three",
      name: "Three",
      component: Three,
      children: [
        {
          path: "/Three01",
          name: "1111",
          component: Three01,
        },
      ],
    },
  ],
});

export default router;
