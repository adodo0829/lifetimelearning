<template>
  <el-menu default-active="2" class="el-menu-vertical-demo" @open="handleOpen">
    <el-sub-menu v-for="item in list" :index="item.path">
      <template #title>
        <span>{{ item.name }}</span>
      </template>
      <el-menu-item
        v-for="child in item.children"
        :index="child.path"
        @click="handleSubMenu(child)"
        >{{ child.name }}</el-menu-item
      >
    </el-sub-menu>
  </el-menu>
</template>

<script setup>
import { ref } from "vue";
import { useRouter } from "vue-router";
const r = useRouter();
const list = ref([]);

const getRouteInfo = () => {
  let routes = r.options.routes;
  list.value = routes.slice(1);
};

const handleOpen = (key) => {
  r.push(key);
};

const handleSubMenu = (child) => {
  r.push({
    name: child.name,
  });
};

getRouteInfo();
</script>

<style>
.el-menu-vertical-demo:not(.el-menu--collapse) {
  width: 200px;
  height: 100%;
}
.el-sub-menu.is-active .el-sub-menu__title {
  background-color: #409eff;
}
</style>
