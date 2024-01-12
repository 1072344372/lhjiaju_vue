
<template>
  <div class="主题">
    <div class="新增/其他" style="margin: 10px 5px">
      <el-button type="primary" @click="add">新增</el-button>
      <el-button>其他</el-button>
    </div>

    <div class="搜索" style="margin: 10px 5px">
      <el-input v-model="search" style="width: 30%;" placeholder="请输入"/>
      <el-button style="margin-outside: 10px" type="primary" @click="list">查询</el-button>
    </div>

    <el-table class="显示数据的表格" :data="tableData" stripe style="width: 100%">
      <el-table-column prop="id" label="ID" sortable></el-table-column>
      <el-table-column prop="name" label="家居名">
      </el-table-column>
      <el-table-column prop="maker" label="厂家">
      </el-table-column>
      <el-table-column prop="price" label="价格">
      </el-table-column>
      <el-table-column prop="sales" label="销量">
      </el-table-column>
      <el-table-column prop="stock" label="库存">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="150" align="center">
        <!--说明
        handleEdit(scope.row) 可以将当前行的数据传递给handleEdit方法
        -->
        <template #default="scope">
          <el-button type="text" @click="handleEdit(scope.row)">编辑</el-button>
          <!-- 确定就触发handleDel 取消不会触发 -->
          <el-popconfirm title="确认删除?" @confirm="handleDel(scope.row.id)">
            <template #reference>
              <el-button size="small" type="danger">删除</el-button>
            </template>
          </el-popconfirm>
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
      <el-form :model="form" :rules="rules" ref="form" label-width="120px">
        <el-form-item label="家居名" prop="name">
          <el-input v-model="form.name" style="width: 80%"></el-input>
          {{serverValidErrors.name}}
        </el-form-item>
        <el-form-item label="厂商" prop="maker">
          <el-input v-model="form.maker" style="width: 80%"></el-input>
          {{serverValidErrors.maker}}
        </el-form-item>
        <el-form-item label="价格" prop="price">
          <el-input v-model="form.price" style="width: 80%"></el-input>
          {{serverValidErrors.price}}
        </el-form-item>
        <el-form-item label="销量" prop="sales">
          <el-input v-model="form.sales" style="width: 80%"></el-input>
          {{serverValidErrors.sales}}
        </el-form-item>
        <el-form-item label="库存" prop="stock">
          <el-input v-model="form.stock" style="width: 80%"></el-input>
          {{serverValidErrors.stock}}
        </el-form-item>
      </el-form>
      <template #footer>
          <span class="dialog-footer">
           <el-button @click="dialogVisible = false">取 消</el-button>
           <el-button type="primary" @click="save">确 定</el-button>
           </span>
      </template>
    </el-dialog>
    <!--    <el-pagination background layout="prev, pager, next" :total="1000" />-->

    <!--    添加分页插件-->
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
  name: 'HomeView',
  components: {

  },
  data() {
    return {
      serverValidErrors:{},//后端错误效验信息
      //增加分页相应的数据
      currentPage: 1,//当前页
      pageSize: 5,//每页显示记录数
      total: 10,//共有多少数据

      search: '',
      dialogVisible: false,
      form: {},
      tableData: [],
      rules: {
        name: [
          //required: true 必须填写
          //message: '请输入称家居名' 失败提示
          //
          {required: true, message: '请输入称家居名', trigger: 'blur'}
        ], maker: [
          {required: true, message: '请输入称制造商', trigger: 'blur'}
        ], price: [
          {required: true, message: '请输入价格', trigger: 'blur'}, {
            pattern: /^(([1-9]\d*)|(0))(\.\d+)?$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ], sales: [
          {required: true, message: '请输入销量', trigger: 'blur'}, {
            pattern: /^(([1-9]\d*)|(0))$/,
            message: '请输入数字',
            trigger: 'blur'
          }
        ], stock: [
          {required: true, message: '请输入库存', trigger: 'blur'},
          {pattern: /^(([1-9]\d*)|(0))$/, message: '请输入数字', trigger: 'blur'}
        ]
      },

    }
  },
  created() {
    this.list();
  },
  //添加方法
  methods: {
    add() {//显示添加对话框
      this.dialogVisible = true;
      this.form = {};
      this.$refs['form'].resetFields();
      // this.$refs.form.resetFields()
      this.serverValidErrors={}
    },
    save() {//填写的表单数据发送给后端

      //确定是修改还是添加
      if (this.form.id) {//表示update
        //本质是发出ajax请求 异步处理 不会等到then结束再往下面走  而是直接往下走  所以关闭对话框 更新数据需要在方法里
        request.put("/api/update", this.form).then(res => {
          if (res.code === 200) {
            //提示一个成功的消息框
            this.$message({
              type: "success",
              message: "更新成功"
            })
          } else {
            //提示一个错误的消息框
            this.$message({
              type: "error",
              message: "更新失败"
            })
          }
          //关闭对话框 更新数据
          this.dialogVisible = false;
          this.list();
        })
      } else {//添加
        this.$refs['form'].validate((valid) => {
          // valid=true;
          if (valid) {
            //=======说明======
            //1. 将 form 表单提交给 /api/save 的接口
            //2. /api/save 等价 http://localhost:10001/save
            //3. 如果成功，就进入 then 方法
            //4. res 就是返回的信息
            //5. 查看 Mysql 看看数据是否保存
            // 1 this.form :携带的数据
            // 2 成功后的结果
            request.post("/api/save", this.form).then(
                res => {
                  if(res.code===200){
                    // console.log("res-", res);
                    this.dialogVisible = false
                    this.list();
                  }else if(res.code===0){
                    this.serverValidErrors.name=res.msgMap.name
                    this.serverValidErrors.price=res.msgMap.price
                    this.serverValidErrors.maker=res.msgMap.maker
                    this.serverValidErrors.stock=res.msgMap.stock
                    this.serverValidErrors.sales=res.msgMap.sales
                  }

                })
          } else {
            this.$message({//弹出更新失败信息
              type: "error", message: "验证失败，不提交"
            })
            return false
          }
        })


      }
    },
    list() {//查询全部家居
      // request.get("/api/furns").then(res => {
      //   // console.log("furns的res-", res);
      //   this.tableData = res.data;
      //
      // })

      //请求分页查询-条件查询
      request.get("/api/furnsByConditionPage", {
        params: {//指定请求携带的参数
          pageNum: this.currentPage,
          pageSize: this.pageSize,
          search: this.search
        }
      }).then(
          res => {//处理返回的分页信息
            this.tableData = res.data.records
            this.total = res.data.total
          }
      )
    },
    handleEdit(row) {//回显的方法
      // console.log("row-",row)
      //将当前的家具信息绑定到弹出对话框的表单
      //方式1 row.id 到后端去查对应的家居信息，返回后将其绑定
      //方式2 把当前获取的row的数据通过处理，绑定到this.from进行显示
      // JSON.stringify(row); 将row转成json字符串
      //JSON.parse( JSON.stringify(row)) 将json字符串转成json对象
      this.form = JSON.parse(JSON.stringify(row));
      this.dialogVisible = true;

    },
    handleDel(id) {//回显的方法
      // console.log("要删除的id:", id);
      request.delete("/api/del/" + id).then(res => {
        if (res.code === 200) {
          //提示一个成功的消息框
          this.$message({
            type: "success",
            message: "删除成功"
          })
        } else {
          //提示一个错误的消息框
          this.$message({
            type: "error",
            message: "删除失败"
          })
        }
        //关闭对话框 更新数据
        this.dialogVisible = false;
        this.list();
      })
    },
    handleCurrentChange(pageNum) {//处理分页的请求
      //当用户点击分页超连接时，会携带pageNum
      console.log("pageNum:", pageNum)
      this.currentPage = pageNum
      //发出请求
      this.list()
    },
    handlePageSizeChange(pageSize) {
      this.pageSize = pageSize
      this.list()
    },
  },

}
</script>

