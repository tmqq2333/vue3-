<script>
//import SvgIcon from "@/components/SvgIcon";
import { EMitt, EThemeSetting } from "@/constants/enum";
import emits from "@/utils/emits";
import { getThemeConfigCacheByKey, setThemeConfigToCache } from "@/utils/theme";
import { defineComponent, reactive } from "vue";

/**
 * PC和移动端下的侧边栏展开收起按钮
 */
export default defineComponent({
  name: "CollapseSidebarBtn",
  //components: { SvgIcon },
  setup() {
    const state = reactive({
      collapseSidebar: getThemeConfigCacheByKey(EThemeSetting.SidebarCollapse)
    });
    const onClickSidebarSwitcher = () => {
      const key = EThemeSetting.SidebarCollapse;
      state.collapseSidebar = !state.collapseSidebar;
      emits.emit(EMitt.OnSwitchLeftSidebar);
      emits.emit(EMitt.OnSetTheme, [key, key + "-" + state.collapseSidebar]);
      setThemeConfigToCache(key, state.collapseSidebar);
    };
    const onClickSidebarSwitcherByMobile = () => {
      emits.emit(EMitt.OnMobileOpenSidebar);
    };
    return { state, onClickSidebarSwitcher, onClickSidebarSwitcherByMobile };
  }
});
</script>
<template>
  <div class="hidden-xs-only" @click="onClickSidebarSwitcher">
    <!-- <svg-icon :name="state.collapseSidebar ? 'indent' : 'outdent'"></svg-icon> -->
    <el-icon><Expand v-if="state.collapseSidebar"/><Fold v-else /></el-icon>
  </div>
  <div class="hidden-sm-and-up show-xs-only" @click="onClickSidebarSwitcherByMobile">
    <!-- <svg-icon name="icon-indent"></svg-icon> -->
    <el-icon><Expand /></el-icon>
  </div>
</template>
