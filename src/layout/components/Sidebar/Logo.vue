<template>
  <div class="sidebar-logo-container" :class="{'collapse':collapse}">
    <transition name="sidebarLogoFade">
      <router-link v-if="collapse" key="collapse" class="sidebar-logo-link" to="/user">
        <p>
          Base
        </p>
        <!-- <img style="margin-left:8px;" src="@/assets/images/logo_a.png" class="sidebar-logo"> -->
      </router-link>
      <router-link v-else key="expand" class="sidebar-logo-link" to="/user">
        <p>
          Base
          <span>平台</span>
        </p>
        <!-- <img src="@/assets/images/logo_a.png" class="sidebar-logo"> -->
      </router-link>
    </transition>
  </div>
</template>

<script>
export default {
  name: 'SidebarLogo',
  props: {
    collapse: {
      type: Boolean,
      required: true
    }
  },
  data() {
    return {
      
    }
  }
}
</script>

<style lang="scss" scoped>
.sidebarLogoFade-enter-active {
  transition: opacity 1.5s;
}

.sidebarLogoFade-enter,
.sidebarLogoFade-leave-to {
  opacity: 0;
}

.sidebar-logo-container {
  position: relative;
  width: 100%;
  height: 50px;
  line-height: 50px;
  background: #201f2b;
  text-align: center;
  overflow: hidden;

  & .sidebar-logo-link {
    height: 100%;
    width: 100%;
    p {
      font-size: 20px;
      line-height: 50px;
      color: #fff;
      span {
        color: #db1430;
      }
    }
  }

  &.collapse {
    .sidebar-logo {
      margin-right: 0px;
    }
  }
}
.sidebar-logo-container.collapse{
    & .sidebar-logo-link {
      p {
        font-size: 18px;
        line-height: 50px;
        color: #fff;
      }
    }
  }
</style>
