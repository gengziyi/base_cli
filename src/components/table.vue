// 含有树状表格的封装
// 作者：wang
// 时间：2019-7-16
<template>
  <div class="mf-table-body ly_flex ly_flex_col">
    <el-table
     :show-header='showHeader'
      :tree-props="{children: 'children', hasChildren: 'hasChildren'}"
      stripe
      ref="table"
      :max-height='height_'
      @sort-change='tableSortChange'
      :sort-orders="['ascending', 'descending', null]"
      :header-cell-style="{
        fontSize: '13px',
        height: '40px',
        lineHeight: '40px',
        padding: '0',
        borderBottom: '1px solid rgb(239,236,236) !important'
      }"
      :row-key="rowKey"
      :data="dataSource"
      style="width: 100%"
      @selection-change="handleSelectionChange">
      
      <!--选择-->
      <el-table-column :selectable="selectable" v-if="hasSelection" type="selection" width="55"></el-table-column>
      <!--序号-->
      <el-table-column v-if="hasIndex" align="center" type="index" label="ID" width="40"></el-table-column>
      <!-- 折叠面板的图标 -->
      <el-table-column v-if="hasExpand" width="150">
        <template slot-scope="scope">
          <span
            class="tree-ctrl"
            @click.stop="toogleExpand(scope.row)"
          >
            <i v-if="!scope.row._expanded" class="el-icon-plus"></i>
            <i v-else class="el-icon-minus" style="margin-left:22px;"></i>
          </span>
        </template>
      </el-table-column>
      <!-- 折叠面板的数据 -->
      <el-table-column width="1" v-if="hasExpand" type="expand">
        <template slot-scope="props">
          <el-table :data="props.row.children" style="width: 100%" :header-cell-style="{
          }">
            <el-table-column width="150"></el-table-column>
            <el-table-column show-overflow-tooltip v-for="( column, index) in columns"
                      align="center"
                      header-align="center"
                      :sortable="column.hasSort"
                      :width="column.width"
                      :key="index"
                      :prop="column.prop"
                      :label="column.label">
            </el-table-column>
            <!--操作-->
           <slot name="childColumn"></slot>
          </el-table>
        </template>
      </el-table-column>
      <!--数据源-->
      <el-table-column show-overflow-tooltip v-for="(column, index) in columns"
                      align="center"
                      header-align="center"
                      :sortable="column.hasSort"
                      :key="index"
                      :prop="column.prop"
                      :width="column.width"
                      :label="column.label">
                      <template  slot-scope="scope">
                        <u @click="showMessage(scope.row)" class="u_class" v-if="column.is_u">{{column.type ? get_chickens(scope.row[column.prop]) : scope.row[column.prop] }}</u>
                        <span v-else-if="column.rigui">{{scope.row[column.prop] ? scope.row[column.prop] + '' : ''}}<span>{{aFunc(scope.row.f_duration)}}</span></span>
                        <span v-else-if="column.address">{{scope.row[column.prop] ? seekAddress(scope.row[column.prop] + '') : ''}}</span>
                        <span v-else-if="column.data">{{scope.row[column.prop] ? feedData(scope.row[column.prop],column.data) : ''}}</span>
                        <span v-else>{{column.type ? get_chickens(scope.row[column.prop]) : scope.row[column.prop] }}</span>
                      </template>
      </el-table-column>
      <!--操作-->
      <slot name="handleColumn"></slot>
    </el-table>
    <slot name="pagination"></slot>
  </div>
</template>

<script>
import { mapGetters,mapActions } from 'vuex'
import codeJson from '@/assets/pca-code.json' //地区 code 表
  export default {
    name: "Table",
    props:{
      rowKey:{
        type:String,
        default:'id'
      },
      //是否可以选择
      hasSelection:{
        type:Boolean,
        default:function () {
          return false
        }
      },
      selectable: {
        type: Function
      },
      //是否有序列项
      hasIndex:{
        type:Boolean,
        default:function () {
          return false
        }
      },
      //是否折叠面板
      hasExpand:{
        type:Boolean,
        default:function () {
          return false
        }
      },
      // 这是相应的字段展示
      columns: {
        type: Array,
        default: function () {
          return []
        }
      },
      // 这是数据源
      dataSource: {
        type: Array,
        default: function () {
          return []
        }
      },
      btnHeight: {
        type: Number,
        default: function() {
          return 220
        }
      },
      //是否隐藏表头
      showHeader:{
        type:Boolean,
        default:true
      }
    },
    data() {
      return {
        height_:this.tableHeight - this.btnHeight,
      }
    },
    created() {
      this.$resize_(this,'height_',this.btnHeight)

    },
    methods: {
      ...mapActions('message',['showMessage']),
      aFunc (val) {
        //处理表格
        if (val) {
          if (val == '1') {
            return '1个月'
          } else if(val == '2') {
            return '2个月'
          } else if(val == '3') {
            return '3个月'
          } else if(val == '12') {
            return '一年'
          } else if(val == '24') {
            return '两年'
          } else if(val == '36') {
            return '三年'
          } else {
            return ''
          }
        } else {
          return ''
        }
        return ''
      },
      seekAddress (param) {
        if (param != undefined && param.length == 6) {
          let province = codeJson.find(function(elem){
              return elem.code == param.substring(0,2)
          });
          let city = province.children.find(function(elem){
              return elem.code == param.substring(0,4)
          });
          let area = city.children.find(function(elem){
              return elem.code == param
          });
          return province.name + ' ' + city.name + ' ' + area.name
        }
      },
      feedData( row,param) {
        let name =  param.find(i => i.value == row).label
        return name
      },
      //将选中的行发送到父组件
      handleSelectionChange(val) {
        const selectionArr = [];
        val.forEach(function (el) {
          selectionArr.push(el);
        });
        this.$emit('commitSelection', selectionArr);
      },
      tableSortChange(val) {
        this.$emit('table-sort',val)
      },
      toogleExpand(row) {
        let $table = this.$refs.table;
        this.dataSource.map((item) => {
          if (row.id != item.id) {
            item['_expanded'] = false
            $table.toggleRowExpansion(item, false)
          }
        })
        row['_expanded'] = !row['_expanded']
        $table.toggleRowExpansion(row)
      }
    },
    computed: {
      ...mapGetters(['get_chickens'])
    }
  }
</script>

<style lang="scss" scoped>
/deep/.el-table__expand-icon {
  color: transparent;
}
// .mf-table-body {
//   height: 100%;
//   overflow: hidden;
// }
// /deep/.el-table {
//   height: 100%;
//   overflow: auto;
// }
/deep/.el-table__expanded-cell[class*=cell] {
    padding: 0;
    border-bottom: 0;
    /deep/.el-table__header-wrapper {
      display: none;
    }
}
.u_class {
  cursor: pointer;
  &:hover {
    color: #2e56d9;
  }
}

</style>
