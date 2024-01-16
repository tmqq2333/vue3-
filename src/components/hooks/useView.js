import { EMitt, EThemeSetting } from "@/constants/enum";
import { registerDynamicToRouterAndNext } from "@/router";
import baseService from "@/config/http";
import emits from "@/utils/emits";
import { DownloadExcel } from "@/utils/utils";
import { getThemeConfigCacheByKey } from "@/utils/theme";
import { getDictLabel as getUtilDictLabel } from "@/utils/utils";
import { onActivated, onMounted } from "vue";
import { useRouter, useRoute } from "vue-router";
import { useAppStore } from "@/store";
import { ElNotification, ElMessageBox } from "element-plus";
/**
 * 通用视图业务逻辑（列表/增删改查基本业务）
 * @param props 自定义通用业务state
 * @returns 返回响应式自定义state和通用方法
 */
const useView = (props) => {
  const router = useRouter();
  const route = useRoute();
  const store = useAppStore();
  const defaultOptions = {
    maxHeight: 600,
    sizes: [10, 20, 50, 100],
    createdIsNeed: true,
    activatedIsNeed: false,
    getDataListURL: "",
    getDataListIsPage: true,
    deleteURL: "",
    deleteIsUrl: false, //是否删除在url上
    deleteIsBatch: false, //是否多个删除
    deleteIsBatchKey: "key",
    exportURL: "",
    dataForm: {},
    dataList: [],
    order: "",
    orderField: "",
    page: 1,
    limit: 10,
    total: 0,
    dataListLoading: false,
    dataListSelections: [],
    elTable: {},
  };
  const mergeDefaultStateToPageState = (options, props) => {
    for (const key in options) {
      if (!Object.getOwnPropertyDescriptor(props, key)) {
        props[key] = options[key];
      }
    }
    return props;
  };
  const state = mergeDefaultStateToPageState(defaultOptions, props);
  onMounted(() => {
    if (state.createdIsNeed && !state.activatedIsNeed) {
      viewFns.query();
    }
  });
  onActivated(() => {
    if (store.state.closedTabs.includes(store.state.activeTabName)) {
      //如果当前打开的tab页面是之前已经关闭过的会存在keep-alive缓存
      //这里采用临时刷新页面解决方案
      //待vue官方开放缓存策略后再行实现 https://github.com/vuejs/vue-next/pull/4339   https://github.com/vuejs/rfcs/pull/284
      const closedTabs = store.state.closedTabs;
      store.updateState({
        closedTabs: closedTabs.filter((x) => x !== store.state.activeTabName),
      });
      emits.emit(EMitt.OnReloadTabPage);
    }
    if (state.activatedIsNeed) {
      viewFns.query();
    }
  });
  //
  const rejectFns = {
    // hasPermission(key) {
    //   return checkPermission(store.state.permissions, key);
    // },
    getDictLabel(dictType, dictValue) {
      return getUtilDictLabel(store.state.dicts, dictType, dictValue);
    },
  };
  //
  const viewFns = {
    // 获取数据列表
    query() {
      if (!state.getDataListURL) {
        return;
      }
      state.dataListLoading = true;
      baseService
        .get(
          state.getDataListURL,
          Object.assign(
            {
              // order: state.order,
              // orderField: state.orderField,
              page: state.getDataListIsPage ? state.page : null,
              limit: state.getDataListIsPage ? state.limit : null,
            },
            state.dataForm
          )
        )
        .then((res) => {
          state.dataListLoading = false;
          state.dataList = res.data;
          //state.dataList = state.getDataListIsPage ? res.data.list : res.data;
          state.total = state.getDataListIsPage ? res.count : 0;
        })
        .catch(() => {
          state.dataListLoading = false;
        });
    },
    // 多选
    dataListSelectionChangeHandle(val) {
      state.dataListSelections = val;
    },
    // 排序
    dataListSortChangeHandle(data) {
      if (!data.order || !data.prop) {
        state.order = "";
        state.orderField = "";
        return false;
      }
      state.order = data.order.replace(/ending$/, "");
      state.orderField = data.prop.replace(/([A-Z])/g, "_$1").toLowerCase();
      viewFns.query();
    },
    // 分页, 每页条数
    pageSizeChangeHandle(val) {
      state.page = 1;
      state.limit = val;
      viewFns.query();
    },
    // 分页, 当前页
    pageCurrentChangeHandle(val) {
      state.page = val;
      viewFns.query();
    },
    //搜索
    getDataList() {
      state.page = 1;
      viewFns.query();
    },
    //新增删除
    addOrUpdateHandle(id) {
      if (state.addOrUpdateRef) {
        console.log("state.addOrUpdateRef", state.addOrUpdateRef);
        
        state.addOrUpdateRef.value.init(id);}
    },
    // 删除
    deleteHandle(id) {
      return new Promise((resolve, reject) => {
        if (
          state.deleteIsBatch &&
          !id &&
          state.dataListSelections &&
          state.dataListSelections.length <= 0
        ) {
          ElNotification.warning({
            message: "请选择操作项",
            duration: 500,
          });
          return;
        }
        ElMessageBox.confirm("确定进行[删除]操作?", "提示", {
          confirmButtonText: "确定",
          cancelButtonText: "取消",
          type: "warning",
        })
          .then(() => {
            console.log(
              "state.deleteURL",
              `${state.deleteURL}${
                !state.deleteIsBatch && state.deleteIsUrl ? "/" + id : ""
              }`
            );
            baseService
              .post(
                `${state.deleteURL}${
                  !state.deleteIsBatch && state.deleteIsUrl ? "/" + id : ""
                }`,
                state.deleteIsBatch
                  ? id
                    ? [id]
                    : state.dataListSelections
                    ? state.dataListSelections.map(
                        (item) =>
                          state.deleteIsBatchKey && item[state.deleteIsBatchKey]
                      )
                    : {}
                  : state.deleteIsUrl
                  ? {}
                  : { [state.deleteIsBatchKey]: id }
              )
              .then((res) => {
                ElNotification.success({
                  message: "成功",
                  duration: 500,
                  onClose: () => {
                    viewFns.query();
                    resolve(true);
                  },
                });
              });
          })
          .catch((res) => {
            //
            console.log("res", res);
          });
      });
    },
    // 导出
    exportHandle() {
      // window.location.href = `${app.api}${state.exportURL}?${qs.stringify(
      //   Object.assign(Object.assign({}, state.dataForm), { token: getToken() })
      // )}`;
      if (!state.exportURL) {
        console.error("亲亲~忘了导出的url了哟~");
      }
      baseService
        .download(state.exportURL, {
          ...state.dataForm,
        })
        .then((res) => {
          DownloadExcel(res);
        });
    },
    //关闭当前窗口
    closeCurrentTab() {
      if (getThemeConfigCacheByKey(EThemeSetting.OpenTabsPage)) {
        emits.emit(EMitt.OnCloseCurrTab);
      } else {
        router.replace("/");
      }
    },
    // // 处理流程路由
    // handleFlowRoute(data) {
    //   const routeParams = {
    //     path: `/flow/task-form`,
    //     query: {
    //       taskId: data.taskId,
    //       processInstanceId: data.processInstanceId,
    //       processDefinitionId: data.processDefinitionId,
    //       showType: "taskHandle",
    //       _mt: `${route.meta.title} - ${data.processDefinitionName}`,
    //     },
    //   };
    //   registerDynamicToRouterAndNext(routeParams);
    // },
    // 查看流程详情
    // flowDetailRoute(data) {
    //   const routeParams = {
    //     path: `/flow/task-form`,
    //     query: {
    //       taskId: data.taskId,
    //       processInstanceId: data.processInstanceId,
    //       processDefinitionId: data.processDefinitionId,
    //       showType: "detail",
    //       _mt: `${route.meta.title} - ${data.processDefinitionName}`,
    //     },
    //   };
    //   registerDynamicToRouterAndNext(routeParams);
    // },
  };
  //
  return Object.assign(Object.assign({}, viewFns), rejectFns);
};
export default useView;
