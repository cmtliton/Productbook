import PurOrdsRepository from './../../../repositories/PO/PurOrdsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    PurOrds: [],
    POInfo: null,
    POCartProducts: []
  },
  getters: {
    getPurOrds (state) {
      return _.sortBy(state.PurOrds, Po => {
        return Po.PODate
      })
    },
    getPONs (state) {
      return state.PurOrds.filter(pon => pon.Status === false)
    },
    getPOInfo (state) {
      return state.POInfo
    },
    getPOCartProducts (state) {
      return state.POCartProducts
    },
    getPurOrdById (state) {
      return (PurOrdId) => {
        return state.PurOrds.find((PurOrd) => {
          return PurOrd.id === PurOrdId
        })
      }
    },
    getDuplicatePurOrd (state) {
      return (PurOrdName) => {
        return state.PurOrds.find((PurOrd) => {
          return PurOrd.PurOrdName === PurOrdName
        })
      }
    },
    POCartTotal (state) {
      return _.sumBy(state.POCartProducts, product => { return (product.PurchasePrice * product.quantity) })
    },
    POCartTotalqty (state) {
      return _.sumBy(state.POCartProducts, product => { return product.quantity })
    }
  },
  actions: {
    loadPurOrds ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const PurOrds = PurOrdsRepository.getPurOrds(cmpId)
      commit('setPurOrds', PurOrds)
    },
    initializePO ({ state, getters, commit, rootState, rootGetters }) {
      var date = new Date()
      var Year = date.getFullYear().toString().slice(2)
      var month = date.getMonth() + 1
      const POrealize = {}
      POrealize.PODate = date
      POrealize.PON = 'PON' + Year + month.toString()
      POrealize.Status = false
      POrealize.CreatorId = rootGetters['Users/getUser'].username
      const ReturnPOrealize = PurOrdsRepository.initializePO(rootGetters['Company/getCompany'].id, POrealize)
      commit('setPOInfo', ReturnPOrealize)
      commit('pushPurOrd', ReturnPOrealize)
    },
    addProductToPOCart ({ state, getters, commit, rootState, rootGetters }, payload) {
      const POCartProduct = getters.getPOCartProducts.find(product => product.ProductId === payload.ProductId)
      if (!POCartProduct) {
        commit('pushProductToPOCart', payload)
      } else {
        commit('incrementProductQuantity', POCartProduct)
      }
    },
    removeProductFromPOCart ({ state, getters, commit, rootState, rootGetters }, payload) {
      var POCartProduct = getters.getPOCartProducts.find(p => p.ProductId === payload.ProductId)
      commit('decrementProductQuantity', POCartProduct)
    },
    onSavingPurOrd ({ state, getters, commit, rootState, rootGetters }, payload) {
      const POInfo = {
        PON: payload.PON,
        PODate: payload.PODate,
        SupplierId: payload.SupplierId,
        POCartTotalqty: getters.POCartTotalqty,
        POCartTotal: payload.POCartTotal,
        Status: false,
        UpdatedDate: new Date(),
        UpdatorId: rootGetters['Users/getUser'].username,
        POitems: getters.getPOCartProducts
      }
      PurOrdsRepository.CreatePurOrd(rootGetters['Company/getCompany'].id, POInfo)
      commit('updatePurOrd', POInfo)
      commit('setPOInfo', null)
      commit('setPOCartProducts', [])
    },
    PurOrdRemove ({state, getters, commit, rootState, rootGetters}, payload) {
      confirm('Are you sure you want to delete this PurOrd?') &&
      PurOrdsRepository.PurOrdRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setPurOrdRemove', payload)
      commit('setPOInfo', null)
      commit('setPOCartProducts', [])
    },
    loadPOInfo ({state, getters, commit, rootState, rootGetters}, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const PON = payload
      const returnPOInfo = PurOrdsRepository.getPOInfo(cmpId, PON)
      const setPOInfo = {
        id: returnPOInfo.id,
        PODate: returnPOInfo.PODate,
        Disc: returnPOInfo.Disc,
        SupplierId: returnPOInfo.SupplierId
      }
      commit('setPOInfo', setPOInfo)
      if (returnPOInfo.POitems !== undefined) {
        commit('setPOCartProducts', returnPOInfo.POitems)
      }
    },
    onSubmittedEditedProductToPOCart ({commit}, payload) {
      commit('updatingProductToPOCart', payload)
    }
  },
  mutations: {
    setPurOrd (state, payload) {
      state.PurOrds.push(payload)
    },
    setPOInfo (state, payload) {
      state.POInfo = payload
    },
    setPOCartProducts (state, payload) {
      state.POCartProducts = payload
    },
    setPurOrds (state, payload) {
      state.PurOrds = payload
    },
    pushPurOrd (state, payload) {
      state.PurOrds.push({
        id: payload.PON,
        ...payload
      })
    },
    updatePurOrd (state, payload) {
      var PurOrd = state.PurOrds.find(purord => purord.id === payload.PON)
      if (PurOrd) {
        PurOrd.id = payload.PON
        PurOrd.PODate = payload.PODate
        PurOrd.SupplierId = payload.SupplierId
        PurOrd.POCartTotalqty = payload.POCartTotalqty
        PurOrd.POCartTotal = payload.POCartTotal
        PurOrd.POitems = payload.POitems
        PurOrd.Status = payload.Status
      }
    },
    PurOrdStatusChanges (state, payload) {
      const PurOrd = state.PurOrds.find(purord => purord.id === payload.PON)
      if (PurOrd) {
        PurOrd.Status = payload.Status
      }
    },
    pushProductToPOCart (state, payload) {
      state.POCartProducts.push({
        ProductId: payload.ProductId,
        title: payload.title,
        PurchasePrice: payload.PurchasePrice,
        quantity: 1,
        SlNos: []
      })
    },
    incrementProductQuantity (state, payload) {
      payload.quantity++
    },
    decrementProductQuantity (state, payload) {
      if (payload.quantity === 1) {
        var index = state.POCartProducts.indexOf(payload)
        state.POCartProducts.splice(index, 1)
      } else {
        payload.quantity--
      }
    },
    setPurOrdRemove (state, payload) {
      const index = state.PurOrds.indexOf(payload)
      state.PurOrds.splice(index, 1)
      state.PurOrd = null
    },
    updatingProductToPOCart (state, payload) {
      const POCartProduct = state.POCartProducts.find(p => {
        return p.ProductId === payload.ProductId
      })
      if (POCartProduct !== undefined) {
        if (payload.editedProductPrice) {
          POCartProduct.PurchasePrice = payload.editedProductPrice
        }
        if (payload.editedProductqty) {
          POCartProduct.quantity = payload.editedProductqty
        }
      }
    }
  }
}
