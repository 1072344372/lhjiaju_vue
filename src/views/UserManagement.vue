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
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column prop="username" label="用户名">
      </el-table-column>
      <el-table-column prop="email" label="邮箱">
      </el-table-column>
      <el-table-column prop="state" label="状态">
      </el-table-column>
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

    <!-- 添加会员的弹窗 -->
    <el-dialog title="提示" v-model="dialogVisible" width="30%">
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="用户名" prop="username">
          <el-input v-model="form.username" style="width: 80%"></el-input>
          {{serverValidErrors.username}}
        </el-form-item>
        <el-form-item label="邮箱" prop="email">
          <el-input v-model="form.email" style="width: 80%"></el-input>
          {{serverValidErrors.email}}
        </el-form-item>
        <el-form-item label="密码" prop="password">
          <el-input type="password" v-model="form.password" style="width: 80%"></el-input>
          {{serverValidErrors.password}}
        </el-form-item>
        <!-- 其他会员相关的字段... -->
      </el-form>
      <template #footer>
          <span class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="save">确 定</el-button>
           </span>
      </template>
    </el-dialog>

    <!-- 添加分页插件-->
    <div class="分页插件" style="margin: 10px 0">
      <el-pagination
          @size-change="handlePageSizeChange"
          @current-change="handleCurrentChange"
          :current-page="currentPage"
          :page-sizes="[2,5,10,15]"
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
  name: 'MemberView',
  data() {
    return {
      serverValidErrors: {},//后端错误效验信息
      //增加分页相应的数据
      currentPage: 1,//当前页
      pageSize: 10,//每页显示记录数
      total: 10,//共有多少数据

      search: '',
      dialogVisible: false,
      form: {},
      tableData: [],
      rules: {
        username: [
          { required: true, message: '请输入用户名', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' }
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
        // 修改会员的请求路径
        request.put("/api/admin/member/update", this.form).then(res => {
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
            // 添加会员的请求路径
            request.post("/api/admin/member/save", this.form).then(
                res => {
                  if (res.code === 200) {
                    this.dialogVisible = false
                    this.list();
                  } else if (res.code === 0) {
                    // 处理后端返回的错误信息
                    this.serverValidErrors.username = res.msgMap.username
                    this.serverValidErrors.email = res.msgMap.email
                    // 处理其他会员相关的字段...
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
    list() {//查询全部会员
      // 请求分页查询-条件查询
      request.get("/api/admin/member/membersByPage", {
        params: {
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(
          res => {
            this.tableData = res.data.records
            this.total = res.data.total
          }
      )
    },
    handleEdit(row) {//回显的方法
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;
    },
    handleDel(id) {//回显的方法
      request.delete("/api/admin/member/del/" + id).then(res => {
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
  },
}
</script>

<style scoped>
/* 样式可以根据需求添加 */
</style>
