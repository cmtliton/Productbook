import SuppliersRepository from './../../../repositories/Suppliers/SuppliersRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Suppliers: []
  },
  getters: {
    getSuppliers (state) {
      return state.Suppliers
    },
    getSupplierById (state) {
      return (SupplierId) => {
        return state.Suppliers.find((Supplier) => {
          return Supplier.id === SupplierId
        })
      }
    },
    getDuplicateSupplierMobile (state) {
      return (PhoneNumber) => {
        return state.Suppliers.find((Supplier) => {
          return Supplier.PhoneNumber === PhoneNumber
        })
      }
    },
    Suppliersqty (state) {
      return _.size(state.Suppliers)
    }
  },
  actions: {
    loadSuppliers ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Suppliers = SuppliersRepository.getSuppliers(cmpId)
      commit('setSuppliers', Suppliers)
    },
    onSavingSupplier ({state, getters, commit, rootState, rootGetters}, payload) {
      const CreateSupplier = {
        SupplierName: payload.SupplierName,
        PhoneNumber: payload.PhoneNumber,
        Address: payload.Address,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Supplier = SuppliersRepository.CreateSupplier(rootGetters['Company/getCompany'].id, CreateSupplier)
      commit('setSupplier', Supplier)
    },
    onSavingChangeSupplier ({state, getters, commit, rootState, rootGetters}, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateSupplier = {}
      if (payload.SupplierName) {
        UpdateSupplier.SupplierName = payload.SupplierName
      }
      if (payload.PhoneNumber) {
        UpdateSupplier.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        UpdateSupplier.Address = payload.Address
      }
      UpdateSupplier.Status = true
      UpdateSupplier.UpdatorId = rootGetters['Users/getUser'].id
      SuppliersRepository.changeSupplier(cmpId, payload.id, UpdateSupplier)
      commit('setChangeSupplier', payload)
    },
    SupplierStatusChanges ({state, getters, commit, rootState, rootGetters}, payload) {
      const Supplierinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        SupplierId: payload.id,
        Status: payload.Status
      }
      confirm('Are you sure you want to change this Supplier status?') && commit('SupplierStatusChanges', Supplierinfo)
    },
    SupplierRemove ({state, getters, commit, rootState, rootGetters}, payload) {
      confirm('Are you sure you want to delete this Supplier?') && SuppliersRepository.SupplierRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setSupplierRemove', payload)
    }
  },
  mutations: {
    setSupplier (state, payload) {
      state.Suppliers.push(payload)
    },
    setChangeSupplier (state, payload) {
      const changeSupplier = state.Suppliers.find(Supplier => {
        return Supplier.id === payload.id
      })
      if (payload.SupplierName) {
        changeSupplier.SupplierName = payload.SupplierName
      }
      if (payload.PhoneNumber) {
        changeSupplier.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        changeSupplier.Address = payload.Address
      }
    },
    setSuppliers (state, payload) {
      state.Suppliers = payload
    },
    SupplierStatusChanges (state, payload) {
      const Supplier = state.Suppliers.find(Supplier => {
        return Supplier.id === payload.SupplierId
      })
      Supplier.Status = !payload.Status
      SuppliersRepository.changeSupplierStatus(payload.cmpId, payload.SupplierId, Supplier)
    },
    setSupplierRemove (state, payload) {
      const index = state.Suppliers.indexOf(payload)
      state.Suppliers.splice(index, 1)
    }
  }
}
