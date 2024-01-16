import { createRouter, createWebHistory } from "vue-router";
import Iframe from "@/pages/iframe.vue";
import Error from "@/pages/error.vue";
// const LAYOUT = () => import('@/layouts/index.vue')
//isNavigationMenu菜单是否显示
const baseRoutes = [
  {
    path: "/login",
    name: "Login",
    // meta: {
    //   title: "登录",
    //   keepAlive: true,
    //   requireAuth: false,
    // },
    meta: { title: "登录", isNavigationMenu: false },
    component: () => import("@/pages/login.vue"),
  },
  {
    path: "/",
    name: "Index",
    meta: {
      title: "首页",
      icon: "HomeFilled",
      keepAlive: true,
      requireAuth: true,
    },
    component: () => import("@/pages/home.vue"),
  },
  // {
  //   path: "/user/password",
  //   component: () => import("@/views/sys/user-update-password.vue"),
  //   meta: { title: "修改密码", requiresAuth: true, isNavigationMenu: false },
  // },
  {
    path: "/iframe/:id?",
    component: Iframe,
    meta: { title: "iframe", isNavigationMenu: false },
  },
  {
    path: "/error",
    name: "error",
    component: Error,
    meta: { title: "错误页面", isNavigationMenu: false },
  },
  // {
  //   path: "/:currentPath(.*)*", // 路由未匹配到，进入这个
  //   redirect: (_) => {
  //     return { path: "/404" };
  //   },
  // },
];

export const errorRoute= [
  {
    path: "/:path(.*)*",
    redirect: { path: "/404", query: { to: 404 }, replace: true },
    meta: { isNavigationMenu: false },
  },
];
// const router = createRouter({
//   history: createWebHistory(),
//   routes: baseRoutes,
//   scrollBehavior(to, from, savedPosition) {
//     return {
//       el: "#app",
//       top: 0,
//       behavior: "smooth",
//     };
//   },
// });
// // Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
// // 解决如果退出重新登录，addRoutes异步路由之后，之前的没有删除，又重新加了一边造成重复
// export function resetRouter() {
//   const newRouter = createRouter();
//   router.matcher = newRouter.matcher; // reset router
// }

export default baseRoutes;
