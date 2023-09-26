<script>
import request from "@/utils/request";
export default {
  name: 'HomeView',
  components: {},
  data() {
    return {
      search: '',
      dialogVisible: false,
      form: {},

      tableData: [
        {
          date: '2023.9.22',
          name: '罗汉',
          address: '15#b404',
        },
        {
          date: '2023.9.25',
          name: '罗汉',
          address: '15#b404',
        },
        {
          date: '2023.9.28',
          name: '罗汉',
          address: '15#b404',
        },
        {
          date: '2023.9.21',
          name: '罗汉',
          address: '15#b404',
        },
      ],

    }
  },
  //添加方法
  methods: {
    add() {//显示添加对话框
      this.dialogVisible = true;
      this.form = {}
    },
    save() {//填写的表单数据发送给后端
      // 1 this.form :携带的数据
      //2 成功后的结果
      request.post("/api/save",this.form).then(
          res=>{
            console.log("res-",res);
            this.dialogVisible=false
          })
    }
  },
}
</script>

<template>
  <div>
    <div style="margin: 10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>

    <div style="margin: 10px 5px">
      <el-input v-model="search" style="width: 30%;" placeholder="请输入"/>
      <el-button style="margin-outside: 10px" type="primary">查询</el-button>
    </div>

    <el-table :data="tableData" stripe style="width: 100%">
      <el-table-column sortable prop="date" label="日期"/>
      <el-table-column prop="name" label="名字"/>
      <el-table-column prop="address" label="地址"/>
      <el-table-column fixed="right" label="操作" width="150">
        <template #default>
          <el-button type="text">编辑</el-button>
          <el-button type="text">删除</el-button>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加家居的弹窗
    说明:
    1. el-dialog ：v-model="dialogVisible" 表示对话框, 和 dialogVisible 变量双向
    绑定,控制是否显示对话框
    2. el-form :model="form" 表示表单 ,数据和 form 数据变量双向绑定
    3. el-input v-model="form.name" 表示表单的 input 空间，名字为 name 需要和
    后台 Javabean 属性一致
    -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" label-width="120px">
        <el-form-item label="家居名">
          <el-input v-model="form.name" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="厂商">
          <el-input v-model="form.maker" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="价格">
          <el-input v-model="form.price" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="销量">
          <el-input v-model="form.sales" style="width: 80%"></el-input>
        </el-form-item>
        <el-form-item label="库存">
          <el-input v-model="form.stock" style="width: 80%"></el-input>
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="save">确 定</el-button>
           </span>
      </template>
    </el-dialog>
  </div>
</template>
