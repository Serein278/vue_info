import Vue from 'vue'
import Router from 'vue-router'

Vue.use(Router)

/* Layout */
import Layout from '@/layout'

/**
 * Note: sub-menu only appear when route children.length >= 1
 * Detail see: https://panjiachen.github.io/vue-element-admin-site/guide/essentials/router-and-nav.html
 *
 * hidden: true                   if set true, item will not show in the sidebar(default is false)
 * alwaysShow: true               if set true, will always show the root menu
 *                                if not set alwaysShow, when item has more than one children route,
 *                                it will becomes nested mode, otherwise not show the root menu
 * redirect: noRedirect           if set noRedirect will no redirect in the breadcrumb
 * name:'router-name'             the name is used by <keep-alive> (must set!!!)
 * meta : {
    roles: ['admin','editor']    control the page roles (you can set multiple roles)
    title: 'title'               the name show in sidebar and breadcrumb (recommend set)
    icon: 'svg-name'/'el-icon-x' the icon show in the sidebar
    breadcrumb: false            if set false, the item will hidden in breadcrumb(default is true)
    activeMenu: '/example/list'  if set path, the sidebar will highlight the path you set
  }
 */

/**
 * constantRoutes
 * a base page that does not have permission requirements
 * all roles can be accessed
 */
export const constantRoutes = [
  {
    path: '/login',
    component: () => import('@/views/login/index'),
    hidden: true
  },

  {
    path: '/404',
    component: () => import('@/views/404'),
    hidden: true
  },

  {
    path: '/',
    component: Layout,
    redirect: '/dashboard',
    children: [{
      path: 'dashboard',
      name: 'Dashboard',
      component: () => import('@/views/dashboard/index'),
      meta: { title: '个人信息', icon: 'dashboard' }
    }]
  }

]

export const asyncRoutes = [
  {
    path: '/info',
    component: Layout,
    redirect: '/info/table',
    name: 'Example',
    meta: { title: '信息收集', icon: 'el-icon-s-help', roles: ['user'] },
    children: [
      {
        path: 'table',
        name: 'Table',
        component: () => import('@/views/info/index'),
        meta: { title: '疫情填报', icon: 'table' }
      },
      {
        path: 'tree',
        name: 'Tree',
        component: () => import('@/views/tree/index'),
        meta: { title: '历史填报', icon: 'tree' }
      },
      {
        path: 'infoid',
        component: () => import('@/views/info/index'),
        hidden: true
      }
    ]
  },
  {
    path: '/documentation',
    component: Layout,
    children: [
      {
        path: 'index',
        component: () => import('@/views/documentation/index'),
        name: 'Documentation',
        meta: { title: '学校公告', icon: 'documentation', affix: true }
      },
      {
        path: 'info/:id(\\d+)',
        component: () => import('@/views/documentation/components/article'),
        name: 'article',
        meta: { title: '公告详情' },
        hidden: true
      }
    ]
  },
  {
    path: '/check',
    component: Layout,
    meta: { title: '学生填报信息管理', roles: ['admin'], icon: 'el-icon-s-unfold' },
    children: [
      {
        path: 'stuInfo',
        component: () => import('@/views/check/index'),
        name: '学生信息',
        meta: { title: '学生信息', roles: ['admin'] }
      },
      {
        path: 'info',
        component: () => import('@/views/check/checkInfo'),
        meta: { title: '学生未填报名单', roles: ['admin'] }
      },
      {
        path: 'filledForm',
        component: () => import('@/views/check/filled'),
        meta: { title: '已填名单和信息', roles: ['admin'] }
      }
    ]
  },
  {
    path: '/permission',
    component: Layout,
    name: '权限测试',
    meta: { title: '权限测试', roles: ['admin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/form/index'),
        name: '权限测试页',
        meta: { title: '权限测试页', roles: ['admin'] }
      }]
  },
  {
    path: '/bigdata',
    component: Layout,
    name: 'bigdata',
    redirect: '/bigdata/index',
    meta: { title: '大数据', roles: ['superAdmin'] },
    children: [
      {
        path: 'index',
        component: () => import('@/views/bigdata/china'),
        name: 'bigdataAnalysis',
        meta: { title: '大数据分析', icon: 'search' }
      }]
  },
  {
    path: '/example',
    component: Layout,
    redirect: '/example/list',
    name: 'Example',
    meta: {
      title: '文章管理',
      icon: 'el-icon-s-help',
      roles: ['superAdmin']
    },
    children: [
      {
        path: 'create',
        component: () => import('@/views/edit/create'),
        name: 'CreateArticle',
        meta: { title: '发布公告', icon: 'edit' }
      },
      {
        path: 'edit/:id(\\d+)',
        component: () => import('@/views/edit/edit'),
        name: 'EditArticle',
        meta: { title: 'Edit Article', noCache: true, activeMenu: '/example/list' },
        hidden: true
      }
    ]
  },
  // 404 page must be placed at the end !!!
  { path: '*', redirect: '/404', hidden: true }
]

const createRouter = () => new Router({
  // mode: 'history', // require service support
  scrollBehavior: () => ({ y: 0 }),
  routes: constantRoutes
})

const router = createRouter()

// Detail see: https://github.com/vuejs/vue-router/issues/1234#issuecomment-357941465
export function resetRouter() {
  const newRouter = createRouter()
  router.matcher = newRouter.matcher // reset router
}

export default router
