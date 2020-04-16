import Vue from 'vue'

import 'normalize.css/normalize.css' // A modern alternative to CSS resets

import ElementUI from 'element-ui'
import 'element-ui/lib/theme-chalk/index.css'
import zhLocale from 'element-ui/lib/locale/lang/zh-CN'

import '@/styles/index.scss' // global css

import './styles/rest.scss'
import './styles/reset.css'
import App from './App'
import store from './store'
import router from './router'

import '@/icons' // icon
import '@/permission' // permission control

import buttons from '@components/buttons';
import inputDemoNew from '@/components/inputDemoNew'
import Pagination from '@/components/pagination'
import MfTable from '@/components/table'

// require styles
import 'quill/dist/quill.core.css'
import 'quill/dist/quill.snow.css'
import 'quill/dist/quill.bubble.css'

// set ElementUI lang to EN
Vue.use(ElementUI, { zhLocale })
Vue.config.productionTip = false

Vue.prototype.tableHeight = document.body.clientHeight
window.addEventListener('resize', function() {
    Vue.prototype.tableHeight = document.body.clientHeight
})
import { resize_ } from '@/common'
Vue.prototype.$resize_ = resize_

const common_ = {
    install(Vue) {
        Vue.component('buttons', buttons)
        Vue.component('inputDemoNew', inputDemoNew),
            Vue.component('MfTable', MfTable),
            Vue.component('Pagination', Pagination)
    }
}
Vue.use(common_)

new Vue({
    el: '#app',
    router,
    store,
    render: h => h(App)
})