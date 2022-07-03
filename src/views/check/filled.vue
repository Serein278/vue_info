<template>
  <div class="app-container">
    <div class="filter-container">
      <el-input v-model="listQuery.title" placeholder="Title" style="width: 200px;" class="filter-item" @keyup.enter.native="handleFilter" />
      <el-select v-model="listQuery.aclass" placeholder="Type" clearable class="filter-item" style="width: 130px">
        <el-option v-for="(item,index) in aclass" :key="index" :label="item" :value="item" />
      </el-select>
      <el-button v-waves class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-search" @click="handleFilter">
        Search
      </el-button>
      <el-button class="filter-item" style="margin-left: 10px;" type="primary" icon="el-icon-edit" @click="handleCreate">
        Add
      </el-button>
      <el-button v-waves :loading="downloadLoading" class="filter-item" type="primary" icon="el-icon-download" @click="handleDownload">
        Export
      </el-button>
      <el-checkbox v-model="showReviewer" class="filter-item" style="margin-left:15px;" @change="tableKey=tableKey+1">
        reviewer
      </el-checkbox>
    </div>

    <el-table
      :key="tableKey"
      v-loading="listLoading"
      :data="list"
      border
      fit
      highlight-current-row
      style="width: 100%;"
      @sort-change="sortChange"
    >
      <el-table-column label="学生学号" prop="stuId" sortable="custom" align="center">
        <template slot-scope="{row}">
          <span>{{ row.sid }}</span>
        </template>
      </el-table-column>
      <el-table-column label="学生姓名" width="150px" align="center">
        <template slot-scope="{row}">
          <span>{{ row.username }}</span>
        </template>
      </el-table-column>
      <el-table-column label="健康码颜色" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.color }}</span>
        </template>
      </el-table-column>
      <el-table-column label="填报地址" min-width="150px">
        <template slot-scope="{row}">
          <span class="link-type" @click="handleUpdate(row)">{{ row.address }}</span>
        </template>
      </el-table-column>
      <el-table-column label="Actions" align="center" width="230" class-name="small-padding fixed-width">
        <template slot-scope="{row,$index}">
          <el-button type="primary" size="mini" @click="handleUpdate(row)">
            Edit
          </el-button>
          <el-button v-if="row.status!='deleted'" size="mini" type="danger" @click="handleDelete(row,$index)">
            Delete
          </el-button>
        </template>
      </el-table-column>
    </el-table>

    <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />

    <el-dialog :title="textMap[dialogStatus]" :visible.sync="dialogFormVisible">
      <el-form ref="dataForm" :rules="rules" :model="temp" label-position="left" label-width="70px" style="width: 400px; margin-left:50px;">
        <el-form-item label="学号" prop="stuId">
          <el-input v-model="temp.stuId" disabled />
        </el-form-item>
        <el-form-item label="用户名" prop="username">
          <el-input v-model="temp.username" />
        </el-form-item>
        <el-form-item label="班级" prop="aclass.classname">
          <el-select v-model="temp.aclass.clId" placeholder="请选择">
            <el-option
              v-for="item in classList"
              :key="item.clId"
              :label="item.classname"
              :value="item.clId"
            />
          </el-select>
        </el-form-item>
        <el-form-item label="邮箱" prop="mail">
          <el-input v-model="temp.mail" />
        </el-form-item>
      </el-form>
      <div slot="footer" class="dialog-footer">
        <el-button @click="dialogFormVisible = false">
          取消
        </el-button>
        <el-button type="primary" @click="dialogStatus==='create'?createData():updateData()">
          提交
        </el-button>
      </div>
    </el-dialog>
  </div>
</template>

<script>

import waves from '@/directive/waves' // waves directive
import { parseTime } from '@/utils'
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getToken } from '@/utils/auth' // get token
// import axios from 'axios'
export default {
  name: 'ComplexTable',
  components: { Pagination },
  directives: { waves },
  filters: {
    statusFilter(status) {
      const statusMap = {
        published: 'success',
        draft: 'info',
        deleted: 'danger'
      }
      return statusMap[status]
    }
  },
  data() {
    return {
      tableKey: 0,
      list: null,
      total: 0,
      loading: false,
      listLoading: true,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        aclass: undefined,
        type: undefined,
        sort: '+id'
      },
      aclass: [],
      classList: null,
      tableData: [],
      tableHeader: ['stuId', 'classname', 'username', 'email'],
      showReviewer: false,
      temp: {
        title: '',
        stuId: '',
        username: '',
        classname: '',
        mail: '',
        aclass: {
          id: undefined,
          classname: ''
        }
      },
      dialogFormVisible: false,
      dialogUploadVisible: false,
      dialogStatus: '',
      textMap: {
        update: 'Edit',
        create: 'Create'
      },
      pvData: [],
      rules: {
        stuId: [{ required: true, message: '必须填写学生名', trigger: 'change' }]
      },
      downloadLoading: false
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    // 获取列表
    getList() {
      this.listLoading = true
      let result
      this.$axios({
        method: 'get',
        url: '/admin/getInfoByWeeks',
        params: this.listQuery,
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        console.log(res.data.data)
        this.list = res.data.data.items
        this.total = res.data.data.total
        this.listLoading = false
      })
      return result
    },
    // 创建
    handleFilter() {
      this.listQuery.page = 1
      this.getList()
    },
    // 上传文件
    beforeUpload(file) {
      const isLt1M = file.size / 1024 / 1024 < 1
      if (isLt1M) {
        return true
      }
      this.$message({
        message: 'Please do not upload files larger than 1m in size.',
        type: 'warning'
      })
      return false
    },
    handleSuccess({ results, header }, file) {
      this.tableData = results
      this.tableHeader = header
      // this.dialogUploadVisible = false
      this.$message({
        message: 'Upload successfully',
        type: 'success'
      })
    },
    handleModifyStatus(row, status) {
      this.$message({
        message: '操作Success',
        type: 'success'
      })
      row.status = status
    },
    sortChange(data) {
      const { prop, order } = data
      if (prop === 'id') {
        this.sortByID(order)
      }
    },
    sortByID(order) {
      if (order === 'ascending') {
        this.listQuery.sort = '+id'
      } else {
        this.listQuery.sort = '-id'
      }
      this.handleFilter()
    },
    resetTemp() {
      this.temp = {
      }
    },
    handleCreate() {
      this.resetTemp()
      this.dialogStatus = 'create'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    createData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          this.temp.id = parseInt(Math.random() * 100) + 1024 // mock a id
          this.temp.author = 'vue-element-admin'
        }
      })
    },
    handleUpdate(row) {
      this.temp = Object.assign({}, row) // copy obj
      console.log(this.temp)
      this.temp.timestamp = new Date(this.temp.timestamp)
      this.dialogStatus = 'update'
      this.dialogFormVisible = true
      this.$nextTick(() => {
        this.$refs['dataForm'].clearValidate()
      })
    },
    updateData() {
      this.$refs['dataForm'].validate((valid) => {
        if (valid) {
          const tempData = Object.assign({}, this.temp)
          console.log(tempData)
          this.$axios({
            method: 'post',
            url: '/admin/updateStuInfo',
            data: tempData,
            headers: {
              'Authorization': getToken()
            }
          }).then(res => {
            this.$message({
              message: res.data.msg,
              type: 'success'
            })
            this.dialogFormVisible = false
            this.getList()
          })
        }
      })
    },
    handleDelete(row, index) {
      this.$axios({
        method: 'get',
        url: '/admin/deleteStuInfo',
        params: {
          id: row.stuId
        },
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        console.log(res)
        this.$notify({
          title: 'Success',
          message: res.data.msg,
          type: 'success',
          duration: 2000
        })
        this.list.splice(index, 1)
      })
    },

    // 导出excel
    handleDownload() {
      this.downloadLoading = true
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['stuId', 'username', 'mail']
        const filterVal = ['stuId', 'username', 'mail']
        const data = this.formatJson(filterVal)
        console.log(data)
        excel.export_json_to_excel({
          header: tHeader,
          data,
          filename: 'table-list'
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal) {
      return this.list.map(v => filterVal.map(j => {
        if (j === 'timestamp') {
          return parseTime(v[j])
        } else {
          return v[j]
        }
      }))
    }
  }
}
</script>
