import { logout, getInfo } from '@/api/user'
import { getToken, setToken, removeToken } from '@/utils/auth'
import { resetRouter } from '@/router'
import axios from 'axios'

const getDefaultState = () => {
  return {
    token: getToken(),
    name: '',
    avatar: '',
    student: {
      stuId: '',
      name: ''
    },
    counselor: {
      cId: '',
      name: ''
    },
    superAdmin: null,
    roles: [],
    roleId: ''
  }
}

const state = getDefaultState()

const mutations = {
  RESET_STATE: (state) => {
    Object.assign(state, getDefaultState())
  },
  SET_TOKEN: (state, token) => {
    state.token = token
  },
  SET_NAME: (state, name) => {
    state.name = name
  },
  SET_AVATAR: (state, avatar) => {
    state.avatar = avatar
  },
  SET_STUDENT: (state, user) => {
    state.student.name = user.username
    state.student.stuId = user.stuId
  },
  SET_COUNSERLOR: (state, user) => {
    state.counselor.name = user.username
    state.counselor.cId = user.cId
  },
  SET_SUPER_ADMIN: (state, superAdmin) => {
    state.superAdmin = superAdmin
  },
  SET_ROLES: (state, roles) => {
    state.roles = roles
  },
  SET_ROLEID: (state, roles) => {
    state.roleId = roles
  }
}

const actions = {
  //  commit 为context的结构对象，
  // user login
  login({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(username + password)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/login',
        data: {
          stuId: username,
          password: password
        }
      }).then(res => {
        const token = res.headers['authorization']
        commit('SET_TOKEN', token) // 将属性提交到SET_TOKEN方法中
        setToken(token)
        commit('SET_NAME', res.data.data.username)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_STUDENT', res.data.data)
        commit('SET_ROLEID', '0')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  adminLogin({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(username + password)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/adminLogin',
        data: {
          stuId: '1',
          password: '123456'
        }
      }).then(res => {
        const token = res.headers['authorization']
        commit('SET_TOKEN', token) // 将属性提交到SET_TOKEN方法中
        setToken(token)
        commit('SET_NAME', res.data.data.username)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_COUNSERLOR', res.data.data)
        commit('SET_ROLEID', '1')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  superadminLogin({ commit }, userInfo) {
    const { username, password } = userInfo
    console.log(username + password)
    return new Promise((resolve, reject) => {
      axios({
        method: 'post',
        url: '/superAdminLogin',
        data: {
          stuId: '1',
          password: 'a12345!'
        }
      }).then(res => {
        const token = res.headers['authorization']
        commit('SET_TOKEN', token) // 将属性提交到SET_TOKEN方法中
        setToken(token)
        commit('SET_NAME', res.data.data.username)
        commit('SET_AVATAR', 'https://wpimg.wallstcn.com/f778738c-e4f8-4870-b634-56703b4acafe.gif')
        commit('SET_SUPER_ADMIN', res.data.data)
        commit('SET_ROLEID', '2')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },
  // get user info
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token).then(response => {
        const { data } = response

        if (!data) {
          return reject('Verification failed, please Login again.')
        }

        const { name, avatar } = data

        commit('SET_NAME', name)
        commit('SET_AVATAR', avatar)
        resolve(data)
      }).catch(error => {
        reject(error)
      })
    })
  },

  // user logout
  logout({ commit, state }) {
    return new Promise((resolve, reject) => {
      logout(state.token).then(() => {
        removeToken() // must remove  token  first
        resetRouter()
        commit('RESET_STATE')
        resolve()
      }).catch(error => {
        reject(error)
      })
    })
  },

  // remove token
  resetToken({ commit }) {
    return new Promise(resolve => {
      removeToken() // must remove  token  first
      commit('RESET_STATE')
      resolve()
    })
  }
}

export default {
  namespaced: true,
  state,
  mutations,
  actions
}

