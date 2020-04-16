<template>
  <div>
    欢迎您：{{userInfo.f_name}}<div>职工号：{{userInfo.f_workernum}}</div>
  </div>
</template>

<script>
import Cookies from 'js-cookie'

export default {
  data() {
    return {
      userInfo: {},
    }
  },
   components: {
     
  },
  created() {
    this.userInfo = JSON.parse(Cookies.get('userInfo'))
  },
  methods: {

  }
}
</script>

<style>

</style>