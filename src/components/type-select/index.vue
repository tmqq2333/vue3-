<template>
  <el-select
    v-model="value"
    @change="$emit('update:modelValue', $event)"
    :placeholder="placeholder"
    clearable
  >
    <el-option
      :label="data[seltype.label]"
      v-for="data in dataList"
      :key="data[seltype.value]"
      :value="data[seltype.value]"
      >{{ data[seltype.label] }}</el-option
    >
  </el-select>
</template>
<script>
import { computed, ref, defineComponent } from "vue";
import { getDictDataList } from "@/utils/utils";
import { useAppStore } from "@/store";
import http from "@/config/http";
export default defineComponent({
  name: "TypeSelect",
  props: {
    modelValue: [Number, String],
    dictType: String,
    placeholder: String,
    url: String,
    param: Object,
    seltype: {
      type: Object,
      default: function () {
        return {
          label: "dictLabel",
          value: "dictValue",
        };
      },
    },
  },
  setup(props) {
    const store = useAppStore();
    const dataList = ref([]);
    //选择框联动
    // watch(
    //   () => props.param,
    //   (newValue, oldValue) => {
    //     http
    //       .get(props.url, newValue)
    //       .then(({ data, code }) => {
    //         dataList.value = data;
    //       })
    //       .catch(() => {
    //         dataList.value = [];
    //       });
    //   }
    //   // {immediate:true}
    // );
    if (props.url) {
      if (dataList.length) return;
      http
        .get(props.url)
        .then(({ data, code }) => {
          dataList.value = data;
        })
        .catch(() => {
          dataList.value = [];
        });
    } else {
      dataList.value = getDictDataList(store.state.dicts, props.dictType);
    }

    return {
      value: props.modelValue,
      dataList: dataList,
    };
  },
});
</script>
