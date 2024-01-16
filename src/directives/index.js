
const has = function (value) {
  let isExist = false;
  const store = useAppStore();
  console.log("store.state.permissions", store.state.permissions);
  let buttonPermStr = store.state.permissions
  if (buttonPermStr === undefined || buttonPermStr === null) {
    return false;
  }
  let buttonPerms = buttonPermStr
  const allPermission = "*:*:*";
  const permissionFlag = value;
  isExist = buttonPerms.some((per) => {
    // return allPermission === per || permissionFlag.includes(per)
    return permissionFlag.includes(per);
  });
  return isExist;
};
import { useAppStore } from "@/store";
export default (app) => { 
  app.directive("has", {
    mounted(el, binging) {
      console.log("elmounted", el.parentNode);
      if (!has(binging.value)) {
        el.parentNode && el.parentNode.removeChild(el);
      }
    },
  });
};

// v-has="['permsCode']"
