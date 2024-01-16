import { useAppStore } from "@/store";
import { getToken } from "@/utils/cache";
import { getBaseRouteToMeta, registerToRouter } from "@/utils/router";
import NProgress from "nprogress";
import "nprogress/nprogress.css";
import { createRouter, createWebHashHistory } from "vue-router";
import baseRoutes, { errorRoute } from "./base";
import emits from "@/utils/emits";
import { EMitt } from "@/constants/enum";
NProgress.configure({ showSpinner: false });
const router = createRouter({
  history: createWebHashHistory(), //createWebHashHistory() hash模式
  routes: baseRoutes,
});
// 路由加载前
router.beforeEach((to, from, next) => {
  //外链
  
  if (to.meta.isNewPage) {
    console.log("外链");
    if (to.query.pop !== "true") {
      next(undefined);
      return false;
    }
  }
  const store = useAppStore();
  //token
  const token = getToken();
  const isPop = to.query.pop === "true"; //新窗口打开内页
  NProgress.start();
  if (to.path !== "/login") {
    if (store.state.routes&&store.state.routes.length) {
      if (to.name === "error") {
        const isMatched = autoRegisterDynamicToRouterAndNext(to);
        if (!isMatched) {
          store.updateState({ appIsRender: true, appIsReady: true });
          next();
        }
      } else {
        if (!to.query.pop) {
          const routeMeta = store.state.routeToMeta[to.path];
          emits.emit(EMitt.OnPushMenuToTabs, {
            label: to.query._mt || routeMeta.title || to.path,
            value: to.fullPath,
            mete: routeMeta,
          });
        }
        store.updateState({ appIsRender: true, appIsReady: true });
        next();
      }
    } else {
      if (token) {
        store.initApp().then((res) => {
          const mergeRoute = baseRoutes.concat(res).concat(errorRoute);
          router.options.routes = mergeRoute;
          registerToRouter(router, mergeRoute);
          if (!to.matched.length) {
            registerDynamicToRouterAndNext({ path: to.path, query: to.query });
          }
          store.updateState({
            appIsReady: true,
            routes: mergeRoute,
            routeToMeta: Object.assign(
              Object.assign({}, store.state.routeToMeta),
              getBaseRouteToMeta(baseRoutes)
            ),
          });       
          setTimeout(() => {
            store.updateState({ appIsRender: true, appIsLogin: true });
          }, 600);
          next(Object.assign(Object.assign({}, to), { replace: true }));
        });
      } else {
        if (isPop) {
          if (!to.matched.length) {
            registerDynamicToRouterAndNext({ path: to.path, query: to.query });
            store.updateState({ appIsRender: true, appIsReady: true });
            next(to.fullPath);
          } else {
            store.updateState({ appIsRender: true, appIsReady: true });
            if (to.meta.requiresAuth) {
              next("/login");
            } else {
              next();
            }
          }
        } else {
          next("/login");
        }
      }
    }
  } else {
    console.log("登录");
    store.updateState({ appIsReady: true, appIsRender: true });
    next();
  }
});
// 路由加载后
router.afterEach(() => {
  NProgress.done();
});
/**
 * 获取系统视图路径映射
 * @returns
 */
export const getSysRouteMap = () => {
  return import.meta.glob("/src/views/**/*.vue");
};
/**
 * 根据路由path转换为系统视图组件路径
 * @param path
 * @returns
 */
export const toSysViewComponentPath = (path) => {
  path = path.replace("_", "-");
  return `/src/views${path}.vue`;
};
/**
 * 自动注册路由
 * @param to
 * @returns
 */
const autoRegisterDynamicToRouterAndNext = (to) => {
  if (to.redirectedFrom) {
    const path = to.redirectedFrom.path;
    const component = matchedSysRouteComponent(path);
    if (component) {
      registerToRouter(router, [
        {
          path: path,
          name: path,
          component,
          redirect: "",
        },
      ]);
      router.push(to.redirectedFrom);
      return true;
    }
  }
  return false;
};
/**
 * 寻找视图组件
 * @param path
 * @returns
 */
const matchedSysRouteComponent = (path) => {
  const sysRouteMap = getSysRouteMap();
  const component = sysRouteMap[toSysViewComponentPath(path)];
  if (!component) {
    console.error("实时注册动态路由失败，未找到组件路径", path);
  }
  return component;
};
/**
 * 实时注册动态路由并直接跳转过去
 * @param route
 */
export const registerDynamicToRouterAndNext = (route) => {
  const component = matchedSysRouteComponent(route.path);
  const newRoute = {
    path: route.path,
    name: route.path,
    component,
    redirect: !component
      ? { path: "/error", query: { to: 404 }, replace: true }
      : "",
  };
  registerToRouter(router, [newRoute]);
  router.push(route);
};
export default router;
