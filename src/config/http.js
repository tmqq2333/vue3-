import request from "./request";
export default {
  /**
   * 删除
   * @param path
   * @param params
   * @returns
   */
  delete(url, params) {
    return request({
      url,
      data: params,
      method: "DELETE",
    });
  },
  /**
   * 下载
   * @param path
   * @param body
   * @returns
   */
  download(url, params, options = {}) {
    return new Promise((resolve, reject) => {
      request({
        url,
        params,
        responseType: "blob",
        options,
        method: "GET",
      })
        .then(resolve)
        .catch(reject);
    });
  },
  get(url, params, options = {}) {
    return new Promise((resolve, reject) => {
      request({
        url,
        params,
        options,
        method: "GET",
      })
        .then((res) => resolve(res.data))
        .catch(reject);
    });
  },
  put(url, params, options) {
    return request({
      url,
      data: params,
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...options,
      },
      method: "PUT",
    });
  },
  /**
   * 通用post方法
   * @param path
   * @param body
   * @returns
   */
  post(url, body, headers) {
    return request({
      url,
      method: "POST",
      headers: {
        "Content-Type": "application/json;charset=UTF-8",
        ...headers,
      },
      data: body,
    });
  },
};
