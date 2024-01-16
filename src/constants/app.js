import appPack from "../../package.json";
import zhCn from "element-plus/dist/locale/zh-cn.mjs";
/**
 * app系统配置
 */
export default {
  /**
   * 系统版本号，自动读取package.json中的version字段
   */
  //所有出现title的地方就用这个，万一后头要换名字方便
  title:'炘火游戏后台管理系统',
  version: appPack.version,

  /**
   * 系统默认语言
   */
  defaultLang: zhCn,

  /**
   * api请求地址，这里读取env环境变量中的VITE_APP_API
   */
  api: import.meta.env.VITE_APP_API,
  baseUrl: import.meta.env.VITE_NODE_ENV === "production" ? "" : "/api",
  //wsUrl: import.meta.env.VITE_NODE_ENV === "production" ? "" : "/socket",
  /**
   * 启用logo图标，logo尺寸32*32，存放路径@/assets/images/logo.png
   */
  enabledLogo: false,

  /**
   * 开启页面缓存
   */
  enabledKeepAlive: true,

  /**
   * 网络请求超时时间，单位毫秒
   */
  requestTimeout: 30000,

  /**
   * 全屏渲染的页面
   */
  fullscreenPages: ["/login", "/"],
};
