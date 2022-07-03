import router from './router'
import store from './store'
import { Message } from 'element-ui'
import NProgress from 'nprogress' // progress bar
import 'nprogress/nprogress.css' // progress bar style
import { getToken } from '@/utils/auth' // get token from cookie
import getPageTitle from '@/utils/get-page-title'

NProgress.configure({ showSpinner: false }) // NProgress Configuration

const whiteList = ['/login'] // no redirect whitelist

router.beforeEach(async(to, from, next) => {
  // start progress bar
  NProgress.start()

  // set page title
  document.title = getPageTitle(to.meta.title)

  // determine whether the user has logged in
  const hasToken = getToken()
  if (hasToken) {
    if (to.path === '/login') {
      // if is logged in, redirect to the home page
      next({ path: '/' })
      NProgress.done()
    } else {
      const hasRoles = store.getters.roles && store.getters.roles.length > 0
      if (hasRoles) {
        next()
      } else {
        try {
          // get user info
          // await store.dispatch('user/getInfo')
          const roleId = store.getters.roleId
          // 判断用户的角色，并根据角色生成路由栏
          if (roleId === '0') {
            console.log(store)
            store.commit('user/SET_ROLES', ['user'])
            const accessRoutes = await store.dispatch('permission/generateRoutes', ['user'])
            router.options.routes = store.getters.permission_routes
            router.addRoutes(accessRoutes)
            next({ ...to, replace: true })
          } else if (roleId === '1') {
            console.log(store)
            store.commit('user/SET_ROLES', ['admin'])
            const accessRoutes = await store.dispatch('permission/generateRoutes', ['admin'])
            console.log(accessRoutes)
            console.log(router)
            // router.options.routes = store.getters.addRoutes
            router.options.routes = store.getters.permission_routes
            router.addRoutes(accessRoutes)
            // console.log(router)
            next({ ...to, replace: true })
          } else if (roleId === '2') {
            console.log(store)
            store.commit('user/SET_ROLES', ['superAdmin'])
            const accessRoutes = await store.dispatch('permission/generateRoutes', ['superAdmin'])
            console.log(accessRoutes)
            console.log(router)
            // router.options.routes = store.getters.addRoutes
            router.options.routes = store.getters.permission_routes
            router.addRoutes(accessRoutes)
            // console.log(router)
            next({ ...to, replace: true })
          }
          next()
        } catch (error) {
          // remove token and go to login page to re-login
          await store.dispatch('user/resetToken')
          Message.error(error || 'Has Error')
          next(`/login?redirect=${to.path}`)
          NProgress.done()
        }
      }
    }
  } else {
    /* has no token*/

    if (whiteList.indexOf(to.path) !== -1) {
      // in the free login whitelist, go directly
      next()
    } else {
      // other pages that do not have permission to access are redirected to the login page.
      next(`/login?redirect=${to.path}`)
      NProgress.done()
    }
  }
})

router.afterEach(() => {
  // finish progress bar
  NProgress.done()
})
