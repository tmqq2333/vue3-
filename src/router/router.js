import store from "@/store/index";
import router from "./index";
import NProgress from "nprogress"; // progress bar
import "nprogress/nprogress.css"; // progress bar style
let LOGIN_URL='/'

router.beforeEach(async (to, from, next) => {
  NProgress.start()

  const userStore = useUserStore()
  // 1.判断是访问登陆页，有 Token 就在当前页面，没有 Token 重置路由并放行到登陆页
  if (to.path === LOGIN_URL) {
    if (userStore.token) return next(from.fullPath)
    return next()
  }

  // 2.判断访问页面是否在路由白名单(不需要登陆)地址中，如果存在直接放行
  if (ROUTER_WHITE_LIST.includes(to.path)) return next()

  // 3.判断是否有 Token，没有token跳转到登陆页面并且携带原目标路径
  if (!userStore.token) {
    return next({ path: LOGIN_URL, query: { redirect: to.fullPath } })
  }
  
  const authStore = useAuthStore()
  authStore.setRouteName(to.name)
  // 4.如果没有菜单列表，就重新请求菜单列表并添加动态路由
  if (!authStore.authRouterList.length) {
    await initDynamicRouter()
    return next({ ...to, replace: true })
  }
  // 5.上述条件都不满足，直接放行
  return next()
})