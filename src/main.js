import { createApp } from 'vue'
import App from './App.vue'
import store from './store/store'
import router from "@/router";
import ElementPlus from "element-plus";
import directive from "./directives";
import axios from "./config/http";
import { sTypeSelect, sTypeRadioGroup } from "@/components";
import * as ElementPlusIconsVue from "@element-plus/icons-vue";
import "./assets/styles/index.scss";

// 创建vue实例
const app = createApp(App)
app.config.globalProperties.$http = axios;
for (const [key, component] of Object.entries(ElementPlusIconsVue)) {
  app.component(key, component);
}
// 挂载pinia
app
  .use(store)
  .use(sTypeSelect)
  .use(sTypeRadioGroup)
  .use(ElementPlus, { size: "large", fontSize: "16px" })
  .use(router)
  .mount("#app");

directive(app)