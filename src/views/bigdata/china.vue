<template>
  <div class="container">
    <div id="main" />
    <RightPanel v-if="true" :show="show" @changeShow="change">
      <Address :items="items" />
    </RightPanel>
  </div>
</template>

<script>
import RightPanel from '@/components/RightPanel'
import Address from './components/address'
export default {
  components: {
    RightPanel,
    Address
  },
  data() {
    return {
      show: false,
      items: null,
      dataList: [
        { name: '南海诸岛' },
        { ename: 'beijing', name: '北京', items: '' },
        { ename: 'tianjin', name: '天津' },
        { ename: 'shanghai', name: '上海' },
        { ename: 'chongqing', name: '重庆' },
        { ename: 'hebei', name: '河北' },
        { ename: 'henan', name: '河南' },
        { ename: 'yunnan', name: '云南' },
        { ename: 'liaoning', name: '辽宁' },
        { ename: 'heilongjiang', name: '黑龙江' },
        { ename: 'hunan', name: '湖南' },
        { ename: 'anhui', name: '安徽' },
        { ename: 'shandong', name: '山东' },
        { ename: 'xinjiang', name: '新疆' },
        { ename: 'jiangsu', name: '江苏' },
        { ename: 'zhejiang', name: '浙江' },
        { ename: 'jiangxi', name: '江西' },
        { ename: 'hubei', name: '湖北' },
        { ename: 'guangxi', name: '广西' },
        { ename: 'gansu', name: '甘肃' },
        { ename: 'shanxi', name: '山西' },
        { ename: 'neimenggu', name: '内蒙古' },
        { ename: 'shanxi1', name: '陕西' },
        { ename: 'jilin', name: '吉林' },
        { ename: 'fujian', name: '福建' },
        { ename: 'guizhou', name: '贵州' },
        { ename: 'guangdong', name: '广东' },
        { ename: 'qinghai', name: '青海' },
        { ename: 'xizang', name: '西藏' },
        { ename: 'sichuan', name: '四川' },
        { ename: 'ningxia', name: '宁夏' },
        { ename: 'hainan', name: '海南' },
        { name: '台湾' },
        { ename: 'xianggang', name: '香港' },
        { ename: 'aomen', name: '澳门' }
      ]
    }
  },
  async mounted() {
    const res = await this.getList()
    this.initEcharts(res.data.data)
    // eslint-disable-next-line no-undef
    const myLatlng = new qq.maps.LatLng(39.916527, 116.397128)
    console.log(myLatlng)
  },
  methods: {
    getList() {
      return this.$axios({
        url: '/bigData/getAllData',
        method: 'get'
      })
    },
    change(show) {
      this.show = !this.show
    },
    addAllDatas() {
      this.$axios({
        url: '/bigData/addBigData',
        method: 'post',
        data: {
          items: this.dataList
        }
      }).then(res => {
        console.log(res)
      })
    },
    getvalue() {
      const dataList = this.dataList
      for (let i = 0; i < dataList.length; i++) {
        dataList[i].value = Math.ceil(Math.random() * 1000 - 1)
      }
    },
    initEcharts(res) {
      // eslint-disable-next-line no-undef
      const myChart = echarts.init(document.getElementById('main'))
      const option = {
        title: {
          text: '大数据分析学生地理分布信息',
          left: 'center'
        },
        tooltip: {
          // 数据格式化
          formatter: function(params, callback) {
            return (
              params.seriesName + '<br />' + params.name + ':' + params.value
            )
          }
        },
        visualMap: {
          min: 0,
          max: 10,
          left: 'left',
          top: 'bottom',
          text: ['高', '低'], // 取值范围的文字
          inRange: {
            color: ['#e0ffff', 'red'] // 取值范围的颜色
          },
          show: true // 图注
        },
        geo: {
          map: 'china', // 引入地图数据
          roam: false, // 不开启缩放和平移
          zoom: 1, // 视角缩放比例
          label: {
            normal: {
              show: true,
              fontSize: '10',
              color: 'rgba(0,0,0,0.7)'
            }
          },
          itemStyle: {
            normal: {
              borderColor: 'rgba(0, 0, 0, 0.2)'
            },
            emphasis: { // 高亮的显示设置
              areaColor: 'skyblue', // 鼠标选择区域颜色
              shadowOffsetX: 0,
              shadowOffsetY: 0,
              shadowBlur: 20,
              borderWidth: 0,
              shadowColor: 'rgba(0, 0, 0, 0.5)'
            }
          }
        },
        // 鼠标悬浮提示框
        series: [
          {
            name: '省份',
            type: 'map',
            geoIndex: 0,
            data: res
          }
        ]
      }
      myChart.setOption(option)
      myChart.on('click', (params) => {
        console.log(params.data)
        this.items = params.data
        this.show = !this.show
      })
    }
  }
}

</script>
<style lang='scss' scoped>
    #main {
        height: 650px;
        width: 800px;
        margin: auto;
    }
</style>
