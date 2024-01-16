import { defineStore } from "pinia";
// import {  logout } from "@/api";
import { RESEETSTORE } from "@/utils/reset";
export const useAuthStore = defineStore({
  id: "app-auth",
  state: () => ({
    roles: "",
    buttons: [],
    routes:[]
  }),
  actions: {
    // setAuth
    setAuth({buttons, roles, routes}) {
      this.roles = roles;
      this.buttons = buttons;
      this.routes = routes;
    },
    async Logout() {
      // await logout();
      RESEETSTORE();
    },
  },
  // 设置为true，缓存state
  persist: true,
});
