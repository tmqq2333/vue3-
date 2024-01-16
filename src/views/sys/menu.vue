<template>
  <div class="mod-sys__menu">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item>
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
      </el-form-item>
    </el-form>
    <el-table :height="state.maxHeight" row-key="id" v-loading="state.dataListLoading" show-overflow-tooltip
      :data="state.dataList" border style="width: 100%">
      <el-table-column prop="name" label="名称" header-align="center" min-width="150"></el-table-column>
      <el-table-column prop="icon" label="图标" header-align="center" align="center">
        <template v-slot="scope">
          <el-icon class="iconfont" aria-hidden="true">
            <!-- <component :is="`${scope.row.icon}`"></component> -->
            <component :is="`Folder`"></component>
          </el-icon>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="类型" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.menuType === 0">菜单</el-tag>
          <el-tag v-else type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="menuType" label="类型" header-align="center" align="center">
        <template v-slot="scope">
          <el-tag v-if="scope.row.menuType === 0">菜单</el-tag>
          <el-tag v-else type="info">按钮</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="openStyle" label="打开方式" header-align="center" align="center">
        <template v-slot="scope">
          <span v-if="scope.row.menuType !== 0"></span>
          <el-tag v-else-if="scope.row.openStyle === 1">外部打开</el-tag>
          <el-tag v-else type="info">内部打开</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="sort" label="排序" header-align="center" align="center"></el-table-column>
      <el-table-column prop="url" label="路由" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column prop="permissions" label="授权标识" header-align="center" align="center" width="150"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="primary" link @click="state.deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <add-or-update ref="addOrUpdateRef" :visible="show" @refreshDataList="state.getDataList" :url="url">
      <template v-slot:default="slotProps">
        <el-form-item prop="menuType" label="类型">
          <el-radio-group v-model="slotProps.model.menuType" :disabled="!!slotProps.model.id">
            <el-radio :label="0">菜单</el-radio>
            <el-radio :label="1">按钮</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="name" label="名称">
          <el-input v-model="slotProps.model.name" placeholder="名称"></el-input>
        </el-form-item>

        <el-form-item prop="parentName" label="上级菜单" class="menu-list">
          <el-popover ref="menuListPopover" placement="bottom-start" trigger="click" :width="400"
            popper-class="popover-pop">
            <template v-slot:reference>
              <el-input v-model="slotProps.model.parentName" :readonly="true" placeholder="上级菜单">
                <template v-slot:suffix>
                  <el-icon v-if="slotProps.model.pid !== '0'" @click.stop="deptListTreeSetDefaultHandle()"
                    class="el-input__icon"><circle-close /></el-icon></template>
              </el-input>
            </template>
            <!-- <div class="popover-pop-body">
              <el-tree :data="slotProps.model.menuList" :props="{ label: 'name', children: 'children' }" node-key="id" ref="menuListTree"
                :highlight-current="true" :expand-on-click-node="false" accordion
                @current-change="menuListTreeCurrentChangeHandle">
              </el-tree>
            </div> -->
          </el-popover>
        </el-form-item>

        <el-form-item v-if="slotProps.model.menuType === 0" prop="url" label="路由">
          <el-input v-model="slotProps.model.url" placeholder="路由"></el-input>
        </el-form-item>

        <el-form-item prop="sort" label="排序">
          <el-input-number v-model="slotProps.model.sort" controls-position="right" :min="0" label="排序"></el-input-number>
        </el-form-item>

        <el-form-item v-if="slotProps.model.menuType === 0" prop="openStyle" label="打开方式">
          <el-radio-group v-model="slotProps.model.openStyle">
            <el-radio :label="0">内部打开</el-radio>
            <el-radio :label="1">外部打开</el-radio>
          </el-radio-group>
        </el-form-item>

        <el-form-item prop="permissions" label="授权标识">
        <el-input v-model="slotProps.model.permissions" placeholder="多个用逗号分隔，如：sys:menu:save,sys:menu:update"></el-input>
      </el-form-item>
      <el-form-item   prop="icon" label="图标" class="icon-list">
        <el-popover ref="iconListPopover"  placement="top-start" trigger="click" popper-class="popover-pop mod-sys__menu-icon-popover">
          <template v-slot:reference> <el-input v-model="slotProps.model.icon" :readonly="true" placeholder="图标"></el-input></template>
          <div class="mod-sys__menu-icon-inner">
            <div class="mod-sys__menu-icon-list">
              <el-button v-for="(item, index) in iconList" :key="index" @click="()=>slotProps.model.icon=item" :class="{ 'is-active': slotProps.model.icon === item }">
                <el-icon class="icon-svg" aria-hidden="true"><component :is="`${item}`"></component></el-icon>
              </el-button>
            </div>
          </div>
        </el-popover>
      </el-form-item>
      </template>
    </add-or-update>
  </div>
</template>
<script setup>
import useView from "@/components/hooks/useView";
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "@/components/add-or-updata/index.vue";
const view = reactive({
  getDataListURL: "/sys/menu/list",
  deleteURL: "/delete",
});
const state = reactive({ ...useView(view), ...toRefs(view) });
const addOrUpdateRef = ref();
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
};
const iconList=['User','PieChart','Odometer']
</script>
<style lang="scss" >
.el-popover.el-popper {
  overflow-x: hidden;
}
.mod-sys__menu {
  .menu-list,
  .icon-list {
    .el-input__inner,
    .el-input__suffix {
      cursor: pointer;
    }
  }
  &-icon-popover {
    width: 458px !important;
    overflow-y: hidden !important;
  }
  &-icon-inner {
    width: 100%;
    max-height: 260px;
    overflow-x: hidden;
    overflow-y: auto;
  }
  &-icon-list {
    width: 458px !important;
    padding: 0;
    margin: -8px 0 0 -8px;
    > .el-button {
      padding: 8px;
      margin: 8px 0 0 8px;
      > span {
        display: inline-block;
        vertical-align: middle;
        width: 18px;
        height: 18px;
        font-size: 18px;
      }
    }
  }
}
</style>
