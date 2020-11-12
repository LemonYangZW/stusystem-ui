<template>
  <div class="app-container">
    <el-row :gutter="10" class="mb8">
      <el-col :span="1.5">
        <el-button
          type="primary"
          icon="el-icon-plus"
          size="mini"
          @click="handleAdd"
          >新增</el-button
        >
      </el-col>
    </el-row>
    <el-card>
      <el-table stripe border :data="userList" style="width: 100%">
        <el-table-column type="selection" width="40" align="center" />
        <el-table-column label="用户编号" align="center" prop="userId" />
        <el-table-column
          label="用户名称"
          align="center"
          prop="userName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="用户昵称"
          align="center"
          prop="nickName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="部门"
          align="center"
          prop="dept.deptName"
          :show-overflow-tooltip="true"
        />
        <el-table-column
          label="手机号码"
          align="center"
          prop="phonenumber"
          width="120"
        />
        <el-table-column label="状态" align="center">
          <template #default="scope">
            <el-switch
              v-model="scope.row.status"
              active-value="0"
              inactive-value="1"
              @change="handleStatusChange(scope.row)"
            />
          </template>
        </el-table-column>
        <el-table-column
          label="创建时间"
          align="center"
          prop="createTime"
          width="160"
        >
          <template #default="scope">
            <span>{{ scope.row.createTime }}</span>
          </template>
        </el-table-column>
        <el-table-column
          label="操作"
          align="center"
          width="180"
          class-name="small-padding fixed-width"
        >
          <template #default="scope">
            <el-button
              size="mini"
              type="text"
              icon="el-icon-edit"
              @click="handleUpdate(scope.row)"
              >修改</el-button
            >
            <el-button
              v-if="scope.row.userId !== 1"
              size="mini"
              type="text"
              icon="el-icon-delete"
              @click="handleDelete(scope.row)"
              >删除</el-button
            >
            <el-button
              size="mini"
              type="text"
              icon="el-icon-key"
              @click="handleResetPwd(scope.row)"
              >重置</el-button
            >
          </template>
        </el-table-column>
      </el-table>
    </el-card>
    <div class="block">
      <el-pagination
        :current-page="queryParams.pageNum"
        :page-sizes="[1, 2, 10, 50]"
        :page-size="queryParams.pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total"
        @size-change="handleSizeChange"
        @current-change="handleCurrentChange"
      />
    </div>
    <el-dialog :title="title" :visible.sync="open" width="600px" append-to-body>
      <el-form ref="form" :model="form" :rules="rules" label-width="80px">
        <el-row>
          <el-col :span="12">
            <el-form-item label="用户昵称" prop="nickName">
              <el-input v-model="form.nickName" placeholder="请输入用户昵称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="归属部门" prop="deptId">
              <el-cascader
                ref="elcascader"
                v-model="form.deptId"
                :options="deptOptions"
                :props="deptProps"
                placeholder="请选择归属部门"
                clearable
                :show-all-levels="false"
              />
            </el-form-item>
          </el-col>
        </el-row>
        <el-row>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户名称"
              prop="userName"
            >
              <el-input v-model="form.userName" placeholder="请输入用户名称" />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item
              v-if="form.userId == undefined"
              label="用户密码"
              prop="password"
            >
              <el-input
                v-model="form.password"
                placeholder="请输入用户密码"
                type="password"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="用户性别">
              <el-select v-model="form.sex" placeholder="请选择">
                <el-option
                  v-for="dict in sexOptions"
                  :key="dict.value"
                  :label="dict.label"
                  :value="dict.value"
                />
              </el-select>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="状态">
              <el-radio-group v-model="form.status">
                <el-radio
                  v-for="dict in statusOptions"
                  :key="dict.value"
                  :label="dict.value"
                  >{{ dict.label }}</el-radio
                >
              </el-radio-group>
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="邮箱" prop="email">
              <el-input
                v-model="form.email"
                placeholder="请输入邮箱"
                maxlength="50"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="手机号码" prop="phonenumber">
              <el-input
                v-model="form.phonenumber"
                placeholder="请输入手机号码"
                maxlength="11"
              />
            </el-form-item>
          </el-col>
          <el-col :span="12">
            <el-form-item label="岗位">
              <el-select v-model="form.postIds" multiple placeholder="请选择">
                <el-option
                  v-for="item in postOptions"
                  :key="item.postId"
                  :label="item.postName"
                  :value="item.postId"
                  :disabled="item.status == 1"
                />
              </el-select>
            </el-form-item>
          </el-col>
        </el-row>
      </el-form>
      <template #footer>
        <div slot="footer" class="dialog-footer">
          <el-button type="primary" @click="submitForm">确 定</el-button>
          <el-button @click="cancel">取 消</el-button>
        </div></template
      >
    </el-dialog>
  </div>
</template>

<script>
import { getUserInfoList, getUserBaseParam } from '@/api/user'
import { treeselect } from '@/api/dept'
export default {
  data () {
    return {
      // 岗位参数
      postOptions: [],
      // 状态参数
      statusOptions: [{
        value: '0',
        label: '正常'
      }, {
        value: '1',
        label: '停用'
      }],
      // 性别参数
      sexOptions: [{
        value: '0',
        label: '男'
      }, {
        value: '1',
        label: '女'
      }, {
        value: '2',
        label: '未知'
      }],
      // 部门参数
      deptProps: {
        value: 'id',
        label: 'label',
        children: 'children',
        checkStrictly: true,
        expandTrigger: 'hover'
      },
      // 表格数据
      userList: [],
      // 查询参数
      queryParams: {
        pageNum: 1,
        pageSize: 2
      },
      // 总条目数
      total: 0,
      // dialog弹出层
      title: '',
      // dialog显示
      open: false,
      // 表单参数
      form: {},
      // 部门列表
      deptOptions: [],
      // 表单校验
      rules: {
        userName: [
          { required: true, message: '用户名称不能为空', trigger: 'blur' }
        ],
        nickName: [
          { required: true, message: '用户昵称不能为空', trigger: 'blur' }
        ],
        deptId: [
          { required: true, message: '归属部门不能为空', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '用户密码不能为空', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '邮箱地址不能为空', trigger: 'blur' },
          {
            type: 'email',
            message: "'请输入正确的邮箱地址",
            trigger: ['blur', 'change']
          }
        ],
        phonenumber: [
          { required: true, message: '手机号码不能为空', trigger: 'blur' },
          {
            pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/,
            message: '请输入正确的手机号码',
            trigger: 'blur'
          }
        ]
      }
    }
  },
  watch: {
    'form.deptId' () {
      if (this.$refs.elcascader) {
        this.$refs.elcascader.dropDownVisible = false // 监听值发生变化就关闭它
      }
    }
  },
  created () {
    this.getList()
    // this.getTreeselect()
  },
  methods: {
    /** 查询用户列表 */
    getList () {
      this.loading = true
      getUserInfoList(this.queryParams).then(res => {
        this.userList = res.list
        this.total = res.total
        this.loading = false
      })
    },
    handleCurrentChange (val) {
      this.queryParams.pageNum = val
      this.getList()
    },
    handleSizeChange (val) {
      this.queryParams.pageSize = val
      this.getList()
    },
    handleStatusChange (userInfo) {
      console.log(userInfo)
    },
    handleUpdate (userInfo) {
      console.log(userInfo)
    },
    handleDelete (userInfo) {
      console.log(userInfo)
    },
    handleResetPwd (userInfo) {
      console.log(userInfo)
    },
    handleAdd () {
      this.open = true
      this.getTreeselect()
      getUserBaseParam().then(response => {
        this.postOptions = response.posts
        this.roleOptions = response.roles
        this.title = '添加用户'
        this.form.password = this.initPassword
      })
    },
    handleImport () {

    },
    handleExport () {

    },
    submitForm () {

    },
    cancel () {

    },
    /** 查询部门下拉树结构 */
    getTreeselect () {
      treeselect().then(response => {
        this.deptOptions = response.data
      })
    }
  }
}
</script>

<style>
</style>
