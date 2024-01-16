<template>
  <div>55555656这是首页
    <el-button v-has="['xx']">ll555</el-button>
    
    <el-button type="primary" @click="toPage()">Primary</el-button>
  </div>
</template>

<script >
import { useAppStore } from "@/store";
import { useRouter } from "vue-router";
import { defineComponent, watch, ref } from "vue";
export default defineComponent({
  props: {
    visible: {
      type: Boolean,
      default: false,
    },
  },
  setup(props) {
    const open = ref(false);
    watch(
      () => props.visible,
      (val) => {
        open.value = val;
      }
    );
   const router = useRouter();
   const store = useAppStore();

  
   const toPage=()=>{
    if(store.state.routes.length>5){
      let onepath=store.state.routes[4]
       const path=onepath.children?.[0].path??onepath.path    
       router.push(path);
    }else{
      console.error('只有首页权限');
      
    }
     
   }
    return {
      open,toPage
    };
  },
});
</script>
