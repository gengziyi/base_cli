<!--作者：张凯-->
<template>
  <div class="comp-tag-search-wrap">
    <div
      class="comp-tag-search"
      @click="showSelect"
      v-click-outside="unShowSelect"
    >
      <ul class="comp-tag-list">
        <li
          @click.stop="clickStatus = !clickStatus"
          class="comp-tag-list-item"
          v-for="(item, index) in dataList"
          :key="index"
        >
          <div class="comp-tag-item-edit" v-show="item.isTag === false">
            <span
              style="display: inline-block;white-space: pre;font-size: 12px;"
              v-show="item.inputKey"
            >{{ item.inputKey }}:</span
            >
            <input
              @keyup.delete="backspaceAct(item, index)"
              @focus="inputFocus(item, index)"
              @keyup.enter="generateTag(item, index)"
              @input=" spanWidth( index + 'input', index + '_pre', item.inputValue, $event  ) "
              :id="index + 'input'"
              type="text"
              v-model="item.inputValue"
              style="width: 5px;max-width: 715px;"
            />
            <pre
              :id="index + '_pre'"
              style="display: inline-block;position: absolute;top: -9999px;"
            >{{ item.inputValue }}</pre
            >
          </div>
          <div
            class="comp-tag-item-tag"
            v-show="item.isTag"
            :title="item.inputValue"
          >
            <span v-if="item.inputKey">{{ item.inputKey + ":" }}</span>
            <span
              class="item-tag-span"
              @click="toEdit(item, index)"
              v-if="item.inputValue"
            >{{ item.inputValue }}</span
            >
            <a
              @click="deleteTag(item, index)"
              href="javascript:;"
              class="tc-tags-close-btn"
            >
              <b>&times;</b>
            </a>
          </div>
          <!-- 一级菜单的选择框 -->
          <div
            v-if="selectShow && tagNum === index && item.inputKey.length === 0" @click.stop class="first_select">
            <div class="title">{{ firstData.title }}</div>
            <ul class="fir_sec">
              <li v-for="(f, i) in propSelectData" :key="i" @click="changeKey(item, index, f)">
                {{ f.name }}
              </li>
            </ul>
          </div>
          <div class="comp-tag-components">
            <!-- 二级菜单的多选框-->
            <div class="tc-tags-checkbox"
                 v-if=" secondSelect && (item.type === 'select' || item.type === 'selectRadio') && nowTagNum === index ">
              <div class="noData" v-if="getSelectType(item.type, item.label).length === 0">暂无数据</div>
              <el-radio-group v-if="item.type === 'selectRadio'" style="overflow:auto;"
                              class="ly_flex_1 ly_flex ly_flex_col" v-model="checkList">
                <el-radio v-for="(f, i) in getSelectType(item.type, item.label)" :key="i" :label="f">{{ f.label }}
                </el-radio>
              </el-radio-group>
              <el-checkbox-group v-else style="overflow:auto;" class="ly_flex_1 ly_flex ly_flex_col"
                                 v-model="checkList">
                <el-checkbox
                  v-for="(f, i) in getSelectType(item.type, item.label)"
                  :key="i"
                  :label="f">{{ f.label }}
                </el-checkbox>
              </el-checkbox-group>
              <div class="tc-tag-footer ly_flex ly_flex_just_around">
                <a @click="checkAct(1, item, index)">
                  <el-button type="text">完成</el-button>
                </a>
                <a @click="checkAct(2, item, index)">
                  <el-button type="text">取消</el-button>
                </a>
              </div>
            </div>
            <!-- 日期区间选择 -->
            <div class="tc-tags-checkbox" v-if=" secondSelect && item.type === 'dateTim' && nowTagNum === index ">
              <el-date-picker
                v-model="item.inputValue"
                type="datetime"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changeDate(item, index)"
                placeholder="选择日期"
              />
            </div>
            <!-- 日期区间选择 -->
            <div class="tc-tags-checkbox" v-if=" secondSelect && item.type === 'dateTime' && nowTagNum === index ">
              <el-date-picker
                v-model="item.inputValue"
                type="date"
                format="yyyy-MM-dd"
                value-format="yyyy-MM-dd"
                @change="changeDate(item, index)"
                placeholder="选择日期"
              />
            </div>
            <!-- 时间区间选择 -->
            <div class="tc-tags-checkbox" v-if=" secondSelect && item.type === 'dateTimes' && nowTagNum === index ">
              <el-date-picker
                v-model="item.inputValue"
                type="datetimerange"
                format="yyyy-MM-dd HH:mm:ss"
                value-format="yyyy-MM-dd HH:mm:ss"
                @change="changeDate2(item, index)"
                range-separator="-"
                start-placeholder="开始日期"
                end-placeholder="结束日期"
              />
            </div>
            <div class="tc-tags-checkbox" v-if="secondSelect && item.type === 'address' && nowTagNum === index">
              <el-cascader
                @change="changeAddress(addressKey, item, index)"
                :options="$store.getters.codeJson"
                :props="pcaProps"
                v-model="addressKey"
              />
            </div>
          </div>
        </li>
      </ul>
      <div class="comp-tag-help-tip">
        <p>关键字用“|”分隔，过滤标签用回车键分隔</p>
      </div>
      <!-- 搜索按钮-->
      <div class="tc-search-icon">
        <i class="el-icon-error" @click.stop="resetTag()"/>
        <i class="el-icon-search" @click.stop="searchEmit"/>
      </div>
    </div>
  </div>
</template>

<script>
  import { setTimeout } from 'timers'
  import lodash from 'lodash'
  import { mapGetters } from 'vuex'
  import { debuglog } from 'util'
  import codeJson from '@/assets/pca-code.json' //
  export default {
    name: 'inputDemoNew',
    props: ['dataObj', 'defaultVal'],
    computed: {
      ...mapGetters(['get_mk_one_format']),
      dataObj_() {
        let { data } = this.dataObj
        if (data) {
          for (let i in data) {
            if (data[i].mk) {
              data[i].data = this.get_mk_one_format(data[i].mk)
            }
          }
        }
        return this.dataObj
      }
    },
    data() {
      return {
        addressKey: '', // 地址选择
        pcaProps: {
          value: 'code',
          label: 'name',
          children: 'children',
          leaf: 2
        },
        nowTagNum: 0, //当前选择到的tag数
        secondSelect: false, // 二级菜单是否显示
        // secondSelectType: null, // 二级菜单类型
        clickStatus: false, // 点击状态
        tagNum: 0, // 当前tag数
        selectShow: false, // 是否显示下拉
        dataList: [
          {
            inputKey: '', // 选择的键值
            inputValue: '', // 输入的内容
            isTag: false, // 是否为tag
            id: null,
            trueValue: '',
            label: '' // 参数名
          }
        ],
        firstData: {},
        firstObj: {},
        checkList: [], // 多选列表
        selectList: [],
        propSelectData: [], // 传入的下拉框数计
        propSelectDataBackup: [] // 替换掉的参数
      }
    },
    created() {
      this.initData()
    },
    // 自定义组件（点击div外的）
    directives: {
      'click-outside': {
        // 指令的定义
        bind(el, binding, vnode) {
          function clickHandler(e) {
            // 这里判断点击的元素是否是本身，是本身，则返回
            if (el.contains(e.target)) {
              return false
            }
            // 判断指令中是否绑定了函数
            if (binding.expression) {
              // 如果绑定了函数 则调用那个函数，此处binding.value就是handleClose方法
              binding.value(e)
            }
          }

          // 给当前元素绑定个私有变量，方便在unbind中可以解除事件监听
          el.__vueClickOutside__ = clickHandler
          document.addEventListener('click', clickHandler)
        },
        update() {
        },
        unbind(el, binding) {
          // 解除事件监听
          document.removeEventListener('click', el.__vueClickOutside__)
          delete el.__vueClickOutside__
        }
      }
    },
    watch: {
      dataList(val, oldVal) {
        //
        this.tagNum = val.length - 1
        if (val.length - this.tagNum >= 2) {
          console.log('增加')
        } else {
          console.log('减少')
          this.resetSelectData()
        }
      }
    },
    methods: {
      initData() {
        if (this.defaultVal) {
          // 如果有默认值传入
          this.showSecondSelect(false)
        } else {
          //  便利拿到数组，用新数组去做操作
          let arr = []
          this.firstData = this.dataObj_
          this.firstData.data.length &&
          this.firstData.data.forEach((item, index) => {
            item['index'] = index
            // if (item.type == 'select') {
            //   this.selectList = item.data
            // }
            arr.push({
              name: item.name,
              label: item.label,
              id: item.id,
              type: item.type,
              index: item.index,
              data: item.data
            })
          })
          this.firstData['newData'] = lodash.cloneDeep(arr)
          this.propSelectData = lodash.cloneDeep(arr)
        }
      },
      defaultValFormat() {
        // 默认值处理
        this.dataList = []
        this.defaultVal.forEach(item => {
          this.dataList.push({
            inputKey: item.key, // 选择的键值
            inputValue: item.value, // 输入的内容
            isTag: true, // 是否为tag
            id: null,
            trueValue: '',
            label: item.param // 参数名
          })
        })
      },
      searchEmit() {
        // 搜索
        let obj = {}
        let inputList = []
        this.firstData['newData'].forEach(item => {
          obj[item.label] = ''
        })
        if (this.dataList.length > 0) {
          this.dataList.forEach((item, index) => {
            if (item.inputValue.length != 0 && item.inputKey.length > 0) {
              this.dataList[index].isTag = true
              if (
                item.type == 'dateTim' ||
                item.type == 'dateTime' ||
                item.type == 'dateTimes'
              ) {
                obj.startTime = item.inputValue.split('.')[0]
                obj.endTime = item.inputValue.split('.')[1]
              } else if (item.type == 'select' || item.type == 'selectRadio') {
                obj[item.label] = item.trueValue.join(',')
              } else if (item.type == 'address') {
                obj[item.label] = item.trueValue
              } else {
                obj[item.label] = item.inputValue
              }
            }
          })
          if (this.dataList[this.dataList.length - 1].inputValue != '') {
            this.dataList.push({
              inputKey: '', // 选择的键值
              trueValue: '',
              inputValue: '', // 输入的内容
              isTag: false, // 是否为tag
              id: null,
              label: '' // 参数名
            })
          }
          this.selectShow = false
          this.secondSelect = false
          this.$emit('returnVal', obj)
        }
      },
      resetTagTeacher() {
        // 重置搜索条件
        this.dataList = [];
        // Object.assign(this.$data, {
        (this.nowTagNum = 0), //当前选择到的tag数
          (this.secondSelect = false), // 二级菜单是否显示
          // secondSelectType: null, // 二级菜单类型
          (this.clickStatus = false), // 点击状态
          (this.tagNum = 0), // 当前tag数
          (this.selectShow = false), // 是否显示下拉
          (this.dataList = [
            {
              inputKey: '', // 选择的键值
              inputValue: '', // 输入的内容
              isTag: false, // 是否为tag
              trueValue: '',
              id: null,
              label: '' // 参数名
            }
          ]),
          // firstData: {},
          // firstObj: {},
          (this.checkList = []), // 多选列表
          (this.selectList = []),
          // propSelectData: [], // 传入的下拉框数计
          (this.propSelectDataBackup = []) // 替换掉的参数
        // })
        this.propSelectData = this.firstData['newData']
        let nowNum = document.getElementById(0 + 'input')
        nowNum.style.width = 5 + 'px'
        this.initData()
      },
      resetTag() {
        // 重置搜索条件
        this.dataList = [];
        // Object.assign(this.$data, {
        (this.nowTagNum = 0), //当前选择到的tag数
          (this.secondSelect = false), // 二级菜单是否显示
          // secondSelectType: null, // 二级菜单类型
          (this.clickStatus = false), // 点击状态
          (this.tagNum = 0), // 当前tag数
          (this.selectShow = false), // 是否显示下拉
          (this.dataList = [
            {
              inputKey: '', // 选择的键值
              inputValue: '', // 输入的内容
              isTag: false, // 是否为tag
              trueValue: '',
              id: null,
              label: '' // 参数名
            }
          ]),
          // firstData: {},
          // firstObj: {},
          (this.checkList = []), // 多选列表
          (this.selectList = []),
          // propSelectData: [], // 传入的下拉框数计
          (this.propSelectDataBackup = []) // 替换掉的参数
        // })
        this.propSelectData = this.firstData['newData']
        let nowNum = document.getElementById(0 + 'input')
        nowNum.style.width = 5 + 'px'
        // nowNum.disabled = false;
        this.initData()
        this.searchEmit()
      },
      getSelectType(type, label) {
        let data = []
        this.firstData['newData'].forEach((item, index) => {
          if (type == item.type && label == item.label) {
            data = item.data
          }
        })
        return data
      },
      seekAddress(param) {
        if (param != undefined && param.length == 6) {
          let province = codeJson.find(function(elem) {
            return elem.code == param.substring(0, 2)
          })
          let city = province.children.find(function(elem) {
            return elem.code == param.substring(0, 4)
          })
          let area = city.children.find(function(elem) {
            return elem.code == param
          })
          return province.name + ' ' + city.name + ' ' + area.name
        }
      },
      changeAddress(val, item, index) {
        let nowNum = document.getElementById(index + 'input')
        let preDom = document.getElementById(index + '_pre')
        let value = preDom.clientWidth
        this.dataList[index].inputValue = this.seekAddress(val[2])
        this.dataList[index].trueValue = val[2]
        nowNum.style.width = 20 + value + 'px'
        this.secondSelect = false
        Object.assign(this.dataList[index], {
          isTag: true
        })
        this.dataList.push({
          inputKey: '', // 选择的键值
          inputValue: '', // 输入的内容
          trueValue: '',
          isTag: false, // 是否为tag
          id: null,
          label: '' // 参数名
        })
        this.addressKey = ''
        this.searchEmit()
      },
      checkAct(type, item, index) {
        if (item.type === 'selectRadio') {
          this.checkList = [this.checkList]
        }
        // 多选框选择完成
        if (type == 1) {
          // 完成
          if (this.checkList.length > 0) {
            let nowNum = document.getElementById(index + 'input')
            let preDom = document.getElementById(index + '_pre')
            let value = preDom.clientWidth
            let list = []
            let list1 = [] // 多选的value
            this.checkList.forEach(f => {
              list.push(f.label)
              list1.push(f.value)
            })

            this.dataList[index].inputValue = list.join('|')
            this.dataList[index].trueValue = list1
            nowNum.style.width = 20 + value + 'px'
            this.secondSelect = false
            Object.assign(this.dataList[index], {
              isTag: true
            })
            this.dataList.push({
              inputKey: '', // 选择的键值
              inputValue: '', // 输入的内容
              trueValue: '',
              isTag: false, // 是否为tag
              id: null,
              label: '' // 参数名
            })
            this.checkList = []
            this.searchEmit()
          } else {
          }
        } else if (type == 2) {
          // 取消
          //
          this.checkList = []
          Object.assign(this.dataList[index], {
            inputKey: '', // 选择的键值
            inputValue: '', // 输入的内容
            trueValue: '',
            isTag: false, // 是否为tag
            id: null,
            label: '' // 参数名
          })
          this.secondSelect = false
          this.resetSelectData()
        }
        this.unShowSelect()
        // document.getElementById(index + 'input').disabled = false
      },
      inputFocus(item, index) {
        // 输入框获取焦点
        if (item.type == 'input') {
        } else if (
          item.type == 'dateTim' ||
          item.type == 'dateTime' ||
          item.type == 'dateTimes'
        ) {
          if (item.inputKey.length > 0) {
            this.showSecondSelect(true)
          }
        } else if (item.type === 'select' || item.type === 'selectRadio') {
          if (item.inputKey.length > 0) {
            this.showSecondSelect(true)
          }
        }
      },
      // 选择查询的时间区间
      changeDate(item, index) {
        // // 具体的时间格式该怎么发送，到时候和后端具体商量
        let nowNum = document.getElementById(index + 'input')
        let preDom = document.getElementById(index + '_pre')
        let value = preDom.clientWidth
        nowNum.style.width = 20 + value + 'px'
        this.secondSelect = false
        Object.assign(this.dataList[index], {
          isTag: true,
          inputValue: this.dataList[index].inputValue
        })
        this.dataList.push({
          inputKey: '', // 选择的键值
          trueValue: '',
          inputValue: '', // 输入的内容
          isTag: false, // 是否为tag
          id: null,
          label: '' // 参数名
        })
        this.searchEmit()
        this.unShowSelect()
      },
      // 选择查询的时间区间
      changeDate2(item, index) {
        let nowNum = document.getElementById(index + 'input')
        let preDom = document.getElementById(index + '_pre')
        let value = preDom.clientWidth
        nowNum.style.width = 20 + value + 'px'
        this.secondSelect = false
        Object.assign(this.dataList[index], {
          isTag: true,
          inputValue: this.dataList[index].inputValue.join('.')
        })
        this.dataList.push({
          inputKey: '', // 选择的键值
          trueValue: '',
          inputValue: '', // 输入的内容
          isTag: false, // 是否为tag
          id: null,
          label: '' // 参数名
        })
        this.searchEmit()
        this.unShowSelect()
      },
      toEdit(item, index) {
        // 更改为修改状态
        this.nowTagNum = index
        Object.assign(this.dataList[index], {
          isTag: false
        })
        setTimeout(() => {
          let nowNum = document.getElementById(index + 'input')
          nowNum.focus()
          nowNum.select()
        }, 200)
      },
      resetSelectData() {
        // 恢复标签数
        let list = [] // dataList
        let list1 = [] // backup
        let list2 = [] // prop
        this.dataList.forEach((item, index) => {
          list.push(item.label)
        })
        this.propSelectDataBackup.forEach((item, index) => {
          list1.push(item.label)
        })
        this.propSelectData.forEach((item, index) => {
          list2.push(item.label)
        })
        this.firstData['newData'].forEach((item, index) => {
          if (
            !list.includes(item.label) &&
            list1.includes(item.label) &&
            !list2.includes(item.label) &&
            item.label != ''
          ) {
            this.propSelectData.push(item)
            list1.forEach((f, i) => {
              if (f == item.label) {
                this.propSelectDataBackup.splice(i, 1)
              }
            })
          }
        })
        this.propSelectData.sort((a, b) => a.id - b.id)
      },
      deleteTag(item, index) {
        // 删除已存在tag
        let nowNum = document.getElementById(index + 'input')
        nowNum.style.width = 5 + 'px'
        if (this.tagNum > 0) {
          this.dataList.splice(index, 1)
          setTimeout(() => {
            // let nowNum = document.getElementById(this.tagNum - 1 + 'input')
            nowNum.focus()
            this.showSelect()
          }, 200)
        } else {
          Object.assign(this.dataList[0], {
            inputKey: '', // 选择的键值
            inputValue: '', // 输入的内容
            trueValue: '',
            isTag: false, // 是否为tag
            id: null,
            label: '' // 参数名
          })
        }
      },
      //点击除了聚焦地方的别的地方触发的事件
      unShowSelect() {
        this.selectShow = false
      },
      showSelect() {
        // 显示下拉框
        if (this.dataList[this.tagNum].inputValue.length == 0) {
          if (this.propSelectData.length > 0) {
            this.selectShow = true
          }
        }
        let nowNum = document.getElementById(this.tagNum + 'input')
        nowNum.style.display = 'inline-block'
        nowNum.focus()
      },
      //input的长度根据文本的长度改变
      spanWidth(id, ref, val, e) {
        let value1 = e.target.value.length * 4 - ''
        let nowNum = document.getElementById(this.tagNum + 'input')
        let preDom = document.getElementById(this.tagNum + '_pre')
        let value = preDom.clientWidth
        nowNum.style.width = 20 + value + (value1 || 0) + 'px'
        // nowNum.style.width = (value) + 'px'
        if (val.length > 0) {
          this.selectShow = false
        } else {
          this.selectShow = true
        }
        this.showSecondSelect(false)
      },
      // nowBlur(index){
      //   let nowNum=document.getElementById(index+'input')
      //   nowNum.blur()
      //   nowNum.disabled=true
      // },
      // nowFocus(index){
      //   let nowNum=document.getElementById(index+'input')
      //   nowNum.focus()
      //   nowNum.disabled=false
      // },
      changeKey(item, index, f) {
        // 改变key值
        this.nowTagNum = index
        Object.assign(this.dataList[index], {
          inputKey: f.name, // 选择的键值
          label: f.label
        })
        switch (f.type) {
          case 'input':
            Object.assign(this.dataList[index], {
              type: 'input'
            })
            this.showSecondSelect(true)
            break
          case 'dateTim':
            Object.assign(this.dataList[index], {
              type: 'dateTim'
            })
            this.showSecondSelect(true)
            // this.nowBlur(index)
            break
          case 'dateTime':
            Object.assign(this.dataList[index], {
              type: 'dateTime'
            })
            this.showSecondSelect(true)
            // this.nowBlur(index)
            break
          case 'dateTimes':
            Object.assign(this.dataList[index], {
              type: 'dateTimes'
            })
            this.showSecondSelect(true)
            // this.nowBlur(index)
            break
          case 'select':
            Object.assign(this.dataList[index], {
              type: 'select'
            })
            this.showSecondSelect(true)
            // this.nowBlur(index)
            break
          case 'address':
            Object.assign(this.dataList[index], {
              type: 'address'
            })
            this.showSecondSelect(true)
            break
          case 'selectRadio': //  当type为selectRadio时候下拉框为单选
            Object.assign(this.dataList[index], {
              type: 'selectRadio'
            })
            this.showSecondSelect(true)
            break
          case 'cascader': //  当type为cascader时候联动选择器
            Object.assign(this.dataList[index], {
              type: 'cascader'
            })
            this.showSecondSelect(true)
            break
        }
        this.propSelectData.forEach((sItem, sIndex) => {
          if (f.label == sItem.label) {
            this.propSelectDataBackup.push(sItem)
            this.propSelectData.splice(sIndex, 1)
          }
        })
        // let nowNum = document.getElementById(index + 'input')
        // nowNum.focus()
      },
      showSecondSelect(type) {
        this.secondSelect = type
      },
      backspaceAct(item, index) {
        // 退格删除tag
        if (index > 0 && item.inputKey.length + item.inputValue.length == 0) {
          let nowNum = document.getElementById(index - 1 + 'input')
          nowNum.style.width = 5 + 'px'
          if (item.inputKey.length == 0 && item.inputValue.length == 0) {
            this.dataList.splice(index - 1, 1)
          }
          setTimeout(() => {
            let nowNum = document.getElementById(index - 1 + 'input')
            nowNum.focus()
            this.showSelect()
          }, 200)
        } else if (
          index == 0 &&
          item.inputKey.length + item.inputValue.length == 0
        ) {
          let nowNum = document.getElementById(0 + 'input')
          nowNum.style.width = 5 + 'px'
          Object.assign(this.dataList[0], {
            inputKey: '', // 选择的键值
            inputValue: '', // 输入的内容
            isTag: false, // 是否为tag
            trueValue: '',
            id: null,
            label: '' // 参数名
          })
        }
      },
      generateTag(item, index) {
        // 回车生成tag
        if (item.inputKey.length > 0) {
          if (this.dataList[index].inputValue.length > 0) {
            Object.assign(this.dataList[index], {
              isTag: true
            })
            this.dataList.push({
              inputKey: '', // 选择的键值
              trueValue: '',
              inputValue: '', // 输入的内容
              isTag: false, // 是否为tag
              id: null,
              label: '' // 参数名
            })
            setTimeout(() => {
              let nowNum = document.getElementById(index + 1 + 'input')
              nowNum.focus()
            }, 200)
          }
          this.showSecondSelect(false)
          this.searchEmit()
        }
      }
    }
  }
</script>

<style lang="scss" scoped>
  .comp-tag-search-wrap {
    position: relative;

    .comp-tag-search {
      width: 100%;
      position: relative;
      box-sizing: border-box;
      background-color: #fff;
      border-radius: 2px;
      box-shadow: 1px 1px 1px 1px #ddd;
      // height: 30px;
      height: auto;
      // overflow: hidden;
      // cursor: text;
      .comp-tag-list {
        // height: 100%;
        .comp-tag-list-item {
          height: 100%;
          float: left;
          position: relative;
          padding-left: 5px;
          height: 20px;
          margin-top: 5px;
          // display: inline-block;
          .comp-tag-item-edit {
            & > span {
              font-size: 12px;
            }

            & > input {
              display: inline-block;
              border: none;
              font-size: 12px;
            }
          }

          .comp-tag-item-tag {
            height: 20px;
            line-height: 18px;
            border: 1px solid #ddd;
            color: #000;
            font-size: 12px;
            background-color: #f2f2f2;
            margin-bottom: 2px;
            // padding: 0 10px;
            padding: 0 14px 0 8px;
            float: left;
            cursor: pointer;
            box-sizing: border-box;
            max-width: 178px;
            // text-overflow: ellipsis;
            overflow: hidden;
            margin-right: 5px;
            word-break: break-all;
            display: flex;

            &:hover {
              background: #e5e5e5;
            }

            .tc-tags-close-btn {
              position: absolute;
              z-index: 99;
              right: 8px;
              bottom: 2px;
              line-height: 15px;
              height: 16px;
              font-size: 16px;
              display: block;
            }

            .item-tag-span {
              text-overflow: ellipsis;
              overflow: hidden;
              white-space: nowrap;
              display: inline;
            }
          }

          .first_select {
            position: absolute;
            display: flex;
            flex-direction: column;
            top: 30px;
            background: #ffffff;
            border: 1px solid #ebebeb;
            min-width: 200px;
            max-height: 240px;
            font-size: 12px;
            box-shadow: 1px 1px 1px 1px #e1e1e1;
            z-index: 2001;

            .title {
              color: #bbb;
              line-height: 32px;
              padding: 0 10px;
              cursor: default;
            }

            .fir_sec {
              li {
                width: 100%;
                padding: 0 10px;
                line-height: 32px;
                cursor: pointer;

                &:hover {
                  background: rgb(242, 242, 242);
                }
              }
            }
          }

          .comp-tag-components {
            .tc-tags-checkbox {
              position: absolute;
              display: flex;
              flex-direction: column;
              top: 30px;
              background: #ffffff;
              border: 1px solid #ebebeb;
              min-width: 200px;
              max-height: 240px;
              font-size: 12px;
              box-shadow: 1px 1px 1px 1px #e1e1e1;
              z-index: 2002;
              .noData{
                line-height: 25px;
                text-align: center;
                color: #BBBBBB;
              }
              .el-checkbox,
              .el-radio {
                margin: 0;
                width: 95%;
                padding-left: 5%;
                line-height: 25px;

                &:hover {
                  background: rgb(242, 242, 242);
                }
              }

              .el-checkbox__input.is-checked + .el-checkbox__label {
                color: #000;
              }

              .tc-tag-footer {
                border-top: 1px solid #ddd;

                a {
                  width: 100%;
                  text-align: center;

                  &:first-child {
                    border-right: 1px solid #ddd;
                  }

                  &:last-child {
                    .el-button--text {
                      color: #000;
                    }
                  }
                }
              }

              .title {
                color: #bbb;
                line-height: 32px;
                padding: 0 10px;
                cursor: default;
              }

              .fir_sec {
                li {
                  width: 100%;
                  padding: 0 10px;
                  line-height: 32px;
                  cursor: pointer;

                  &:hover {
                    background: rgb(242, 242, 242);
                  }
                }
              }
            }
          }
        }
      }
    }

    .comp-tag-help-tip {
      position: relative;
      font-size: 12px;
      text-align: left;
      display: inline-block;
      line-height: 28px;
      overflow: hidden;
      vertical-align: top;
      height: 28px;

      p {
        color: #bbb;
        padding-left: 10px;
        line-height: 30px;
      }
    }

    .tc-search-icon {
      // display: flex;
      // float: right;
      position: absolute;
      top: 0;
      right: 5px;

      i {
        font-weight: 900;
        line-height: 30px;
        float: left;
        padding: 0 4px;
        font-size: 14px;
        color: rgb(136, 136, 136);
        cursor: pointer;

        &:hover {
          color: rgb(68, 68, 68);
        }
      }
    }

    .fir_sec {
      overflow: auto;
    }
  }
</style>
