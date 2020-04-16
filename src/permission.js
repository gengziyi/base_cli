import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken, removeToken } from '@/utils/auth' // get token from cookie
import { setAsyncRoute } from "@/router/index"

NProgress.configure({ showSpinner: false }) // NProgress Configuration

router.beforeEach(async (to, from, next) => {
    const hasToken = getToken()
    NProgress.start()
    // 判断是不是登录页
    if (to.path !== '/login') {
        if (to.path == '/404') {
            next()
        } else {
            if (hasToken) {
                setAsyncRoute()
                next()
            } else {
                removeToken()
                next({ path: '/login' })
            }
        }
        NProgress.done()
    } else {
        removeToken()
        next()
        NProgress.done()
    }
    document.title = 'Base'
})

router.afterEach(() => {
    // finish progress bar
    NProgress.done()
})