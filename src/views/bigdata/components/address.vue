<template>
  <div v-if="items" class="container">
    <h1>{{ items.name }}</h1>
    <h2>总人数 {{ items.value }}</h2>
    <el-collapse v-model="activeName" accordion class="collapse">
      <el-collapse-item v-for="(item,index) in items.items" :key="index" :title="item.name" :name="index">
        <div v-for="(it,ind) in item.item" :key="ind">{{ it.create_time }}  {{ it.city }}</div>
      </el-collapse-item>
    </el-collapse>
  </div>
</template>

<script>
export default {
  // eslint-disable-next-line vue/require-prop-types
  props: {
    items: {
      type: Object,
      required: true
    }
  },
  data() {
    return {
      activeName: '1'
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
        .collapse{
            width: 80%;
            max-width: 600px;
            .el-collapse-item{
                margin-bottom: 20px;
                .el-collapse-item__header{
                    padding: 0;
                    .el-collapse-item__header__arrow{
                        display: none;
                    }
                }
                .el-collapse-item__wrap{
                    padding: 20px;
                    .el-collapse-item__wrap__content{
                        padding: 0;
                    }
                }
            }
        }
    }
</style>
