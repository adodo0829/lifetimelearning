<template>
  <div class="main">
    <div class="page-sider">
      <PageSider />
    </div>
    <div class="page-content">
      <router-view></router-view>
    </div>
  </div>
</template>

<script>
import PageSider from "@/components/Sider/index.vue";

export default {
  components: {
    PageSider,
  },
};
</script>

<style lang="less">
.main {
  display: flex;
  height: 100vh;
  overflow: hidden;

  .page-sider {
    width: 200px;
  }
}
</style>
