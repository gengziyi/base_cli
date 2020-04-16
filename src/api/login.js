import HTTP_ from '@http'

// 登录接口
export function login(data) {
    return HTTP_.POST('/userManager/passageway/login', data)
}

// 获取用户信息
export function loginUserInfo() {
    return HTTP_.GET('/userManager/loginUserInfo', {})
}