import axios from 'axios'
import { Message } from 'element-ui'
import store from '@/store'
import { getToken } from '@/utils/auth'
import VueRouter from '@/router';
import { api_ } from '@/common/globalConfig'

const [SUCCESS_CODE, ERROR_CODE, TOKEN_OVER_CODE] = [0, 1, 401]

// create an axios instance
export const service = axios.create({
    baseURL: api_, // url = base url + request url
    timeout: 5000, // request timeout
    headers: {
        'content-type': 'application/json; charset=utf-8'
    }
})

// request interceptor
service.interceptors.request.use(
    config => {
        if (store.getters.token) {
            console.log(getToken())
            config.headers['Authorization'] = getToken() || ''
        }
        return config
    },
    error => {
        console.log(error) // for debug
        return Promise.reject(error)
    }
)

// response interceptor
service.interceptors.response.use(
    response => {
        return response.data
    },
    error => {
        let { response: { data } } = error
        //身份过期
        if (data.code === TOKEN_OVER_CODE) {
            Message({
                message: data.message,
                type: 'error',
                duration: 2 * 1000
            })
            VueRouter.push('/login')
            removeToken();
        } else {
            Message({
                message: data.message || '网络错误，请稍后重试',
                type: 'error',
                duration: 2 * 1000
            })
        }
        return Promise.reject(error)
    }
)

class HTTP_ {
    async GET() {
        return this.handler('get', arguments)
    }
    async POST() {
        return this.handler('post', arguments)
    }
    async handler(method, message) {
        try {
            let mes;
            message = [...message]
            if (method === 'get') {
                mes = await service.get(message[0], { params: {...message[1] } })
            } else {
                mes = await service.post(message[0], {...message[1] })
            }
            //状态码为 200
            if (mes.code === SUCCESS_CODE) {
                return mes.data;
            } else {
                Message.error(mes.message)
                console.error('错误信息：', mes)
                return null;
            }
        } catch (error) {
            return null
        }
    }

}
export default new HTTP_