<template>
  <div class="block" style="margin-top:10px">
    <el-col :span="20">
      <el-timeline>
        <el-timeline-item v-for="(item,index) in list" :key="index" :timestamp="item.date" placement="top">
          <el-card v-for="(item2,index2) in item.list" :key="index2" class="card" shadow="hover" @click.native="checkInfo(item2.id)">
            <h4>{{ item2.title }}</h4>
            <p>{{ item2.summary }}</p>
          </el-card>
        </el-timeline-item>
      </el-timeline>
    </el-col>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  name: 'Timeline',
  data() {
    return {
      list: null
    }
  },
  mounted() {
    this.getList()
  },
  methods: {
    getList() {
      this.$axios.post('/article/getAllArticle', {}, {
        headers: {
          'Authorization': getToken()
        }
      }).then(res => {
        this.list = res.data.data
        console.log(this.list)
        // 创建一个二维数组，在同一天的文章放在一起
        const arr = []
        for (let i = 0; i < this.list.length; i++) {
          const date = this.list[i].createTime.split(' ')[0]
          const time = this.list[i].createTime.split(' ')[1]
          const obj = {
            date: date,
            time: time,
            title: this.list[i].title,
            id: this.list[i].aid,
            summary: this.list[i].summary
          }
          arr.push(obj)
        }
        const newArr = []
        // 创建一个新数组，把同一天的文章放在一起
        const result = arr.reduce((pre, cur) => {
          if (pre.date === cur.date) {
            pre.list.push(cur)
            return pre
          } else {
            newArr.push(pre)
            const obj = {
              date: cur.date,
              list: [cur]
            }
            return obj
          }
        }, [])
        newArr.push(result)
        console.log(newArr)
        console.log(result)
        this.list = newArr
      })
    },
    checkInfo(id) {
      console.log('id:', id)
      this.$router.push({
        path: '/documentation/info/' + id,
        query: {
          infoid: id
        }
      })
    }
  }
}
</script>

<style lang="scss" scoped>
  .card {
    div {
      padding: 0px;
    }
  }
</style>
