<template>
  <div class="app-container">

    <el-button :loading="downloadLoading" style="margin-bottom:20px" type="primary" icon="el-icon-document" @click="handleDownload">Export</el-button>

    <el-table
      ref="multipleTable"
      v-loading="listLoading"
      :data="list"
      element-loading-text="Loading"
      border
      fit
      highlight-current-row
    >
      <el-table-column align="center" label="Id" width="95">
        <template slot-scope="scope">
          {{ scope.$index }}
        </template>
      </el-table-column>
      <el-table-column label="Main Information" align="center">
        <el-table-column label="Title">
          <template slot-scope="scope">
            {{ scope.row.title }}
          </template>
        </el-table-column>
        <el-table-column label="Author" width="110" align="center">
          <template slot-scope="scope">
            <el-tag>{{ scope.row.author }}</el-tag>
          </template>
        </el-table-column>
        <el-table-column label="Readings" width="115" align="center">
          <template slot-scope="scope">
            {{ scope.row.pageviews }}
          </template>
        </el-table-column>
      </el-table-column>
      <el-table-column align="center" label="Date" width="220">
        <template slot-scope="scope">
          <i class="el-icon-time" />
          <span>{{ scope.row.timestamp | parseTime('{y}-{m}-{d} {h}:{i}') }}</span>
        </template>
      </el-table-column>
    </el-table>

  </div>
</template>

<script>
import { fetchList } from '@/api/article'
import { parseTime } from '@/utils'
import testData from './test.json'
export default {
  name: 'MergeHeader',
  data() {
    return {
      list: testData,
      listLoading: true,
      downloadLoading: false
    }
  },
  created() {
    this.fetchData()
  },
  methods: {
    fetchData() {
      // this.listLoading = true
      // fetchList(this.listQuery).then(response => {
      //   this.list = response.data.items
        // this.listLoading = false
      // })
      this.list = testData
      console.log(this.dealData(this.list))
      this.listLoading = false
    },
    dealData(data,startIndex){
      var resultArr = []
      var beginIndex
      var endIndex
      if(data.length === 0){//判断传进来的数组是不是长度为0的 直接给他返回空数组
        return []
      }else{
        if(startIndex==null || startIndex == undefined){ //如果startIndex没传 那就证明是第一次处理，索引从0开始遍历处理
          beginIndex = 0
        }
        if(startIndex>data.length){ // 开始索引大于数组长度 证明已经处理完成了，可以给他终止返回了
          return
        }
        if(!startIndex){ // 没传startIndex，就是初次循环处理
          for(var i=0;i<data.length;i++){
            for(var j = 0;j<data.length;j++){
              if(data[i].outbound_plan_no !== data[j].outbound_plan_no){ // 第一个索引数据开始往后对比计划单号，如果是一样那就证明是同一个单号，直到不一样，那肯定就是第二个的单号了
                endIndex = j-1 // 记录下到下一个的单号的索引，下次循环就是从这个index开始了
                // 下面就是要合并的行了，要打开excel表查看A对应的是哪个字段
                resultArr.push(`A${beginIndex+2}:A${endIndex+2}`, `B${beginIndex+2}:B${endIndex+2}`, `E${beginIndex+2}:E${endIndex+2}`, `I${beginIndex+2}:I${endIndex+2}`, `J${beginIndex+2}:J${endIndex+2}`) // A代表计划单号
                // resultArr.push(`B${beginIndex+2}:B${endIndex+2}`) // B出货日期
                // resultArr.push(`E${beginIndex+2}:E${endIndex+2}`) // E状态
                // resultArr.push(`I${beginIndex+2}:I${endIndex+2}`) // I店铺
                // resultArr.push(`J${beginIndex+2}:J${endIndex+2}`) // 站点
                return resultArr.concat(this.dealData(data,endIndex+1));
              }
            }
            // 这里证明循环结束了 单号还是一样的情况
            resultArr.push(`A${beginIndex+2}:A${(data.length-1)+2}`, `B${beginIndex+2}:B${(data.length-1)+2}`, `E${beginIndex+2}:E${(data.length-1)+2}`, `I${beginIndex+2}:I${(data.length-1)+2}`, `J${beginIndex+2}:J${(data.length-1)+2}`)     
            return resultArr
          }
        }else{ // 传了startIndex 那就证明非第一次循环处理了
          for(var i=startIndex;i<data.length;i++){
            for(var j = startIndex;j<data.length;j++){
              // 根据传进来的索引开始循环对比
              if(data[i].outbound_plan_no !== data[j].outbound_plan_no){
                endIndex = j-1 // 同上 记录下一个订单的索引，然后push需要合并的行
                resultArr.push(`A${startIndex+2}:A${endIndex+2}`, `B${startIndex+2}:B${endIndex+2}`, `E${startIndex+2}:E${endIndex+2}`, `I${startIndex+2}:I${endIndex+2}`, `J${startIndex+2}:J${endIndex+2}`)
                return resultArr.concat(this.dealData(data,endIndex+1))
              }
            }
          }
          resultArr.push(`A${startIndex+2}:A${(data.length-1)+2}`, `B${startIndex+2}:B${(data.length-1)+2}`, `E${startIndex+2}:E${(data.length-1)+2}`, `I${startIndex+2}:I${(data.length-1)+2}`, `J${startIndex+2}:J${(data.length-1)+2}`)
        }
        
      }
    },
    handleDownload() {
      this.downloadLoading = true
      // import('@/vendor/Export2Excel').then(excel => {
      //   const multiHeader = [['Id', 'Main Information', '', '', 'Date']]
      //   const header = ['', 'Title', 'Author', 'Readings', '']
      //   const filterVal = ['id', 'title', 'author', 'pageviews', 'display_time']
      //   const list = this.list
      //   const data = this.formatJson(filterVal, list)
      //   const merges = ['A1:A2', 'B1:D1', 'E1:E2']
      //   excel.export_json_to_excel({
      //     multiHeader,
      //     header,
      //     merges,
      //     data
      //   })
      //   this.downloadLoading = false
      // })
      import('@/vendor/Export2Excel').then(excel => {
        const tHeader = ['计划单号', '出货日期', '产品编码', '名称', '状态', '冻结数量', '计划出货数', '已发数', '店铺', '站点']
        const filterVal = ['outbound_plan_no', 'outbound_plan_date', 'sku', 'name', 'status', 'frozen_num', 'qty', 'issued_num', 'shop_name', 'eshop_code']
        const list = this.list
        const data = this.formatJson(filterVal, list)
        const merges = this.dealData(this.list)
        
        excel.export_json_to_excel({
          header: tHeader,
          data,
          merges
          // filename: this.filename,
          // autoWidth: this.autoWidth,
          // bookType: this.bookType
        })
        this.downloadLoading = false
      })
    },
    formatJson(filterVal, jsonData) {
      return jsonData.map(v => filterVal.map(j => {
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
