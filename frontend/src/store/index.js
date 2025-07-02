import { createStore } from 'vuex'
import { userApi } from '../services/api'

export default createStore({
  state: {
    token: localStorage.getItem('token') || '',
    user: JSON.parse(localStorage.getItem('user') || '{}'),
    status: '',
    error: null
  },
  mutations: {
    auth_request(state) {
      state.status = 'loading'
      state.error = null
    },
    auth_success(state, { token, user }) {
      state.status = 'success'
      state.token = token
      state.user = user
      state.error = null
    },
    auth_error(state, error) {
      state.status = 'error'
      state.error = error
    },
    logout(state) {
      state.status = ''
      state.token = ''
      state.user = {}
      state.error = null
    },
    set_user(state, user) {
      state.user = user
      localStorage.setItem('user', JSON.stringify(user))
    },
    clear_error(state) {
      state.error = null
    }
  },
  actions: {
    // 微信登录
    login({ commit }, code) {
      return new Promise((resolve, reject) => {
        commit('auth_request')
        userApi.wechatLogin(code)
          .then(response => {
            const { token, user } = response.data
            localStorage.setItem('token', token)
            localStorage.setItem('user', JSON.stringify(user))
            commit('auth_success', { token, user })
            resolve(response)
          })
          .catch(error => {
            commit('auth_error', error.response?.data?.message || '登录失败')
            localStorage.removeItem('token')
            localStorage.removeItem('user')
            reject(error)
          })
      })
    },
    
    // 登出
    logout({ commit }) {
      return new Promise((resolve) => {
        commit('logout')
        localStorage.removeItem('token')
        localStorage.removeItem('user')
        resolve()
      })
    },
    
    // 获取用户资料
    fetchUserProfile({ commit }) {
      return new Promise((resolve, reject) => {
        userApi.getProfile()
          .then(response => {
            const user = response.data
            commit('set_user', user)
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    
    // 更新用户资料
    updateUserProfile({ commit }, profileData) {
      return new Promise((resolve, reject) => {
        userApi.updateProfile(profileData)
          .then(response => {
            const user = response.data
            commit('set_user', user)
            resolve(user)
          })
          .catch(error => {
            reject(error)
          })
      })
    },
    
    // 清除错误信息
    clearError({ commit }) {
      commit('clear_error')
    }
  },
  getters: {
    isAuthenticated: state => !!state.token,
    authStatus: state => state.status,
    user: state => state.user,
    error: state => state.error
  }
})