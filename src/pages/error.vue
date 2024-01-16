<script>
import { defineComponent } from "vue";
import { useRoute, useRouter } from "vue-router";
export default defineComponent({
    setup() {
        var _a;
        const route = useRoute();
        const router = useRouter();
        const { to } = route.query;
        const tips = {
            404: {
                title: "404",
                message: "访问页面不存在"
            },
            error: {
                title: "错误",
                message: "访问出错了"
            }
        };
        const tip = tips[(_a = to === null || to === void 0 ? void 0 : to.toString()) !== null && _a !== void 0 ? _a : "error"];
        const onBack = () => {
            router.back();
        };
        const onToHome = () => {
            router.replace("/");
        };
        return { tip, onBack, onToHome };
    }
});

</script>

<template>
  <div class="rr-error">
    <el-result>
      <template v-slot:icon>
        <el-icon style="font-size: 64px; color: #f5222d"><warning /></el-icon>
      </template>
      <template v-slot:title>
        <span style="font-size: 48px; font-weight: 800">{{ tip.title }}</span>
      </template>
      <template v-slot:subTitle>
        <span style="font-size: 36px">{{ tip.message }}</span>
      </template>
      <template v-slot:extra>
        <el-space :size="30">
          <el-button type="info" plain @click="onBack"> 返回 </el-button>
          <el-button type="primary" @click="onToHome"> 主页 </el-button>
        </el-space>
      </template>
    </el-result>
  </div>
</template>
