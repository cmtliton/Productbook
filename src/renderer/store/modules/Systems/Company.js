import CompanyRepository from './../../../repositories/Systems/CompanyRepository'
import * as firebase from 'firebase'
export default {
  namespaced: true,
  state: {
    Company: null
  },
  getters: {
    getCompany (state) {
      return state.Company
    }
  },
  mutations: {
    setCompany (state, payload) {
      state.Company = payload
    }
  },
  actions: {
    loadCompany ({ commit }) {
      const Company = CompanyRepository.getCompany()
      if (Company) {
        const loadInCompany = {
          id: Company.id,
          ComName: Company.ComName,
          Addr: Company.Addr,
          Email: Company.Email,
          Mobile: Company.Mobile,
          Tel: Company.Tel
        }
        commit('setCompany', loadInCompany)
      }
    },
    onSavingCompany ({ commit }, payload) {
      const newCompany = CompanyRepository.saveNewCompany(payload)
      if (newCompany) {
        const setCompany = {
          id: newCompany.id,
          ComName: newCompany.ComName,
          Addr: newCompany.Addr,
          Email: newCompany.Email,
          Mobile: newCompany.Mobile,
          Tel: newCompany.Tel,
          Date: newCompany.CreatedDate
        }
        firebase.database().ref('Company').push(setCompany)
        commit('setCompany', setCompany)
      }
    },
    onUpdatingCompany ({ commit }, payload) {
      const newCompany = CompanyRepository.changeCompanyValue(payload.id, payload)
      if (newCompany) {
        const updateCompany = {
          id: newCompany.id,
          ComName: newCompany.ComName,
          Addr: newCompany.Addr,
          Email: newCompany.Email,
          Mobile: newCompany.Mobile,
          Tel: newCompany.Tel,
          Date: newCompany.CreatedDate,
          UpdatedDate: newCompany.UpdatedDate.toISOString()
        }
        firebase.database().ref('Company').push(updateCompany)
        commit('setCompany', updateCompany)
      }
    }
  }
}
