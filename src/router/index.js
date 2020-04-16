import Vue from 'vue'
import Router from 'vue-router'
import store from '@/store'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

export const constantRoutes = [{
        path: '/login',
        component: () =>
            import ('@/views/login/index'),
        hidden: true
    },

    {
        path: '/404',
        component: () =>
            import ('@/views/404'),
        hidden: true
    },
    {
        path: '/',
        component: Layout,
        redirect: '/login',
        meta: { title: '首页' },
        children: [
        {
            path: '/user',
            name: 'User',
            component: () =>
                import ('@/views/homepage'),
            meta: { title: '用户' }
        },
        {
            path: '/asyncRouter',
            name: 'asyncRouter',
            component: () =>
                import ('@/views/asyncRouter'),
            meta: { title: '异步路由' },
            redirect: '/asyncRouter/asyncRouter1',
            children: [{
                path: '/asyncRouter/asyncRouter1',
                name: 'asyncRouter1',
                component: () =>
                    import ('@/views/asyncRouter/asyncRouter1'),
                meta: { title: '异步路由1' },
            },{
                path: '/asyncRouter/asyncRouter2',
                name: 'asyncRouter2',
                component: () =>
                    import ('@/views/asyncRouter/asyncRouter2'),
                meta: { title: '异步路由2' },
            }]
        }]
    },
    
    { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
    // mode: 'history', // require service support
    scrollBehavior: () => ({ y: 0 }),
    routes: constantRoutes
})

const router = createRouter()

export function resetRouter() {
    const newRouter = createRouter()
    router.matcher = newRouter.matcher // reset router
}

const filterRoleRouter = (routes, fetchRoutes) => {
    for(let i=0; i<routes.length; i++){
        let route = routes[i]
        let ro = fetchRoutes.find(t=>t.path === route.path)
        if(ro){
            route.meta.title = ro.name
            if(ro.children && ro.children.length>0 && route.children && route.children.length>0){
                filterRoleRouter(route.children, ro.children)
            }else{
                route.children=[]
            }
        }else{
            routes.splice(i,1)
            i--
        }
    }
}

export const setAsyncRoute = () => {
    let temp = constantRoutes[2]
    let routes = temp.children.slice()
    resetRouter()

    filterRoleRouter(routes, store.state.app.menuList)
    
    temp.children = routes
    constantRoutes.splice(2,1,temp)
    router.addRoutes(routes)
    console.log('this.router',router)
}

export default router

