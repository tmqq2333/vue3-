<script>
import { defineComponent } from "vue";
import { themeSetting } from "@/constants/config";
import { useAppStore } from "@/store";
//import SvgIcon from "@/components/SvgIcon/index.vue";
export default defineComponent({
  name: "SidebarMenusItems",
  //components: { SvgIcon },
  props: {
    menus: Array,
    hiddenIndex: Number,
    className: String,
    ismix: Boolean,
  },
  setup(props) {
    console.log("props.menus", props.menus);
    const store = useAppStore();
    const getStyle = (index) => {
      const styles = [];
      const isHidden = props.hiddenIndex
        ? props.hiddenIndex > -1 && index > props.hiddenIndex
        : false;
      styles.push("display:" + (isHidden ? "none" : "block"));
      return styles.join(";");
    };
    return { props, getStyle, themeSetting };
  },
});
</script>
<template>
  <template v-for="(x, index) in props.menus || []" :key="x.path">
    <el-sub-menu
      v-if="x.children && x.children.length > 0 && !ismix"
      :index="x.path"
      :popper-class="props.className"
      :class="{ isMore: x.meta?.isMore }"
      :style="getStyle(index)"
    >
      <template #title>
        <el-icon v-if="x.meta?.icon !== false">
          <component :is="x.meta?.icon || 'Document'"></component>
        </el-icon>
        <span>
          <a>{{ x.meta?.title }}</a>
        </span>
      </template>
      <sidebar-menus-items :menus="x.children"></sidebar-menus-items>
    </el-sub-menu>
    <el-menu-item
      v-else
      :index="x.meta?.isNewPage ? x.path : x.path"
      :class="{ isLink: !!x.meta?.isNewPage, isMore: x.meta?.isMore }"
      :style="getStyle(index)"
    >
      <template #title>
        <a
          v-if="x.meta?.isNewPage"
          :href="`${x.meta.url}`"
          target="_blank"
          rel="opener"
        >
          {{ x.meta.title }}
        </a>
        <a v-else>{{ x.meta?.title }}</a>
      </template>
      <el-icon v-if="x.meta?.icon !== false">
        <!-- <svg-icon :name="`${x.meta?.icon || 'icon-file-fill'}`"></svg-icon> -->
         <component :is="x.meta?.icon || 'GobletSquareFull'"></component>
      </el-icon>
    </el-menu-item>
  </template>
</template>
