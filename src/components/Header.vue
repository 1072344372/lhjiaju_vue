
<!--页面分成三个部分
这是页面的头部
分成三个部分
-->
<template>
  <div style="height: 50px; line-height: 50px; border-bottom: 1px solid #ccc;
display: flex">
    <div style="width: 200px; padding-left: 30px; font-weight: bold; color:dodgerblue">后台管理</div>
    <div style="flex: 1"></div>
    <div style="width: 100px;margin-top: 10px;margin-right: 30px;font-size: 30px">
      <el-dropdown>
    <span class="el-dropdown-link">
      罗汉
    </span>
        <template #dropdown>
          <el-dropdown-menu>
            <el-dropdown-item>个人信息</el-dropdown-item>
            <el-dropdown-item>退出登录</el-dropdown-item>
          </el-dropdown-menu>
        </template>
      </el-dropdown>
    </div>
  </div>
</template>

<style >

</style>