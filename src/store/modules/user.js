import { defineStore } from 'pinia'
// import { getUserInfo, logout } from '@/api'
import { useAuthStore } from './auth'
import { RESEETSTORE } from '@/utils/reset'
export const useUserStore = defineStore({
  id: 'app-user',
  state: () => ({
    token: '',
    userInfo: null,
  }),
  actions: {
    // setToken
    setToken(token) {
      this.token = token
    },
    // setUserInfo
    setUserInfo(userInfo) {
      this.userInfo = userInfo
    },
   async GetInfoAction(userData) {
      //const result = await getUserInfo(userData);
      const { avatar, buttons, name, roles, routes } = result.data;
      const authStore = useAuthStore()
      // 存储用户信息
      this.setUserInfo({ avatar, name })
      // 存储用户权限信息
      authStore.setAuth({ buttons, roles, routes })
    },
    // async Logout() {
    //   await logout()
    //   RESEETSTORE()
    // },
  },
  // 设置为true，缓存state
  persist: true,
})