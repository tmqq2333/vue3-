<template>
  <el-dialog
    v-model="visible"
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :close-on-press-escape="false"
  >
    <el-form
      :model="dataForm"
      ref="dataFormRef"
      @keyup.enter="dataFormSubmitHandle()"
      label-width="80px"
    >
        <slot :model="dataForm"></slot>
    </el-form>
    <template v-slot:footer>
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmitHandle()">确定</el-button>
    </template>
  </el-dialog>
</template>

<script setup>
import { reactive, ref, defineProps } from "vue";
import baseService from "@/config/http";
import { ElNotification } from "element-plus";

const emit = defineEmits(["refreshDataList"]);
const props = defineProps({
  url: {
    type: Object,
    default: () => {},
  },
});
const dataFormRef = ref();
const visible = ref(false);
const type = ref("add");

const dataForm = reactive({});

const init = (id) => {
  visible.value = true;
  //dataForm.id = "";

  // // 重置表单数据
  if (dataFormRef.value) {
    dataFormRef.value.resetFields();
  }

  if (id) {
    dataForm.id = id;
    type.value = "edit";
    getInfo(id);
  } else {
    type.value = "add";
  }
};

// // 获取信息
const getInfo = (id) => {
  baseService.get(`${props.url.list}`, { id: id }).then((res) => {
    console.log("修改", res.data, Object.assign(dataForm, res.data[0]));
    Object.assign(dataForm, res.data[0]);
  });
};

// 表单提交
const dataFormSubmitHandle = () => {
  if (!props.url) {
    console.error("亲亲~忘了写url了哟~");
  }
  dataFormRef.value.validate((valid) => {
    if (!valid) {
      return false;
    }
    console.log("dataForm", dataForm);

    baseService.post(`${props.url[type.value]}`, dataForm).then((res) => {
      ElNotification.success({
        message: "成功",
        duration: 500,
        onClose: () => {
          visible.value = false;
          emit("refreshDataList");
        },
      });
    });
  });
};

defineExpose({
  init,
});
</script>
