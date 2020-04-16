/*
 * @Description: 分页器
 */

<template>
  <div class="pagination">
    <!-- 统计 -->
    <p>共有数据：<b>{{page.total}}</b>条</p>
    <slot name="pageTotal" ></slot>
    <!-- 分页 -->
    <el-pagination
      @size-change="handleSizeChange"
      @current-change="handleCurrentChange"
      :current-page="parseInt(page.page)"
      :page-sizes="[20, 40, 60, 80]"
      :pager-count="5"
      :page-size="page.page_size || 20"
      layout="total, sizes, prev, pager, next"
      :total="page.total">
    </el-pagination>
  </div>

</template>
<script>
  export default {
    name: "Pagination",
    props:{
      page:{  // 分页信息
        type:Object
      },
    },
    computed:{
      //根据数据长度判断布局
      layout(){
        return "total, prev, pager, next, jumper"
      }
    },
    methods: {
      //当前页回调
      handleCurrentChange(val) {
        this.$emit('click-page',val)
      },
      // 一页多少条回调
      handleSizeChange(val) {
        this.$emit('click-size',val)
      }
    }
  }
</script>

<style lang="scss" scoped>
.pagination{
  display:flex;
  justify-content: space-between;
  align-items: center;
  background: rgb(226,226,226);
  font-size:12px;
  height:40px;
  p {
    padding-left: 60px;
  }
  /deep/.el-pagination {
    .el-pagination__total {
      color: transparent;
    }
    button {
      background: transparent;
    }
    li {
      background: transparent;
    }
    /deep/.el-input__inner{
      background: transparent;
      border: 1px solid rgb(179, 179, 179)
    }
  }
}

</style>
