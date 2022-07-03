<template>
  <div v-if="data" class="container">
    <h1>{{ data.title }}</h1>
    <div class="info">
      <div class="author">{{ data.author }}</div>
      <div class="time">{{ data.createTime }}</div>
    </div>
    <div class="content" v-html="data.content">
      {{ data.content }}
    </div>
  </div>
</template>

<script>
import { getToken } from '@/utils/auth'
export default {
  data() {
    return {
      data: null
    }
  },
  mounted() {
    this.getData()
  },
  methods: {
    getData() {
      if (this.$route.query.infoid) {
        const id = this.$route.query.infoid
        this.$axios.get('/article/getArticle?id=' + id, {
          headers: {
            'Authorization': getToken()
          }}).then(res => {
          this.data = res.data.data
          console.log(this.data)
        })
      }
    }
  }
}
</script>

<style lang="scss" scope>
    .container {
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        justify-content: center;
        align-items: center;
        .title {
            font-size: 20px;
            font-weight: bold;
            margin-bottom: 20px;
        }
        .info {
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 20px;
            .author {
                font-size: 14px;
                color: #999;
                margin-right: 5px;
            }
            .time {
                font-size: 14px;
                color: #999;
                margin-left: 5px;
            }
        }
        .content {
            width: 80%;
            margin-bottom: 20px;
            font-size: 16px;
            line-height: 1.5;
            color: #666;
        }
    }
</style>
