<script setup>
import FullscreenLayout from "@/layout/fullscreen-layout.vue";
import Layout from "@/layout/index.vue";
import app from "@/constants/app";
import { useRoute } from "vue-router";
import {useAppStore} from "@/store";
import { getThemeConfigCache, setThemeColor, updateTheme } from "@/utils/theme";
import { onMounted, reactive, watch } from "vue";
import {EPageLayoutEnum, EThemeColor, EThemeSetting } from "@/constants/enum";
const locale = app.defaultLang;
const route = useRoute();
document.title=app.title
const store = useAppStore();
const state = reactive({
  layout: location.href.includes("pop=true")
    ? EPageLayoutEnum.fullscreen
    : EPageLayoutEnum.page,
});
const pageTag = EPageLayoutEnum.page;
 onMounted(() => {
      //读取主题色缓存
      const themeCache = getThemeConfigCache();
      console.log('themeCache',themeCache);
      
      const themeColor = themeCache[EThemeSetting.ThemeColor];
      const themefontSize = themeCache[EThemeSetting.ThemefontSize];
      const btnColor = themeCache[EThemeSetting.BtnColor];
      //updateTheme(btnColor);//这种更新方式太麻烦了，而且固定了fontsize。用element.scss来修改elementplus的。如果后期要弄主题修改可以再改
      setThemeColor(EThemeColor.ThemeColor, themeColor);
      setThemeColor(EThemeColor.ThemefontSize, themefontSize);
      
    });
    watch(
      () => [route.path, route.query, route.fullPath],
      ([path, query, fullPath]) => {
         store.updateState({ activeTabName: fullPath });
        state.layout = app.fullscreenPages.includes(path) || query["pop"] ? EPageLayoutEnum.fullscreen : EPageLayoutEnum.page;
      }
    );
</script>

<template>
  <el-config-provider :locale="locale">
    <layout v-if="state.layout === pageTag"></layout>
    <fullscreen-layout v-else></fullscreen-layout>
  </el-config-provider>
</template>

<style scoped></style>
