<template>
  <div class="app-container">
    <el-form ref="form" :model="form" :label-position="labelPosition" label-width="120px" class="demo-dynamic">
      <el-form-item label="1.是否接触过高风险人群？" prop="meet">
        <el-select v-model="form.meet" placeholder="请选择">
          <el-option label="是" value="0" />
          <el-option label="否" value="1" />
        </el-select>
      </el-form-item>
      <el-form-item label="2.今天你的体温是？" prop="temp">
        <el-radio-group v-model="form.temp">
          <el-radio label="37.2度及以下" />
          <el-radio label="37.2度到37.9度" />
          <el-radio label="38度以上" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="3.今天你的健康码的颜色是？" prop="color">
        <el-radio-group v-model="form.color">
          <el-radio label="绿色" />
          <el-radio label="红色" />
          <el-radio label="黄色" />
          <el-radio label="有星标" />
          <el-radio label="无星标" />
        </el-radio-group>
      </el-form-item>
      <el-form-item label="4.你或你的共同居住人目前是否被医学隔离?(题目说明:这里指的隔离是指:由社区、街道或当地政府、医院认定要求的。)(必填)">
        <el-select v-model="form.close" placeholder="请选择">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="5.本人是否承诺以上所填报的全部内容均属实、准确，不存在任何隐瞒与不实的情况，更无遗漏之处。">
        <el-select v-model="form.isTrue" placeholder="请选择">
          <el-option label="是" value="1" />
          <el-option label="否" value="0" />
        </el-select>
      </el-form-item>
      <el-form-item label="6.填报地址">
        <el-col :span="10"><el-input v-model="form.address" placeholder="请输入" disabled /></el-col>
        <el-button @click.prevent="resetAddress()">重置</el-button>
      </el-form-item>
      <div>
        <div id="container" />
      </div>
      <el-form-item>
        <el-button type="primary" @click="onSubmit()">立即提交</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
import { mapGetters } from 'vuex'

export default {
  data() {
    return {
      labelPosition: 'top',
      form: {
        meet: null,
        temp: '',
        color: '',
        close: null,
        isTrue: null,
        name: '',
        sid: null,
        lat: null,
        lng: null,
        address: ''
      }
    }
  },
  computed: {
    ...mapGetters({ student: 'student' })
  },
  async mounted() {
    await this.getMyLocation()
    this.form.sid = this.student.stuId
    if (this.$route.query.infoid) {
      const res = await this.$axios({
        url: '/info/' + this.$route.query.infoid,
        methods: 'get',
        headers: {
          'Authorization': getToken()
        }
      })
      setTimeout(() => {
        this.form.meet = res.data.data.meet + ''
        this.form.temp = res.data.data.temp
        this.form.color = res.data.data.color
        this.form.close = res.data.data.close + ''
        this.form.isTrue = res.data.data.isTrue + ''
        this.form.sid = res.data.data.sid
        this.form.address = res.data.data.address
        this.form.lat = res.data.data.lat
        this.form.lng = res.data.data.lng
        this.initMap()
      }, 1000)
    }
  },
  methods: {
    getMyLocation() {
      // eslint-disable-next-line no-undef
      const Geolocation = new qq.maps.Geolocation('VSNBZ-GIOLJ-JELFT-KAIS4-544SE-PSFKW', 'zl_map')
      Geolocation.getLocation((position) => {
        console.log(position)
        this.form.lat = position.lat
        this.form.lng = position.lng
        this.form.address = position.nation + position.province + position.city + position.district + position.addr
        this.initMap()
      }, (error) => {
        console.log(error)
      })
    },
    initMap() {
      // eslint-disable-next-line no-undef
      const map = new qq.maps.Map(document.getElementById('container'), {
        // eslint-disable-next-line no-undef
        center: new qq.maps.LatLng(this.form.lat, this.form.lng),
        zoom: 16,
        // eslint-disable-next-line no-undef
        mapTypeId: qq.maps.MapTypeId.ROADMAP
      })

      // eslint-disable-next-line no-unused-vars
      // eslint-disable-next-line no-undef
      new qq.maps.Marker({
        // eslint-disable-next-line no-undef
        position: new qq.maps.LatLng(this.form.lat, this.form.lng),
        map: map
      })
      // eslint-disable-next-line no-undef
    },
    resetAddress() {
      this.form.address = ''
      this.form.lat = null
      this.form.lng = null
      this.getMyLocation()
    },
    resetForm(formName) {
      this.$refs[formName].resetFields()
    },
    onSubmit() {
      this.$axios({
        method: 'post',
        url: '/info/addInfo',
        data: this.form,
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        console.log(res)
        if (res.data.code === 200) {
          this.$message({
            message: '提交信息成功！',
            type: 'success'
          })
        }
      })
      this.$message('submit!')
    },
    onCancel() {
      this.$message({
        message: 'cancel!',
        type: 'warning'
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .el-form-item {
    margin-bottom: 10px;
  }
  #container {
    width:50%;
    height:400px;
  }

  @media (max-width: 750px){
    #container {
      width:100%;
      height:400px;
    }
  }

  .app-container {
    margin-bottom: 20px;
  }
</style>
