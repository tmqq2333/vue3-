<template>
  <el-radio-group v-model="value" @change="$emit('update:modelValue', $event)">
    <el-radio :label="data.dictValue" v-for="data in dataList" :key="data.dictValue">{{ data.dictLabel }}</el-radio>
  </el-radio-group>
</template>
<script >
import { getDictDataList } from "@/utils/utils";
import { computed, defineComponent } from "vue";
import { useAppStore } from "@/store";
export default defineComponent({
  name: "TypeRadioGroup",
  props: {
    modelValue: [Number, String],
    dictType: String
  },
  setup(props) {
    const store = useAppStore();
    return {
      value: props.modelValue,
      dataList: getDictDataList(store.state.dicts, props.dictType)
    };
  }
});
</script>
