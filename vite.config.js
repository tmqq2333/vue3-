import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import * as path from "path";
import { visualizer } from "rollup-plugin-visualizer";
import viteCompression from "vite-plugin-compression";
import { loadEnv } from "vite";
import {
  createStyleImportPlugin,
  ElementPlusResolve,
} from "vite-plugin-style-import";
import vueJsx from '@vitejs/plugin-vue-jsx'
// https://vitejs.dev/config/
export default defineConfig(({ mode, command }) =>{
 const env = loadEnv(mode, process.cwd());
 const { VITE_APP_ENV, VITE_APP_API } = env;
 let publicPath = VITE_APP_ENV==='production' ? "./" : "/";
  return {
    base: publicPath,
    resolve: {
      //设置别名
      alias: {
        "@": path.resolve(__dirname, "src"),
      },
    },
    plugins: [
      vue(),vueJsx(),
      createStyleImportPlugin({
        resolves: [ElementPlusResolve()],
        libs: [
          // 如果没有你需要的resolve，可以在lib内直接写，也可以给我们提供PR
          {
            libraryName: "element-plus",
            esModule: true,
            resolveStyle: (name) => {
              return `element-plus/lib/theme-chalk/${name}.css`;
            },
            ensureStyleFile: true, // 忽略文件是否存在, 导入不存在的CSS文件时防止错误。
          },
        ],
      }),
    ],
    build: {
      esbuild: {
        drop: ["console", "debugger"],
      },
      chunkSizeWarningLimit: 1024,
      commonjsOptions: {
        include: /node_modules|lib/,
      },
      rollupOptions: {
        output: {
          manualChunks: {
            lodash: ["lodash"],
            vlib: ["vue", "vue-router", "element-plus"],
          },
          manualChunks(id) {
            if (id.includes("node_modules")) {
              // 让每个插件都打包成独立的文件
              return id
                .toString()
                .split("node_modules/")[1]
                .split("/")[0]
                .toString();
            }
          },
          //以函数的形式使用
          // * 将第三方包全部打包在一个chunk中，名称叫 vendor
          //  manualChunks(id, { getModuleInfo, getModuleIds }) {
          //   if (id.includes('node_modules')) {
          //     return 'vendor';
          //   }
          // },
          chunkFileNames: "js/[name]-[hash].js", // 引入文件名的名称
          entryFileNames: "js/[name]-[hash].js", // 包的入口文件名称
          assetFileNames: "[ext]/[name]-[hash].[ext]", // 资源文件像 字体，图片等
        },
        //  告诉打包工具 在external配置的 都是外部依赖项  不需要打包
        external: ["vue", "element-plus", "echarts"],
        plugins: [
          //不打包，针对映射CDN内容
          // externalGlobals({
          //   vue: 'Vue',
          //   'element-plus': 'ElementPlus',
          //   echarts: 'echarts',
          //   'vue-demi': 'VueDemi'
          // }),
          visualizer({ open: true }),
          //因为浏览器解压也需要时间，所以代码体积不是很大的话不建议使用 gzip 压缩
          viteCompression({
            verbose: true, // 是否在控制台中输出压缩结果
            disable: false,
            threshold: 10240, // 如果体积大于阈值，将被压缩，单位为b，体积过小时请不要压缩，以免适得其反
            algorithm: "gzip", // 压缩算法，可选['gzip'，' brotliccompress '，'deflate '，'deflateRaw']
            ext: ".gz",
            deleteOriginFile: false, // 源文件压缩后是否删除
          }),
        ],
      },
    },
    server: {
      // hmr: {
      //   overlay: false,
      //   //host: "0.0.0.0",
      //   //host: "127.0.0.1",
      //   //   port: 8080,
      // },
      // 设置 https 代理
      //port: 4000, // 设置服务启动端口号
      open: true, // 设置服务启动时是否自动打开浏览器
      //cors: true, // 允许跨域
      proxy: {
        "/api": {
          target: VITE_APP_API,
          changeOrigin: true,
          rewrite: (path) => path.replace(/^\/api/, ""),
        },
      },
    },
  };
});
