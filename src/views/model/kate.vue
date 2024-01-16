<template>
  <div>
    katekate carcar
    {{ aa }}
    <Text :data="data"></Text>
  </div>
</template>
<script lang="jsx" setup>
import { reactive, ref, toRefs } from "vue";
const aa='aaaaaaaaa'
import Text from "./text";
const data=[{
  title:'江南皮革厂',
  Fn:()=><el-input>hahhhahah</el-input>
}]
</script>

<style lang="scss" scoped></style>
