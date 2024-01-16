<script >
import { EMitt, ESidebarLayoutEnum, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { getValueByKeys } from "@/utils/utils";
import { computed, defineComponent, reactive, watch } from "vue";
import {  useRoute, useRouter } from "vue-router";
import { useAppStore } from "@/store";
import BaseSidebar from "../sidebar/base-sidebar.vue";
/**
 * 顶部导航菜单，混合布局模式下用到
 */
export default defineComponent({
  name: "HeaderMixNavMenus",
  components: { BaseSidebar },
  setup() {
    const store = useAppStore();
    const router = useRouter();
    const route = useRoute();
    const state = reactive({
      currRoute: getValueByKeys(getValueByKeys(router.currentRoute.value.meta, "matched", [])[0], "path", "")
    });
    watch(
      () => route.path,
      () => {
        if (getThemeConfigCacheByKey(EThemeSetting.NavLayout) === ESidebarLayoutEnum.Mix) {
          const matchedRoute = getValueByKeys(getValueByKeys(router.currentRoute.value.meta, "matched", [])[0], "path", "");
          if (matchedRoute) {
            state.currRoute = matchedRoute;
            emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, matchedRoute);
          }
        }
      },
      { immediate: true }
    );
    const topHeaderMenus = computed(() => {
      const rs= [];
      store.state.routes.forEach((x) => {
        rs.push({
          path: x.path,
          children: [],
          meta: x.meta ? x.meta : {}
        });
      });
      return rs;
    });
    const onSelect = (path) => {
      const r=store.state.routes
       //直接用store的路由信息，从useRouter获取的可能有刷新路由丢失问题
      const curr = r.find((x) => x.path === path);
      if (!curr?.children?.length) {
        state.currRoute = path
        router.push(path);
      } else {
        state.currRoute = curr.children[0].path;
        router.push(state.currRoute);
        emits.emit(EMitt.OnSelectHeaderNavMenusByMixNav, path);
      }
    };
    return { state, topHeaderMenus, onSelect };
  }
});
</script>
<template>
  <base-sidebar mode="horizontal" :menus="topHeaderMenus" :ismix="true" :router="false" :currRoute="state.currRoute" :is-mobile="false" :onSelect="onSelect"></base-sidebar>
</template>
