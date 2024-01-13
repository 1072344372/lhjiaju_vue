<template>
  <el-menu
      style="width:200px"
      default-active="1"
      class="el-menu-vertical-demo"
  >
    <el-menu-item index="1" @click="goToHome">
      <el-icon><setting /></el-icon>
      <span>家居管理</span>
    </el-menu-item>

    <el-menu-item index="2" @click="goToUserManagement">
      <el-icon><setting /></el-icon>
      <span>用户管理</span>
    </el-menu-item>

    <el-menu-item index="3" @click="goToOrdersManagement">
      <el-icon><setting /></el-icon>
      <span>订单管理</span>
    </el-menu-item>

    <el-menu-item index="4" @click="goToLogin">
      <el-icon><setting /></el-icon>
      <span>退出系统</span>
    </el-menu-item>
  </el-menu>
</template>

<script>
import router  from "@/router";
export default {
  name: "Aside.vue",
  methods: {
    goToHome() {
      router.push("/furn")
    },
    goToUserManagement() {
      router.push("/user")
    },
    goToOrdersManagement(){
      router.push("/order")
    },
    goToLogin(){
      router.push("/")
    }
  }
};
</script>

<style scoped>

</style>