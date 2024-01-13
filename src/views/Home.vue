<script>
import Header from '@/components/Header.vue';
import Aside from "@/components/Aside.vue";

export default {
  name: "Layout",
  components: {
    Header,
    Aside
  }
}
</script>

<template>
  <!--
  1. App.vue页面可以用于布局界面
  2. <router-view/>就是路由指令
  3．会把路由到的页面内容，展示到<router-view/>
  4.比如 url地址 http://localhost:8080/I那么路由的 path就是/

  -->
  <div>
    <!--引入header-->
        <Header/>
    <div style="display: flex">
      <!--    侧边栏-->
      <Aside/>
      <!--引入内容区域 通过路由展示  默认路由到 /
      比如http://localhost:10000/ =》HomeView.vue
      -->
      <router-view style="flex: 1"/>
    </div>
  </div>
</template>

