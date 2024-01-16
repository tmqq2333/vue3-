import { themeSetting } from "@/constants/config";
import { CacheTheme } from "@/constants/cacheKey";
import { EMitt } from "@/constants/enum";
import { getCache, setCache } from "./cache";
import emits from "./emits";
import chalkCss from "element-plus/theme-chalk/index.css?inline";

/**
 * 取主题设置缓存
 * @returns
 */
export const getThemeConfigCache = () => {
  const cache = getCache(CacheTheme, {}, {});
  return { ...themeSetting, ...cache };
};

/**
 * 取主题设置缓存
 * @param key
 * @param config
 * @returns
 */
export const getThemeConfigCacheByKey = (
  key,
  config
)=> {
  config = config || getCache(CacheTheme, {}, {});
  return config ? config[key] ?? themeSetting[key] : themeSetting[key];
};

/**
 * 生成主题设置样式名称
 * @param config
 * @returns
 */
export const getThemeConfigToClass = (config={})=> {
  const cl= {};
  Object.keys(config).forEach((x) => {
    cl[x] = `ui-${x}-${config[x]}`;
  });
  return cl;
};

/**
 * 主题设置到缓存
 * @param key
 * @param value
 */
export const setThemeConfigToCache = (
  key,
  value
) => {
  const theme = getCache(CacheTheme, {}, {});
  setCache(CacheTheme, { ...theme, [key]: value });
};

/**
 * 设置主题色
 * @param key
 * @param value
 */
export const setThemeColor = (key, value) => {
  const elm = window.document.querySelector("body");
  let color=key.split('-').includes('color')
  console.log("color", color, key.split("-"));
  
  if (elm) {
    elm.style.setProperty(key, value);
    if (color){ 
      elm.style.setProperty(key + "-light", value + "14");
    }
  }
};

/**
 * 生成主题色
 * @param theme
 * @returns 根据主题色生成12个样色
 */
export const getThemeCluster = (theme)=> {
  const tintColor = (color, tint) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    if (tint === 0) {
      // when primary color is in its rgb space
      return [red, green, blue].join(",");
    } else {
      red += Math.round(tint * (255 - red));
      green += Math.round(tint * (255 - green));
      blue += Math.round(tint * (255 - blue));

      red = red.toString(16);
      green = green.toString(16);
      blue = blue.toString(16);

      return `#${red}${green}${blue}`;
    }
  };

  const shadeColor = (color, shade) => {
    let red = parseInt(color.slice(0, 2), 16);
    let green = parseInt(color.slice(2, 4), 16);
    let blue = parseInt(color.slice(4, 6), 16);

    red = Math.round((1 - shade) * red);
    green = Math.round((1 - shade) * green);
    blue = Math.round((1 - shade) * blue);

    red = red.toString(16);
    green = green.toString(16);
    blue = blue.toString(16);

    return `#${red}${green}${blue}`;
  };
  const clusters = [theme];
  for (let i = 0; i <= 9; i++) {
    clusters.push(tintColor(theme, Number((i / 10).toFixed(2))));
  }
  clusters.push(shadeColor(theme, 0.1)); 
  return clusters;
};

/**
 * 获取主题css
 * @param url
 * @param callback
 * @param variable
 */
export const getCSSString = (callback, variable) => {
  if (variable) {
    window[variable] = chalkCss;
  }
  callback(chalkCss);
};

export const updateStyle = (style, oldCluster, newCluster) => {
  let newStyle = style;
  console.log("newCluster", newCluster);
  
  oldCluster.forEach((color, index) => {
    newStyle = newStyle.replace(new RegExp(color, "ig"), newCluster[index]);
  });
  return newStyle;
};

/**
 * 更新主题色
 * @param themeColor
 * @param val
 * @returns
 */
export const updateTheme = (val) => {
  emits.emit(EMitt.OnLoading, true);
  const head = document.getElementsByTagName("head")[0];
  const themeCluster = getThemeCluster(val.replace("#", ""));
  const getHandler = (variable, id) => {
    return () => {
      const originalCluster = getThemeCluster("#409eff".replace("#", ""));
      const newStyle = updateStyle(window[variable], originalCluster, themeCluster);
      let styleTag = document.getElementById(id);
      if (!styleTag) {
        styleTag = document.createElement("style");
        styleTag.setAttribute("id", id);
        head.appendChild(styleTag);  
      }
      styleTag.innerText = newStyle;
      emits.emit(EMitt.OnLoading, false);
    };
  };
  const chalkHandler = getHandler("__chalk", "chalk-style");
  if (!window["__chalk"]) {
    getCSSString(chalkHandler, "__chalk");
  } else {
    chalkHandler();
  }
};
