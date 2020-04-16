<template>
  <div class="login-container clearfix">
    <div class="right">
      <el-form ref="loginForm" :model="loginForm" :rules="loginRules" class="login-form" auto-complete="on" label-position="left">
        <el-form-item prop="f_workernum">
          <span class="svg-container">
            <svg-icon icon-class="user" />
          </span>
          <el-input
            style="width:85%"
            ref="f_workernum"
            v-model="loginForm.f_workernum"
            placeholder="用户名"
            name="f_workernum"
            type="text"
            tabindex="1"
            auto-complete="on"
          />
        </el-form-item>

        <el-form-item prop="f_password">
          <span class="svg-container">
            <svg-icon icon-class="password" />
          </span>
          <el-input
            style="width:85%"
            :key="passwordType"
            ref="f_password"
            v-model="loginForm.f_password"
            :type="passwordType"
            placeholder="密码"
            name="f_password"
            tabindex="2"
            auto-complete="on"
            @keyup.enter.native="handleLogin"
          />
          <span class="show-pwd" @click="showPwd">
            <svg-icon :icon-class="passwordType === 'password' ? 'eye' : 'eye-open'" />
          </span>
        </el-form-item>

        <el-button :disabled="!loginForm.f_workernum || !loginForm.f_password" type="primary" @click.native.prevent="handleLogin">登录</el-button>
      </el-form>
    </div>
    
   
  </div>
</template>

<script>
import { validUsername } from '@/utils/validate'
import { setToken } from '@/utils/auth.js'
import Cookies from 'js-cookie'
import { getInfo } from '@/api/login'
import md5 from 'js-md5'
import * as formRoles from '@/common/formValidate.js'
import { mapActions } from 'vuex'

export default {
  name: 'Login',
  data() {
   const validateUsername = (rule, value, callback) => {
      if (!validUsername(value)) {
        callback(new Error('请输入正确的用户名'))
      } else if (isChineseChar(value)){
        callback(new Error('不允许中文用户名'))
      } else if (isTrim(value)){
        callback(new Error('不允许插入空格'))
      } else {
        callback()
      }
    }
    const validatePassword = (rule, value, callback) => {
      // callback()
      if (value.length < 6) {
        callback(new Error('密码不得少于六个字符'))
      } else {
        callback()
      }
    }
    return {
      roleId: null, // 角色id
      userInfo: {
        f_workernum: '',
        f_name: '',
        roles: [],
      },
      roleList: [],
      loginForm: {
        f_workernum: '',
        f_password: ''
      },
      loginRules: {
        f_workernum: [ formRoles.filterBlankSpace, formRoles.requireRule, formRoles.charRule, formRoles.numberRule],
        f_password: [{ required: true, trigger: 'blur', validator: validatePassword }]
      },
      loading: false,
      passwordType: 'password',
      redirect: undefined
    }
  },
  watch: {
    $route: {
      handler: function(route) {
        this.redirect = route.query && route.query.redirect
      },
      immediate: true
    }
  },
  methods: {
    ...mapActions('user',['Login','getUserData']),
    showPwd() {
      if (this.passwordType === 'password') {
        this.passwordType = ''
      } else {
        this.passwordType = 'password'
      }
      this.$nextTick(() => {
        this.$refs.password.focus()
      })
    },
     encode64(input) {  
      input+='';
      var keyStr = "ABCDEFGHIJKLMNOP" + "QRSTUVWXYZabcdef" + "ghijklmnopqrstuv"  
            + "wxyz0123456789+/" + "=";  
        var output = "";  
        var chr1, chr2, chr3 = "";  
        var enc1, enc2, enc3, enc4 = "";  
        var i = 0;  
        do {  
            chr1 = input.charCodeAt(i++);  
            chr2 = input.charCodeAt(i++);  
            chr3 = input.charCodeAt(i++);  
            enc1 = chr1 >> 2;  
            enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);  
            enc3 = ((chr2 & 15) << 2) | (chr3 >> 6);  
            enc4 = chr3 & 63;  
            if (isNaN(chr2)) {  
                enc3 = enc4 = 64;  
            } else if (isNaN(chr3)) {  
                enc4 = 64;  
            }  
            output = output + keyStr.charAt(enc1) + keyStr.charAt(enc2)  
                    + keyStr.charAt(enc3) + keyStr.charAt(enc4);  
            chr1 = chr2 = chr3 = "";  
            enc1 = enc2 = enc3 = enc4 = "";  
        } while (i < input.length);  
        var arr = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdef'.split('')
        var a = _ => Math.floor(Math.random() * 31 + 0);
        for(let i=0; i<5; i++){
          output += arr[a()];
        }
        var sp = '';
        for(let i=0; i<5; i++){
          sp += arr[a()]
        }
        output = output.slice(0,2) + sp + output.slice(2)
        return output;  
    },
    async handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          let mes = {
              f_workernum: this.encode64(this.loginForm.f_workernum) ,
              f_password: this.encode64(this.loginForm.f_password)
            }
            console.log(this.$store.dispatch)
            let res = await this.Login(mes)
          if(!res){
            this.flag = false;
            this.loginForm.f_password = '';
          }else{
            localStorage.setItem('un_',md5(this.loginForm.f_workernum))
            localStorage.setItem('md_',md5(this.loginForm.f_password))
            this.roleList = res.roles
            setToken(res.token)
            debugger
            this.userInfo.f_name = res.f_name;
            this.userInfo.f_workernum = res.f_workernum;
            this.userInfo.roles = res.roles;
            Cookies.set('userInfo', this.userInfo)
            this.$router.push({path: '/user'})
          }
        } else {
          console.log('error submit!!')
          return false
        }
      })
    },
  }
}
</script>

<style lang="scss">
/* 修复input 背景不协调 和光标变色 */
/* Detail see https://github.com/PanJiaChen/vue-element-admin/pull/927 */

$bg:#283443;
$light_gray:#545454;
$cursor: #545454;

@supports (-webkit-mask: none) and (not (cater-color: $cursor)) {
  .login-container .el-input input {
    color: $cursor;
  }
}

/* reset element-ui css */
.login-container {
  .el-input {
    display: inline-block;
    height: 47px;
    width: 100%;

    input {
      background: transparent;
      border: 0px;
      -webkit-appearance: none;
      border-radius: 0px;
      padding: 12px 5px 12px 15px;
      color: $light_gray;
      height: 47px;
      caret-color: $cursor;

      &:-webkit-autofill {
        box-shadow: 0 0 0px 1000px #fff inset !important;
        -webkit-text-fill-color: $cursor !important;
      }
    }
  }

  .el-form-item {
    border-bottom: 1px solid #d8d8d8;
    color: #454545;
  }
}
</style>

<style lang="scss" scoped>
$bg:#2d3a4b;
$dark_gray:#889aa4;
$light_gray:#eee;
$gradient:linear-gradient(to right, #3052d9, #700de8);

/deep/.el-dialog__wrapper {
  position: absolute !important;
}
/deep/.el-dialog__header {
  border: 0;
}
/deep/.el-dialog__body {
  padding: 0 20px 40px 20px;
}
/deep/.el-select {
  width: calc(100% - 92px);
}
.role-select {
  width: 80%;
  margin: 0 auto;
  height: 112px;
  display: flex;
  align-items: flex-end;
  border-bottom: 1px solid #d8d8d8;
  img {
    width: 92px;

  }
}
.slider {
  margin-top: 10%;
}

.findcode {
  text-align: center;
  width: 760px;
  margin: 0 auto;
  margin-bottom: 18%;
  margin-top: 8%;
  .boxshadow {
    box-shadow: 0 2px 4px rgba(0, 0, 0, .12), 0 0 6px rgba(0, 0, 0, .04);
  }
  p {
    font-size: 13px;
    position: relative;
    text-align: right;
    top: -5px;
    cursor: pointer;
    span {
      color: #2e56d9;
    }
  }
  .el-form-item {
    margin-bottom: 40px;
  }
  .el-form-item__content {
    position: relative;
    .el-button--primary {
      position: absolute;
      width: 150px;
      font-size: 14px;
      top: -42px;
      right: 0;
    }
  }
  h2 {
    color: #fff;
    letter-spacing: 1px;
    font-size: 20px;
    font-weight: 600;
    height: 70px;
    line-height: 70px;
    background: $gradient;
  }
  .el-form {
    padding: 50px 130px;
  }
  .el-button--primary {
    margin-top: 30px !important;
  }
}

.pohto {
  margin-top: 5%;
  text-align: center;
  position: relative;
  .scanning,.yiban {
    transition: all 0.3s;
    cursor: pointer;
    display: inline-block;
    padding: 8px;
    border-radius: 8px;
    width: 52px;
    height: 48px;
    background: #d8d8d8;
    line-height: 48px;
    text-align: center;
    img {
      width: 100%;
      height: 100%;
      fill: #fff;
    }
  }
  .scanning{
    margin-right: 18px;
  }
  .yiban{
    margin-left: 18px;
  }
  .scanning:hover {
    background: #2d56d9;
  }
  .yiban:hover {
    background: #f2df03;
  }
}

.forget {
  text-align: right;
  font-size: 14px;
  color: #aaa;
  margin-top: 8px;
  cursor: pointer;
}

.left_img,.right{
  float: left;
}
.left_img {
  width: 20%;
  height: 100%;
  position: relative;
  .l_bg {
    display: block;
    height: 100%;
    width: 100%;
  }
  .icons {
    position: absolute;
    top: 20px;
    left: 20px;
  } 
  .sch_logo {
    position: absolute;
    bottom: 55px;
    left: 50%;
    transform: translate(-50%,0);
  }
}
.right {
  height: 100%;
  width: 100%;
  position: relative;
  .el-button--primary {
    width: 255px;
    height: 56px;
    border-radius: 28px;
    background: $gradient;
    font-size: 18px;
    margin: 0 auto;
    display: block;
    margin-top: 60px;
    transition: all 0.3s;

    &:hover {
      opacity: 0.8;
    }
  }
}

.login-container {
  height: 100%;
  width: 100%;
  overflow: auto;

  .login-form {
    position: relative;
    width: 500px;
    padding: 10% 0 0 0;
    margin: 0 auto;
    overflow: hidden;
  }

  .svg-container {
    padding: 6px 5px 6px 15px;
    color: $dark_gray;
    vertical-align: middle;
    width: 30px;
    display: inline-block;
  }

  .title-container {
    width: 476px;
    margin: 0 auto;
    margin-bottom: 50px;
    img {
      width: 100%;
    }
  }

  .show-pwd {
    position: absolute;
    right: 10px;
    top: 7px;
    font-size: 16px;
    color: $dark_gray;
    cursor: pointer;
    user-select: none;
  }
}

//媒体查询
@media screen and (min-width:1366px) and (max-width:1680px){
	.login-container {
    .login-form {
      padding: 4% 0 0 0;
    }
  }
  .login-container  .title-container {
    margin-bottom: 20px;
  }
  .right .el-button--primary {
    margin-top: 30px;
  }
  .findcode {
    margin: 9% auto;
  }
}

</style>
