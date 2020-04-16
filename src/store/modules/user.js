import { login, loginUserInfo } from '@/api/login'
import { getToken, removeToken } from '@/utils/auth'
import Cookies from 'js-cookie'

const state = {
    token: getToken(),
    name: '',
    avatar: '',
    userData: {
        f_id: "",
        f_workernum: "",
        f_name: "",
        roles: [],
        token: ""
    },
    userShowInfo: {
        roledesc: "",
        rolename: "",
        unitname: "",
        f_campusname: "",
        f_name: "",
        f_id: 0,
        f_workernum: "",
        f_roletype: "",
        f_loginRoleName: ''
    },
}

const mutations = {
    SET_TOKEN: (state, token) => {
        state.token = token
    },
    SET_NAME: (state, name) => {
        state.name = name
    },
    SET_AVATAR: (state, avatar) => {
        state.avatar = avatar
    },
    SET_USERDATA: (state, userdata) => {
        state.userData = userdata
    }
}

const actions = {
    // user login
    Login({ commit }, userInfo) {
        const { f_workernum, f_password } = userInfo
        return new Promise((resolve, reject) => {
            login({ f_workernum: f_workernum.trim(), f_password: f_password }).then(response => {
                if (response) {
                    commit('SET_USERDATA', response)
                }
                resolve(response)
            }).catch(error => {
                reject(error)
            })
        })
    },
    //获取登陆用户的角色信息
    async getUserLoginInfo({ state }) {
        if (Cookies.get('Authorization_')) {
            let mes = await loginUserInfo()
            if (mes) state.userShowInfo = mes;
            return mes
        }
    },
    // remove token
    resetToken({ commit }) {
        return new Promise(resolve => {
            commit('SET_TOKEN', '')
            removeToken()
            resolve()
        })
    },
}

export default {
    namespaced: true,
    state,
    mutations,
    actions
}