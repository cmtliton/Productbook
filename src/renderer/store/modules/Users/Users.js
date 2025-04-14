import UsersRepository from './../../../repositories/Users/UsersRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    User: null,
    Users: [],
    error: null
  },
  getters: {
    getUsers (state, getters, rootState, rootGetters) {
      return state.Users
    },
    getUser (state, getters, rootState, rootGetters) {
      return state.User
    },
    getUserById (state, getters, rootState, rootGetters) {
      return (UserId) => {
        return state.Users.find((User) => {
          return User.id === UserId
        })
      }
    },
    getDuplicateUser (state, getters, rootState, rootGetters) {
      return (username) => {
        return state.Users.find((User) => {
          return User.username === username
        })
      }
    },
    getDuplicateEmail (state, getters, rootState, rootGetters) {
      return (email) => {
        return state.Users.find((User) => {
          return User.email === email
        })
      }
    },
    getError (state, getters, rootState, rootGetters) {
      return state.error
    },
    Usersqty (state) {
      return _.size(state.Users)
    }
  },
  actions: {
    loadUsers ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Users = UsersRepository.getUsers(cmpId)
      commit('setUsers', Users)
    },
    SigningInUser ({ state, getters, commit, rootState, rootGetters }, payload) {
      const user = UsersRepository.checkUser(rootGetters['Company/getCompany'].id, payload)
      if (user !== undefined) {
        commit('setUser', user)
        commit('setError', null)
      } else {
        commit('setError', 'Username or Password incorrect!')
        commit('setUser', null)
      }
    },
    onSigningUp ({ state, getters, commit, rootState, rootGetters }, payload) {
      const User = {
        fullname: payload.fullname,
        email: payload.email,
        username: payload.username,
        password: payload.password,
        role: payload.role,
        status: true,
        CreatedDate: new Date()
      }
      const CompanyId = rootGetters['Company/getCompany'].id
      const backUser = UsersRepository.CreateUser(CompanyId, User)
      commit('setUser', backUser)
    },
    onSigningUpChange ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateUser = {}
      if (payload.fullname) {
        UpdateUser.fullname = payload.fullname
      }
      if (payload.email) {
        UpdateUser.email = payload.email
      }
      if (payload.password) {
        UpdateUser.password = payload.password
      }
      if (payload.role) {
        UpdateUser.role = payload.role
      }
      UpdateUser.status = true
      UpdateUser.UpdatorId = rootGetters['Users/getUser'].id
      UsersRepository.changeUser(cmpId, payload.id, UpdateUser)
      commit('setUser', UpdateUser)
    },
    UserStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Userinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        UserId: payload.id,
        status: payload.status
      }
      confirm('Are you sure you want to change this User status?') && commit('UserStatusChanges', Userinfo)
    },
    UserRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this User?') && UsersRepository.UserRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setUserRemove', payload)
    },
    clearError ({commit}) {
      commit('setError', null)
    },
    LogginOut ({commit}) {
      commit('setUser', null)
      commit('Sales/setInvCartProducts', [], {root: true})
    }
  },
  mutations: {
    setUsers (state, payload) {
      state.Users = payload
    },
    setUser (state, payload) {
      state.User = payload
    },
    UserStatusChanges (state, payload) {
      const User = state.Users.find(User => {
        return User.id === payload.UserId
      })
      User.status = !payload.status
      UsersRepository.changeUserStatus(payload.cmpId, payload.UserId, User)
    },
    setError (state, payload) {
      state.error = payload
    },
    setUserRemove (state, payload) {
      const index = state.Users.indexOf(payload)
      state.Users.splice(index, 1)
    }
  }
}
