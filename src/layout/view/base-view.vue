<script>
import app from "@/constants/app";
import { EMitt, EThemeSetting,ESidebarLayoutEnum } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { defineComponent, reactive, ref } from "vue";
import { useRoute } from "vue-router";
import { useAppStore } from "@/store";
import Breadcrumb from "../header/breadcrumb.vue";
//import Tabs from "./tabs.vue";

/**
 * 业务内容视图框架,不加标签页
 */
export default defineComponent({
  name: "View",
  // components: { Tabs },
   components: {Breadcrumb},
  setup() {
    const store = useAppStore();
    const route = useRoute();
    const state = reactive({
      openTabsPage: getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage),
      sidebarLayout: getThemeConfigCacheByKey(EThemeSetting.NavLayout)
    });
    const routerKeys = ref({});
    emits.on(EMitt.OnSetThemeTabsPage, (vl) => {
      state.openTabsPage = vl;
    });
    emits.on(EMitt.OnReloadTabPage, () => {
      console.log('8100000');
      
      routerKeys.value[route.fullPath] = new Date().getTime();
    });
    return { state, store, enabledKeepAlive: app.enabledKeepAlive, routerKeys ,ESidebarLayoutEnum};
  },
});
</script>

<template>
  <!-- <tabs v-if="state.openTabsPage" :tabs="store.state.tabs" :activeTabName="store.state.activeTabName"></tabs> -->
  <div class="rr-view-header" v-if="state.sidebarLayout === ESidebarLayoutEnum.Mix">
  <breadcrumb ></breadcrumb>
  </div>
  <div class="rr-view-ctx">
    <el-card shadow="never" class="rr-view-ctx-card">
      <router-view v-slot="{ Component }">
        <keep-alive v-if="enabledKeepAlive">
          <transition name="fade-transform" mode="out-in">
            <component
              :is="Component"
              :key="routerKeys[$route.fullPath] || $route.fullPath"
            />
          </transition>
        </keep-alive>
        <transition name="fade-transform" mode="out-in">
          <component :is="Component" v-if="!enabledKeepAlive" />
        </transition>
      </router-view>
    </el-card>
  </div>
</template>
