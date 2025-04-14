import BrandsRepository from './../../../repositories/Items/BrandsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Brands: []
  },
  getters: {
    getBrands (state) {
      return state.Brands
    },
    getBrandById (state) {
      return (BrandId) => {
        return state.Brands.find((Brand) => {
          return Brand.id === BrandId
        })
      }
    },
    getDuplicateBrand (state) {
      return (BrandName) => {
        return state.Brands.find((Brand) => {
          return Brand.BrandName === BrandName
        })
      }
    },
    Brandsqty (state) {
      return _.size(state.Brands)
    }
  },
  actions: {
    loadBrands ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Brands = BrandsRepository.getBrands(cmpId)
      commit('setBrands', Brands)
    },
    onSavingBrand ({ state, getters, commit, rootState, rootGetters }, payload) {
      const CreateBrand = {
        BrandName: payload.BrandName,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Brand = BrandsRepository.CreateBrand(rootGetters['Company/getCompany'].id, CreateBrand)
      commit('setBrand', Brand)
    },
    onSavingChangeBrand ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateBrand = {}
      if (payload.BrandName) {
        UpdateBrand.BrandName = payload.BrandName
      }
      UpdateBrand.Status = true
      UpdateBrand.UpdatorId = rootGetters['Users/getUser'].id
      BrandsRepository.changeBrand(cmpId, payload.id, UpdateBrand)
      commit('setChangeBrand', payload)
    },
    BrandStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Brandinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        BrandId: payload.id,
        Status: payload.Status
      }
      confirm('Are you sure you want to change this Brand status?') && commit('BrandStatusChanges', Brandinfo)
    },
    BrandRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this Brand?') && BrandsRepository.BrandRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setBrandRemove', payload)
    }
  },
  mutations: {
    setBrand (state, payload) {
      state.Brands.push(payload)
    },
    setChangeBrand (state, payload) {
      const changeBrand = state.Brands.find(Brand => {
        return Brand.id === payload.id
      })
      if (payload.BrandName) {
        changeBrand.BrandName = payload.BrandName
      }
    },
    setBrands (state, payload) {
      state.Brands = payload
    },
    BrandStatusChanges (state, payload) {
      const Brand = state.Brands.find(Brand => {
        return Brand.id === payload.BrandId
      })
      Brand.Status = !payload.Status
      BrandsRepository.changeBrandStatus(payload.cmpId, payload.BrandId, Brand)
    },
    setBrandRemove (state, payload) {
      const index = state.Brands.indexOf(payload)
      state.Brands.splice(index, 1)
    }
  }
}
