<template>
  <div class="app-container">
    <el-card v-for="info in infoList" :key="info.infoId" class="box-card" style="margin-top:10px">
      <div slot="header" class="clearfix">
        <span>皖西学院"心冠肺炎"疫情防控收集信息</span>
        <el-button style="float: right; padding: 3px 0" type="text" @click="getInfo(info.infoId)">查看信息</el-button>
      </div>
      <el-descriptions :column="1">
        <el-descriptions-item label="辅导员">{{ info.counselor.username }}</el-descriptions-item>
        <el-descriptions-item label="填报时间">{{ info.createTime }}</el-descriptions-item>
      </el-descriptions>
    </el-card>
    <el-backtop><i class="el-icon-top" /></el-backtop>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'
export default {

  data() {
    return {
      infoList: []
    }
  },
  computed: {
    ...mapGetters({ stuId: 'stuId' })
  },
  watch: {
  },
  mounted() {
    this.$axios({
      method: 'post',
      url: '/info/' + this.stuId + '/allInfo',
      headers: {
        'Authorization': getToken()
      }
    }).then(res => {
      // console.log(res)
      if (res.data.code === '200') {
        this.infoList = res.data.data
      }
    })
  },
  methods: {
    // 跳转学生信息链接
    getInfo(infoid) {
      console.log(infoid)
      this.$router.push({
        path: '/info/infoid',
        query: {
          infoid: infoid
        }
      })
    }
  }
}
</script>
<style scoped>
  .box-card {
    margin-bottom: 10px;
  }

  .el-icon-top{
    color: #fff;
    background-color: #409EFF;
    width: 40px;
    height: 40px;
    line-height: 40px;
    text-align: center;
  }
</style>

