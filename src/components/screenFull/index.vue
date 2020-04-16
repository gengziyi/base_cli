<template>
  <div>
    <el-tooltip class="item" effect="dark" content="全屏" placement="bottom">
      <img :src="isFullscreen?small:full" style="display:block;width:20px;height: 40px;margin-top: 4px;" @click="click" />
    </el-tooltip>
    <!-- <svg-icon :icon-class="isFullscreen?'exit-fullscreen':'fullscreen'" @click="click" /> -->
  </div>
</template>

<script>
import screenfull from 'screenfull'

export default {
  name: 'Screenfull',
  data() {
    return {
      isFullscreen: false,
      full: require('@/assets/images/svg/full.svg'),
      small: require('@/assets/images/svg/small.svg'),
    }
  },
  mounted() {
    this.init()
  },
  methods: {
    click() {
      if (!screenfull.enabled) {
        this.$message({
          message: 'you browser can not work',
          type: 'warning'
        })
        return false
      }
      screenfull.toggle()
    },
    init() {
      if (screenfull.enabled) {
        screenfull.on('change', () => {
          this.isFullscreen = screenfull.isFullscreen
        })
      }
    }
  }
}
</script>

<style scoped lang='scss'>
.screenfull-svg {
  display: inline-block;
  fill: #5a5e66;;
  width: 20px;
  height: 20px;
  vertical-align: 10px;
  cursor: pointer;
}
.i {
  transform: rotate(45deg);
  cursor: pointer;
  color: #fff;
  font-size: 27px;
  position: relative;
  top: 4px;
}
</style>
