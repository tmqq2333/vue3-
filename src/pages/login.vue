<template>
  <div class="rr-login">
    <div class="rr-login-left hidden-sm-and-down">
      <p class="rr-login-left-title">{{ title }}</p>
      <p class="rr-login-left-en"><em>{{ 'Background management system' }}</em></p>
    </div>
    <div class="rr-login-wrap">
      <div class="rr-login-right">
        <div class="rr-login-right-main">
          <h4 class="rr-login-right-main-title">登录</h4>
          <el-form
            ref="formRef"
            label-width="80px"
            :status-icon="true"
             class="rr-login-from"
            :model="login"
            :rules="rules"
            @keyup.enter="onLogin"
          >
            <el-form-item label-width="0" prop="username">
              <el-input
                v-model="login.username"
                placeholder="用户名"
                prefix-icon="user"
                autocomplete="off"
              ></el-input>
            </el-form-item>
            <el-form-item label-width="0" prop="password">
              <el-input
                placeholder="密码"
                v-model="login.password"
                prefix-icon="lock"
                autocomplete="off"
                show-password
              ></el-input>
            </el-form-item>
            <!-- <el-form-item label-width="0" prop="captcha">
              <el-space class="rr-login-right-main-code">
                <el-input v-model="login.captcha" placeholder="验证码" prefix-icon="first-aid-kit"></el-input>
                <img style="vertical-align: middle; height: 40px; cursor: pointer" :src="state.captchaUrl" @click="onRefreshCode" alt="" />
              </el-space>
            </el-form-item> -->
            <el-form-item label-width="0">
              <el-button
                type="primary"
                size="small"
                :disabled="state.loading"
                @click="onLogin"
                class="rr-login-right-main-btn"
              >
                登录
              </el-button>
            </el-form-item>
          </el-form>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { onMounted, reactive, ref } from "vue";
import axios from "@/config/http";
import { CacheToken } from "@/constants/cacheKey";
import { setCache } from "@/utils/cache";
import { ElNotification } from "element-plus";
// import { getUuid } from "@/utils/utils";
import app from "@/constants/app";
// import SvgIcon from "@/components/base/svg-icon/index";
import { useAppStore } from "@/store";
import { useRouter } from "vue-router";
const title = app.title;
const store = useAppStore();
const router = useRouter();

const state = reactive({
  captchaUrl: "",
  loading: false,
  year: new Date().getFullYear(),
});

const login = reactive({ username: "", password: "", captcha: "", uuid: "" });

onMounted(() => {
  //清理数据
  store.logout();
  // getCaptchaUrl();
});
const formRef = ref();

const rules = ref({
  username: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  password: [{ required: true, message: "必填项不能为空", trigger: "blur" }],
  // captcha: [{ required: true, message: "必填项不能为空", trigger: "blur" }]
});

// const getCaptchaUrl = () => {
//   login.uuid = getUuid();
//   state.captchaUrl = `${app.api}/captcha?uuid=${login.uuid}`;
// };

// const onRefreshCode = () => {
//   getCaptchaUrl();
// };

const onLogin = () => {
  formRef.value.validate((valid) => {
    if (valid) {
      state.loading = true;
      axios
        .get("/data", login)
        .then(({ data }) => {
          console.log("data", data);
          setCache(CacheToken, data[0].token, true);
          ElNotification.success("登录成功");
          router.push("/");
        })
        .catch(() => {
          state.loading = false;
        });
      // baseService
      //   .post("/api/login", login)
      //   .then((res) => {
      //     state.loading = false;
      //     if (res.code === 0) {
      //       setCache(CacheToken, res.data, true);
      //       ElMessage.success("登录成功");
      //       router.push("/");
      //     } else {
      //       ElMessage.error(res.msg);
      //     }
      //   })
      //   .catch(() => {
      //     state.loading = false;
      //     // onRefreshCode();
      //   });
    }
  });
};
</script>

<style lang="scss" scoped>
/* @import url('@/assets/styles/theme/base.scss'); todo:引入总出问题*/
.rr-login-from::v-deep .el-input__wrapper{
 background-color:rgba(#0069a7,.3);
 box-shadow: 0 0 0 1px #5DC2FE inset;
 .el-input__inner{
   color:#fff
 }
}
.rr-login {
  width: 100vw;
  height: 100vh;
  //background: #019ec4;
  background: url("@/assets/images/background-login.png") no-repeat;
  background-size: 100% 100%;
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  &-wrap {
    margin: 0 auto;
    width: 500px;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    background: url("@/assets/images/panel.png") no-repeat;
    background-size: 100% 100%;
    box-shadow: -4px 5px 10px rgba(0, 0, 0, 0.4);
    animation-duration: 1s;
    animation-fill-mode: both;
    border-radius: 5px;
    overflow: hidden;
  }

  &-left {
    position: absolute;
    top:120px;
    justify-content: center;
    flex-direction: column;
    height: 60px;
    background-image: linear-gradient(to bottom, #ffffff 0%,#ffffff 40%, #008cff 100%);
    background-clip: text; // 只有文字部分才显示背景色
    -webkit-background-clip: text; // 浏览器兼容性
    //float: left;
    //width: 100%;
    //padding-bottom: 20px;
    &-title {
      text-align: center;
      font-weight: 600;
      -webkit-text-fill-color: transparent;
      letter-spacing: 2px;
      font-size: 40px;
    }
    &-en{
      color:#054e8a;
       font-size: 19px;
       text-align: center;
    }
  }

  &-right {
    /* background: linear-gradient(to left, #77B4F2, #77B4F2) left top no-repeat,
      linear-gradient(to bottom, #77B4F2, #77B4F2) left top no-repeat,
      linear-gradient(to left, #77B4F2, #77B4F2) right top no-repeat,
      linear-gradient(to bottom, #77B4F2, #77B4F2) right top no-repeat,
      linear-gradient(to left, #77B4F2, #77B4F2) left bottom no-repeat,
      linear-gradient(to bottom, #77B4F2, #77B4F2) left bottom no-repeat,
      linear-gradient(to left, #77B4F2, #77B4F2) right bottom no-repeat,
      linear-gradient(to left, #77B4F2, #77B4F2) right bottom no-repeat;
    background-size: 2px 30px, 30px 2px, 2px 30px, 30px 2px;
    background-color:rgba($color: #fff, $alpha: .1); */
    //border-left: none;
    color: #fff;
    //background-color: #fff;
    width: 100%;
    //float: left;

    &-main {
      margin: 0 auto;
      width: 80%;
      &-title {
        color: #6596d0;
        margin-bottom: 40px;
        font-weight: 500;
        font-size: 24px;
        text-align: center;
        letter-spacing: 4px;
      }

      &-lang .iconfont {
        font-size: 20px;
        color: #606266;
        font-weight: 800;
        width: 20px;
        height: 20px;
      }

      .el-input__inner {
        border-width: 0;
        border-radius: 0;
        border-bottom: 1px solid #dcdfe6;
      }

      &-code {
        width: 100%;
        .el-space__item:first-child {
          flex: 1;
        }
      }
      &-btn {
        width: 100%;
        height: 45px;
        font-size: 18px !important;
        letter-spacing: 2px;
        font-weight: 300 !important;
        cursor: pointer;
        margin-top: 30px;
        font-family: neo, sans-serif;
        transition: 0.25s;
      }
    }
  }

  .login-footer {
    text-align: center;
    position: absolute;
    bottom: 0;
    padding: 20px;
    color: rgba(255, 255, 255, 0.6);
    p {
      margin: 10px 0;
    }
    a {
      padding: 0 5px;
      color: rgba(255, 255, 255, 0.6);
      &:focus,
      &:hover {
        color: #fff;
      }
    }
  }

  &-right {
    position: relative;
    min-height: 360px;
    align-items: center;
    display: flex;
  }

  @keyframes animate-down {
    0%,
    60%,
    75%,
    90%,
    to {
      animation-timing-function: cubic-bezier(0.215, 0.61, 0.355, 1);
    }
    0% {
      opacity: 0;
      transform: translate3d(0, -3000px, 0);
    }
    60% {
      opacity: 1;
      transform: translate3d(0, 25px, 0);
    }
    75% {
      transform: translate3d(0, -10px, 0);
    }
    90% {
      transform: translate3d(0, 5px, 0);
    }
    to {
      transform: none;
    }
  }

  .animate-down {
    animation-name: animate-down;
  }
}
</style>
