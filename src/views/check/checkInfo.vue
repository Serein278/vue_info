<template>
  <div>
    <el-card class="box-card">
      <div slot="header" class="clearfix">
        <span>今日学生未填报</span>
      </div>
      <el-table
        ref="multipleTable"
        :data="tableData"
        tooltip-effect="dark"
        style="width: 100%"
        @selection-change="handleSelectionChange"
      >
        <el-table-column
          type="selection"
          width="55"
        />
        <el-table-column
          prop="stuId"
          label="姓名"
          width="120"
        />
        <el-table-column
          prop="username"
          label="姓名"
          show-overflow-tooltip
        />
        <el-table-column
          prop="mail"
          label="邮箱"
          show-overflow-tooltip
        />
        <el-table-column label="操作">
          <template slot-scope="scope">
            <el-button
              size="mini"
              :loading="loading"
              @click="handleEdit(scope.$index, scope.row)"
            >发送邮件提示</el-button>
          </template>
        </el-table-column>
      </el-table>
      <div style="margin-top: 20px">
        <el-button @click="toggleSelection([tableData[1], tableData[2]])">全部发送</el-button>
        <el-button @click="toggleSelection()">取消选择</el-button>
      </div>
      <pagination v-show="total>0" :total="total" :page.sync="listQuery.page" :limit.sync="listQuery.limit" @pagination="getList" />
    </el-card>
  </div>
</template>

<script>
import Pagination from '@/components/Pagination' // secondary package based on el-pagination
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {
  components: { Pagination },
  data() {
    return {
      tableData: [],
      multipleSelection: [],
      total: 2,
      listQuery: {
        page: 1,
        limit: 20,
        importance: undefined,
        title: undefined,
        type: undefined,
        sort: '+id'
      },
      loading: false
    }
  },
  computed: {
    ...mapGetters({ cId: 'cId' })
  },
  created() {
    this.getList()
  },
  methods: {
    toggleSelection(rows) {
      if (rows) {
        rows.forEach(row => {
          this.$refs.multipleTable.toggleRowSelection(row)
        })
      } else {
        this.$refs.multipleTable.clearSelection()
      }
    },
    handleSelectionChange(val) {
      this.multipleSelection = val
    },
    getList() {
      this.$axios({
        url: '/info/notExist/' + this.cId,
        methods: 'get',
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        console.log(res)
        this.tableData = res.data.data
      })
    },
    handleEdit(index, row) {
      console.log(index, row)
      this.loading = true
      this.$axios({
        methods: 'get',
        url: '/admin/' + row.mail + '/sendMail/',
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        if (res.data.code === '200') {
          this.$message.success(res.data.msg)
          this.loading = false
        }
      }).catch(() => {
        this.loading = false
      })
    }
  }
}
</script>

<style>

</style>
