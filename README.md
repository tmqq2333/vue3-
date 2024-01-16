#### 脚手架版本:
 *vite 4.0
 
 #### 用到vue相关的生态链模块:
  * `vue3`
  * `vue-router`
  * `axios`

 ##### 库:
  * `pinia` 持久化store
  * `sass` css
  * `mitt` 轻量级
  * `lodash` 目前全引入，后续考虑优化
  * `element-plus` 

 ##### 地址修改:
  * `development` .env.development----请改为自己的apifox/真实后端开发环境的地址
  * `production` .env.production

 ##### 目录结构:
  ```
  App.vue 
    │  main.js
    │  
    ├─api
    │          
    ├─assets
    │  ├─images                     公共图片
    │  │     logo.png
    │  │      
    │  └─styles                     公共样式
    │      │  app.scss              *重点这个
    │      │  base.scss
    │      │  element.scss
    │      │  global.scss
    │      │  index.scss
    │      │  
    │      ├─css                    需要单独引入页面的样式
    │      │      header.scss  
    │      │      
    │      └─theme  主题样式
    │              base.scss        公共定义变量
    │              index.scss
    │              mobile.scss
    │              
    ├─components                      公共组件
    │          
    ├─config                          http相关
    │      http.js
    │      request.js
    │      
    ├─constants                       变量相关，减少固定绑定
    │      app.js
    │      cacheKey.js
    │      config.js                 
    │      enum.js
    │      
    ├─directives                      指令
    │      index.js
    │      
    ├─layout                          
    │  │  fullscreen-layout.vue
    │  │  index.vue
    │  │  layout.vue
    │  │  
    │  ├─header
    │  │      base-header.vue
    │  │      breadcrumb.vue
    │  │      collapse-sidebar-btn.vue
    │  │      expand.vue
    │  │      header-mix-nav-menus.vue
    │  │      logo.vue
    │  │      
    │  ├─sidebar
    │  │      base-sidebar.vue
    │  │      mobile-sidebar.vue
    │  │      sidebar-menus-items.vue
    │  │      
    │  └─view
    │          base-view.vue
    │          tabs.vue
    │          
    ├─pages                              特殊页面
    │      error.vue
    │      home.vue
    │      iframe.vue
    │      login.vue
    │      request.vue
    │      
    ├─router                             路由
    │      base.js
    │      index.js
    │      router.js
    │      
    ├─store                             
    │     index.js                      
    │     store.js
    │  
    │          
    ├─utils
    │      axios.js
    │      cache.js
    │      emits.js
    │      reset.js
    │      router.js
    │      theme.js
    │      utils.js
    │      
    └─views                             单独映射的路由页面--自动注册路由，view/xxx/xx.vue  
  ```

  ### 项目启动步骤
1. 安装包
   npm install 
   npm i  --registry https://registry.npm.taobao.org
3. 开发运行
  npm run serve
4. 生产打包
  npm run build

 #### 项目分析
  npm run build会显示包大小




