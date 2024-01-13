<template>
  <div class="主题">
    <div class="新增/其他" style="margin: 10px 5px">
      <el-button type="primary" @click="add">新增</el-button>

    </div>

    <div class="搜索" style="margin: 10px 5px">
      <el-input v-model="search" style="width: 30%;" placeholder="请输入"/>
      <el-button style="margin-outside: 10px" type="primary" @click="list">查询</el-button>
    </div>

    <el-table class="显示数据的表格" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="订单ID" sortable></el-table-column>
      <el-table-column prop="createTime" label="创建时间" :formatter="formatDate"></el-table-column>

      <el-table-column prop="price" label="价格"></el-table-column>
      <el-table-column prop="status" label="状态 0 未发货 1 已发货 2 已结账"></el-table-column>
      <el-table-column prop="memberId" label="会员ID"></el-table-column>
      <el-table-column prop="address" label="地址"></el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <el-popconfirm title="确认删除?" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>

    <!-- 添加订单的弹窗 -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="创建时间" prop="createTime">
          <el-date-picker v-model="form.createTime" type="datetime" style="width: 80%" placeholder="选择日期时间"></el-date-picker>
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 80%"></el-input>
          {{serverValidErrors && serverValidErrors.price}}
        </el-form-item>

        <el-form-item label="状态" prop="status">
          <el-input v-model="form.status" style="width: 80%"></el-input>
          {{serverValidErrors.status}}
        </el-form-item>
        <el-form-item label="会员ID" prop="memberId">
          <el-input v-model="form.memberId" style="width: 80%"></el-input>
          {{serverValidErrors.memberId}}
        </el-form-item>
        <el-form-item label="地址" prop="address">
          <el-input v-model="form.address" style="width: 80%"></el-input>
          {{serverValidErrors.address}}
        </el-form-item>
      </el-form>
      <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
      </template>
    </el-dialog>

    <!-- 添加分页插件-->
    <div class="分页插件" style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2, 5, 10, 15]"
          :page-size="pageSize"
          layout="total, sizes, prev, pager, next, jumper"
          :total="total">
      </el-pagination>
    </div>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  name: 'OrderView',
  data() {
    return {
      serverValidErrors: {},//后端错误效验信息
      //增加分页相应的数据
      currentPage: 1,//当前页
      pageSize: 10,//每页显示记录数
      total: 10,//共有多少数据

      search: '',
      dialogVisible: false,
      form: {
        createTime: new Date(),
        price: null,
        status: null,
        memberId: null,
        address: null,
      },
      tableData: [],
      rules: {
        createTime: [
          { required: true, message: '请选择创建时间', trigger: 'change' }
        ],
        price: [
          { required: true, message: '请输入价格', trigger: 'blur' }
        ],
        status: [
          { required: true, message: '请输入状态', trigger: 'blur' }
        ],
        memberId: [
          { required: true, message: '请输入会员ID', trigger: 'blur' }
        ],
        address: [
          { required: true, message: '请输入地址', trigger: 'blur' }
        ],
      },
    }
  },
  created() {
    this.list();
  },
  methods: {
    add() {//显示添加对话框
      this.dialogVisible = true;
      this.form = {};
      this.$refs['form'].resetFields();
      this.serverValidErrors = {}
    },
    save() {//填写的表单数据发送给后端
      // 确定是修改还是添加
      if (this.form.id) {//表示update
        // 修改订单的请求路径
        request.put("/api/admin/order/update", this.form).then(res => {
          if (res.code === 200) {
            this.$message({
              type: "success",
              message: "更新成功"
            })
          } else {
            this.$message({
              type: "error",
              message: "更新失败"
            })
          }
          this.dialogVisible = false;
          this.list();
        })
      } else {//添加
        this.$refs['form'].validate((valid) => {
          if (valid) {
            request.post("/api/admin/order/save", this.form).then(
                res => {
                  if (res.code === 200) {
                    this.dialogVisible = false
                    this.list();
                  } else if (res.code === 0) {
                    // 处理后端返回的验证错误信息
                    this.serverValidErrors.price = res.msgMap.price
                    this.serverValidErrors.status = res.msgMap.status
                    this.serverValidErrors.memberId = res.msgMap.memberId
                    this.serverValidErrors.address = res.msgMap.address
                  }
                })
          } else {
            this.$message({
              type: "error", message: "验证失败，不提交"
            })
            return false
          }
        })
      }
    },
    list() {//查询全部订单
      request.get(
          // "/api/admin/order/orders"

          "/api/admin/order/ordersByPage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }
      ).then(
          res => {
            console.log(res.data)
            this.tableData = res.data.records

            this.total = res.data.total
          }
      )
    },
    handleEdit(row) {//回显的方法
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    handleDel(id) {//删除订单的方法
      request.delete("/api/admin/order/del/" + id).then(res => {
        if (res.code === 200) {
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          this.$message({
            type: "error",
            message: "删除失败"
          })
        }
        this.dialogVisible = false;
        this.list();
      })
    },
    handleCurrentChange(pageNum) {//处理分页的请求
      this.currentPage = pageNum
      this.list()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.list()
    },
    formatDate(dateTime) {
      console.log("dateTime",dateTime.createTime)
      // 自定义时间格式化函数，根据实际需要修改
      const date = new Date(dateTime.createTime);
      return `${date.getFullYear()}-${date.getMonth() + 1}-${date.getDate()} ${date.getHours()}:${date.getMinutes()}:${date.getSeconds()}`;
    },
  },
}
</script>

<style scoped>
</style>
