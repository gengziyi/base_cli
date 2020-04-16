<template>
  <div class="navbar">
    <!-- 侧边栏缩缩缩 -->
    <hamburger :is-active="sidebar.opened" class="hamburger-container" @toggleClick="toggleSideBar" />
    <!-- 面包屑 -->
    <breadcrumb class="breadcrumb-container" />
    
    <!-- 退出系统 -->
      <div class="right-menu" @click="getOut">
        <el-tooltip class="item" effect="dark" content="退出系统" placement="bottom">
          <img src="@/assets/images/svg/exit.svg" style="display:block;width:20px;height: 40px;margin-top: 4px;" />
        </el-tooltip>
      </div>
      <!-- 全屏 -->
      <div class="right-menu right-menu1">
        <screenfull></screenfull>
      </div>
      <div class="right-menu"> 
        <span>角色：  {{userInfo.f_role}}</span>
      </div>
      <div class="right-menu">
        <span>登录人：  {{userInfo.f_name}}</span>
      </div>
  </div>
</template>

<script>
import { mapGetters, mapActions } from 'vuex'
import Cookies from 'js-cookie'
import { removeToken } from '@/utils/auth.js'
import Breadcrumb from '@/components/Breadcrumb'
import Hamburger from '@/components/Hamburger'
import Screenfull from "@/components/screenFull";

export default {
  data() {
    return {
      userInfo: {}
    }
  },
  components: {
    Breadcrumb,
    Hamburger,
    Screenfull
  },
  computed: {
    ...mapGetters([
      'sidebar',
      'avatar'
    ])
  },
  async created() {
    this.userInfo = JSON.parse(Cookies.get('userInfo'))
    //获取用户角色列表
    // await this.getUserLoginInfo()
  },
  methods: {
    // ...mapActions('user',['getUserLoginInfo']),
    toggleSideBar() {
      this.$store.dispatch('app/toggleSideBar')
    },
    async logout() {
      await this.$store.dispatch('user/logout')
      this.$router.push(`/login?redirect=${this.$route.fullPath}`)
    },
     //注销
    getOut() {
      this.$confirm("此操作将退出本系统, 是否继续?", "提示", {
        confirmButtonText: "确定",
        cancelButtonText: "取消",
        type: "warning"
      })
        .then(() => {
          removeToken();
          this.$router.push("/login");
        })
        .catch(() => {
          this.$message({
            type: "info",
            message: "已取消"
          });
        });
    },
  }
}
</script>

<style lang="scss" scoped>
.navbar {
  height: 50px;
  overflow: hidden;
  position: relative;
  background: #201f2b;
  box-shadow: 0 1px 4px rgba(0,21,41,.08);

  .hamburger-container {
    line-height: 46px;
    height: 100%;
    float: left;
    cursor: pointer;
    transition: background .3s;
    -webkit-tap-highlight-color:transparent;

    &:hover {
      background: rgba(0, 0, 0, .025)
    }
  }

  .breadcrumb-container {
    float: left;
  }

  .right-menu {
    float: right;
    height: 100%;
    line-height: 50px;
    margin-right: 30px;
    span {
      font-size: 13px;
      color: #c7c5d8;
    }
  }
  
}
</style>
