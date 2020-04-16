<template>
  <el-button :type="type" :disabled="disabled" :icon="icon" :size="size" :circle="circle"><slot /></el-button>
  <!-- <el-button :type="type" :disabled="disabled" :icon="icon" :size="size" :circle="circle"><slot /></el-button> -->
</template>

<script>
import {mapGetters} from 'vuex'
export default {
  name:'Buttons',
  props:{
    type:{
      default:'success',
      type:String
    },
    resKey: {
      default:'',
      type:String
    },
    disabled:{
      default:false,
      type:Boolean
    },
    icon:{
      default:'',
      type:String
    },
    size:{
      default:'',
      type:String
    },
    circle:{
      default:false,
      type:Boolean
    },
    ignore: {
      default:false,
      type:Boolean
    }
  },
  computed:{
    ...mapGetters(['get_button_flag', 'getButtonRoleList']),
    buttonShow () {
      // if (this.resKey && this.getButtonRoleList.find(item => item.resKey == this.resKey) || this.resKey == 'allow') {
      //   return true
      // } else {
      //   return false
      // }
      return true
    },
  }
}
</script>

