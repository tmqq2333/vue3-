<template>
  <div class="mod-sys__dept">
    <el-form :inline="true" :model="state.dataForm" @keyup.enter="state.getDataList()">
      <el-form-item label="任务ID">
        <el-input v-model="state.dataForm.jobId" placeholder="任务ID" clearable></el-input>
      </el-form-item>
      <el-form-item label="班次">
        <type-select dict-type="type1" v-model="state.dataForm.classes"></type-select>
      </el-form-item>
      <el-form-item label="班次">
        <type-tree dict-type="type2" v-model="state.dataForm.food"></type-tree>
      </el-form-item>
      <el-form-item>
        <el-button @click="state.getDataList()">查询</el-button>
      </el-form-item>
      <el-form-item style="float: right">
        <el-button type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="state.exportHandle()">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table :height="state.maxHeight" row-key="id" v-loading="state.dataListLoading" :data="state.dataList" border
      style="width: 100%">
      <el-table-column prop="AccEndTime" label="名称" header-align="center" min-width="150"></el-table-column>
      <el-table-column prop="AccStartTime" label="上级部门" header-align="center" align="center"></el-table-column>
      <el-table-column prop="ShiftGroup" label="排序" header-align="center" align="center" width="80"></el-table-column>
      <el-table-column label="操作" fixed="right" header-align="center" align="center" width="150">
        <template v-slot="scope">
          <el-button type="primary" link @click="addOrUpdateHandle(scope.row.id)">修改</el-button>
          <el-button type="primary" link @click="state.deleteHandle(scope.row.id)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination :current-page="state.page" :page-sizes="state.sizes" :page-size="state.limit" :total="state.total"
      layout="total, sizes, prev, pager, next, jumper" @size-change="state.pageSizeChangeHandle"
      @current-change="state.pageCurrentChangeHandle">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update ref="addOrUpdateRef" :visible="show" @refreshDataList="state.getDataList" :url="url">
      <template v-slot:default="slotProps">
        <el-row>
          <el-col :span="12">
            <el-form-item prop="AccEndTime" label="字典名称" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.AccEndTime" placeholder="字典名称"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ShiftGroup" label="排序" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.ShiftGroup" placeholder="排序"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ShiftGroup" label="排序" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.ShiftGroup" placeholder="排序"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ShiftGroup" label="排序" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.ShiftGroup" placeholder="排序"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ShiftGroup" label="排序" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.ShiftGroup" placeholder="排序"></el-input>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item prop="ShiftGroup" label="排序" :rules="{
              required: true,
              message: '必填项不能为空',
              trigger: 'blur',
            }">
              <el-input v-model="slotProps.model.ShiftGroup" placeholder="排序"></el-input>
            </el-form-item>
          </el-col>
        </el-row>
      </template>
    </add-or-update>
  </div>
</template>

<script setup>
import { reactive, ref, toRefs } from "vue";
import AddOrUpdate from "@/components/add-or-updata/index.vue";
import TypeTree from "@/components/type-tree/index.vue";
import useView from "@/components/hooks/useView";
const show = ref(false);
const addOrUpdateRef = ref();
const view = reactive({
  getDataListURL: "/highSpeedCable/actualProduction/stops",
  deleteURL: "/delete",
  exportURL: "/on",
});
const url = reactive({
  add: "/add",
  edit: "/edit",
  list: "/highSpeedCable/actualProduction/stops",
});
const state = reactive({ ...useView(view), ...toRefs(view) });
const addOrUpdateHandle = (id) => {
  addOrUpdateRef.value.init(id);
};
</script>
