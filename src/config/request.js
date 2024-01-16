import axios from "axios";
import app from "@/constants/app";
import router from "@/router";
import qs from "qs";
import { getToken } from "@/utils/cache";
import { ElNotification } from "element-plus";
var instance = axios.create({
  timeout: app.requestTimeout,
  baseURL: app.baseUrl,
});

// 添加请求拦截器
instance.interceptors.request.use(
  function (config) {
    config.headers["X-Requested-With"] = "XMLHttpRequest";
    config.headers["Content-Type"] = "application/json;charset=UTF-8";
    config.headers["Request-Start"] = new Date().getTime();
    const token = getToken();
    // 请求头添加token
    if (token) {
      //config.headers.token = token;
      config.headers.authorization = token;
    }
    // // if (config.method?.toUpperCase() === "GET") {
    // //   config.params = { ...config.params, _t: new Date().getTime() };
    // // }
    if (
      Object.values(config.headers).includes(
        "application/x-www-form-urlencoded"
      )
    ) {
      config.data = qs.stringify(config.data);
    }
    return config;
  },
  function (error) {
    return Promise.reject(error);
  }
);

// 响应拦截器即异常处理
instance.interceptors.response.use(
  (response) => {
    //约定为200//0  下载的code需要约定一下
    if (
      response.data.code === 0 ||
      response.data.code === 200 ||
      !response.data.code
    ) {
      return response;
    }
    if (response.data.code === 401) {
      //自定义业务状态码
      redirectLogin();
    }
    return Promise.reject(response.data);
  },
  (err) => {
    const status = err.response.status;
    const httpCodeLabel = {
      400: "请求参数错误",
      401: "未授权，请登录",
      403: "拒绝访问",
      404: `请求地址出错: ${err.response.config.url}`,
      408: "请求超时",
      500: "API接口报500错误",
      501: "服务未实现",
      502: "网关错误",
      503: "服务不可用",
      504: "网关超时",
      505: "HTTP版本不受支持",
    };
    if (err && err.response) {
    } else {
      if (error.config.noTimeoutTip) {
        return Promise.resolve(error.response);
      } else if (JSON.stringify(error).includes("timeout")) {
        err.message = "连接服务器失败";
      }
    }
    if (status === 401) {
      redirectLogin();
    }
    err.message=httpCodeLabel[status]
    return Promise.reject(err);
  }
);
const redirectLogin = () => {
  router.replace("/login");
  return;
};
function handleErrByCode({ code, msg, message }) {

  
  ElNotification.error({
    message: msg || message,
  });
  // 1107 "获取登录用户信息失败"
  // 1014无对应方法权限--不应该退出登录，暂从errCode剔除
  const errCode = [1011, 1012, 1013, 1107, 401];
  if (errCode.includes(code)) {
    // store.dispatch('fedLogOut').catch(() => {})
    setTimeout(() => {
      window.location.reload();
    }, 10);
  } else {
    // 其他处理
  }
}
export default (o)=> {
  return new Promise((resolve, reject) => {
    instance(o)
      .then((res) => {
        return resolve(res);
      })
      .catch((error) => {
        handleErrByCode(error);
        reject(error);
      });
  });
};


