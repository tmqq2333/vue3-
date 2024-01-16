<script>

import { getValueByKeys } from "@/utils/utils";
import { defineComponent, ref, watch } from "vue";
import {  useRouter } from "vue-router";

/**
 * 顶部面包屑
 */
export default defineComponent({
  name: "Breadcrumb",
  setup() {
    const router = useRouter();
    const breadcrumbs = ref([]);
    const { currentRoute } = router;
    const firstRoute = (router.options.routes[0] || {});
    const home = firstRoute.children && firstRoute.children.length > 0 ? (firstRoute.children[0]) : firstRoute;
    watch(
      () => currentRoute.value,
      () => {
        breadcrumbs.value = currentRoute.value.path !== home.path ? getValueByKeys(currentRoute.value, "meta.matched", []) : [];
      }
      ,
      {immediate:true}
    );

    return { breadcrumbs, currentRoute, home };
  }
});
</script>
<template>
  <el-breadcrumb separator="/" style="padding-top: 4px">
    <!-- <el-breadcrumb-item :to="{ path: home.path }"> 主页 </el-breadcrumb-item> -->
    <el-breadcrumb-item v-for="x in breadcrumbs" :key="x.path">{{ currentRoute.query._mt || x.title || "" }} </el-breadcrumb-item>
  </el-breadcrumb>
</template>
