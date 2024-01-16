import { CacheToken } from "@/constants/cacheKey";
import { getSysRouteMap } from "@/router";
import http from "@/config/http";
import { removeCache } from "@/utils/cache";
import { mergeServerRoute } from "@/utils/router";
import { defineStore } from "pinia";

export const useAppStore = defineStore(
  "useAppStore",
  {
    state: () => ({
      state: {
        appIsLogin: false, //是否登录
        appIsReady: false, //app数据是否就绪
        appIsRender: false, //app是否开始渲染内容
        permissions: [], //权限集合
        user: {
          createDate: "",
          deptId: "",
          deptName: "",
          email: "",
          gender: 0,
          headUrl: "",
          id: "",
          mobile: "",
          postIdList: "",
          realName: "",
          roleIdList: "",
          status: 0,
          superAdmin: 0,
          username: "",
        }, //用户信息
        dicts: [], //字典
        routes: [], //最终的路由集合
        menus: [], //菜单集合
        routeToMeta: {}, //url对应标题meta信息
        tabs: [], //tab标签页集合
        activeTabName: "", //tab当前焦点页
        closedTabs: [], //存储已经关闭过的tab
      },
    }),
    actions: {
      updateState(data) {
        Object.keys(data).forEach((x) => {
          this.state[x] = data[x];
        });
      },
      initApp() {
        return Promise.all([
          http.get("/sys/menu/nav"), //加载菜单
          // baseService.get("/sys/menu/permissions"), //加载权限
          // baseService.get("/sys/user/info"), //加载用户信息
          // baseService.get("/sys/dict/type/all") //加载字典
        ]).then(([menus, permissions, user, dicts]) => {
          //openStyle===1全屏
          const [routes, routeToMeta] = mergeServerRoute(
            [
             
              {
                url: "model",
                name: "车",
                id: "004",
                openStyle: 0,
                icon: false,
                children: [
                  {
                    url: "model/index",
                    name: "车01",
                    openStyle: 0,
                    icon: "Document",
                    id: "0041",
                  },
                  {
                    url: "model/kate",
                    name: "车02",
                    openStyle: 0,
                    icon: "Document",
                    id: "0042",
                  },
                ],
              },
              {
                url: "sys",
                name: "系统管理",
                id: "005",
                openStyle: 0,
                icon: false,
                children: [
                  {
                    url: "sys/index",
                    name: "字典管理",
                    openStyle: 0,
                    icon: "Document",
                    id: "0051",
                  },
                  {
                    url: "sys/menu",
                    name: "菜单管理",
                    openStyle: 0,
                    icon: "Document",
                    id: "0052",
                  },
                  {
                    url: "sys/role",
                    name: "角色管理",
                    openStyle: 0,
                    icon: "Document",
                    id: "0053",
                  },
                  {
                    url: "sys/user",
                    name: "用户管理",
                    openStyle: 0,
                    icon: "Document",
                    id: "0054",
                  },
                  {
                    url: "sys/logs",
                    name: "日志管理",
                    openStyle: 0,
                    icon: "Document",
                    id: "0055",
                  },
                ],
              },
            ],
            getSysRouteMap()
          );
          console.log("routes", routes);
          console.log("routeToMeta", routeToMeta);
          this.updateState({
            permissions: [],
            user: {},
            dicts: [
              {
                dictType: "type1",
                dataList: [
                  { dictLabel: "甲", dictValue: "0" },
                  { dictLabel: "乙", dictValue: "1" },
                  { dictLabel: "丙", dictValue: "2" },
                  { dictLabel: "丁", dictValue: "3" },
                ],
              },
              {
                dictType: "type2",
                dataList: [
                  { dictLabel: "哇哈哈哈", dictValue: "10" },
                  { dictLabel: "喜之郎", dictValue: "11" },
                  { dictLabel: "冰棒", dictValue: "12" },
                  { dictLabel: "哈尔滨", dictValue: "13" },
                ],
              },
            ],
            routeToMeta: routeToMeta || {},
            menus: [],
          });
          return new Promise((re, le) => {
            re(routes);
            return routes;
          });
        });
        // return Promise.all([
        //   baseService.get("/sys/menu/nav"), //加载菜单
        //   baseService.get("/sys/menu/permissions"), //加载权限
        //   baseService.get("/sys/user/info"), //加载用户信息
        //   baseService.get("/sys/dict/type/all") //加载字典
        // ]).then(([menus, permissions, user, dicts]) => {
        // // if (user.code !== 0) {
        // //   console.error("初始化用户数据错误", user.msg);
        // // }
        // const [routes, routeToMeta] = mergeServerRoute(menus.data || [], getSysRouteMap());
        // this.updateState({
        //   permissions: permissions.data || [],
        //   user: user.data || {},
        //   dicts: dicts.data || [],
        //   routeToMeta: routeToMeta || {},
        //   menus: []
        // });
        // return new Promise(() => {
        //   return routes;
        // });

        //  });
      },
      //退出
      logout() {
        removeCache(CacheToken, true);
        this.updateState({
          appIsLogin: false,
          permissions: [],
          user: {},
          dicts: [],
          menus: [],
          routes: [],
          tabs: [],
          activeTabName: "",
        });
      },
    },
  },
  { persist: true }
);
