import { useUserStore } from "@/store/modules/user";
import { useAuthStore } from "@/store/modules/auth";
export function RESEETSTORE() {
  const userStore = useUserStore();
  const authStore = useAuthStore();

  userStore.$reset();
  authStore.$reset();
  // 清除用户信息缓存
  localStorage.removeItem("app-user");
}
