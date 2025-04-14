import BuyersRepository from './../../../repositories/Buyers/BuyersRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Buyers: []
  },
  getters: {
    getBuyers (state) {
      return state.Buyers
    },
    getBuyerById (state) {
      return (BuyerId) => {
        return state.Buyers.find((Buyer) => {
          return Buyer.id === BuyerId
        })
      }
    },
    getDuplicateMobile (state) {
      return (PhoneNumber) => {
        return state.Buyers.find((Buyer) => {
          return Buyer.PhoneNumber === PhoneNumber
        })
      }
    },
    Buyersqty (state) {
      return _.size(state.Buyers)
    }
  },
  actions: {
    loadBuyers ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Buyers = BuyersRepository.getBuyers(cmpId)
      commit('setBuyers', Buyers)
    },
    onSavingBuyer ({ state, getters, commit, rootState, rootGetters }, payload) {
      const CreateBuyer = {
        BuyerName: payload.BuyerName,
        PhoneNumber: payload.PhoneNumber,
        Address: payload.Address,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Buyer = BuyersRepository.CreateBuyer(rootGetters['Company/getCompany'].id, CreateBuyer)
      commit('setBuyer', Buyer)
    },
    onSavingChangeBuyer ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateBuyer = {}
      if (payload.BuyerName) {
        UpdateBuyer.BuyerName = payload.BuyerName
      }
      if (payload.PhoneNumber) {
        UpdateBuyer.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        UpdateBuyer.Address = payload.Address
      }
      UpdateBuyer.UpdatorId = rootGetters['Users/getUser'].id
      UpdateBuyer.Status = true
      BuyersRepository.changeBuyer(cmpId, payload.id, UpdateBuyer)
      commit('setChangeBuyer', payload)
    },
    BuyerStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Buyerinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        BuyerId: payload.id,
        Status: payload.Status
      }
      commit('BuyerStatusChanges', Buyerinfo)
    },
    BuyerRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this buyer?') && BuyersRepository.BuyerRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setBuyerRemove', payload)
    }
  },
  mutations: {
    setBuyer (state, payload) {
      state.Buyers.push(payload)
    },
    setChangeBuyer (state, payload) {
      const changeBuyer = state.Buyers.find(buyer => {
        return buyer.id === payload.id
      })
      if (payload.BuyerName) {
        changeBuyer.BuyerName = payload.BuyerName
      }
      if (payload.PhoneNumber) {
        changeBuyer.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        changeBuyer.Address = payload.Address
      }
    },
    setBuyers (state, payload) {
      state.Buyers = payload
    },
    BuyerStatusChanges (state, payload) {
      const Buyer = state.Buyers.find(Buyer => {
        return Buyer.id === payload.BuyerId
      })
      Buyer.Status = !payload.Status
      BuyersRepository.changeBuyerStatus(payload.cmpId, payload.BuyerId, Buyer)
    },
    setBuyerRemove (state, payload) {
      const index = state.Buyers.indexOf(payload)
      state.Buyers.splice(index, 1)
    }
  }
}
