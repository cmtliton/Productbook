import ItemsRepository from './../../../repositories/Items/ItemsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Items: []
  },
  getters: {
    getItems (state) {
      return state.Items
    },
    getItemById (state) {
      return (ItemId) => {
        return state.Items.find((Item) => {
          return Item.id === ItemId
        })
      }
    },
    getDuplicateItem (state) {
      return (ItemName) => {
        return state.Items.find((Item) => {
          return Item.ItemName === ItemName
        })
      }
    },
    Itemsqty (state) {
      return _.size(state.Items)
    }
  },
  actions: {
    loadItems ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Items = ItemsRepository.getItems(cmpId)
      commit('setItems', Items)
    },
    onSavingItem ({ state, getters, commit, rootState, rootGetters }, payload) {
      const CreateItem = {
        ItemName: payload.ItemName,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Item = ItemsRepository.CreateItem(rootGetters['Company/getCompany'].id, CreateItem)
      commit('setItem', Item)
    },
    onSavingChangeItem ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateItem = {}
      if (payload.ItemName) {
        UpdateItem.ItemName = payload.ItemName
      }
      UpdateItem.Status = true
      UpdateItem.UpdatorId = rootGetters['Users/getUser'].id
      ItemsRepository.changeItem(cmpId, payload.id, UpdateItem)
      commit('setChangeItem', payload)
    },
    ItemStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Iteminfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        ItemId: payload.id,
        Status: payload.Status
      }
      confirm('Are you sure you want to change this Item status?') && commit('ItemStatusChanges', Iteminfo)
    },
    ItemRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this Item?') && ItemsRepository.ItemRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setItemRemove', payload)
    }
  },
  mutations: {
    setItem (state, payload) {
      state.Items.push(payload)
    },
    setChangeItem (state, payload) {
      const changeItem = state.Items.find(Item => {
        return Item.id === payload.id
      })
      if (payload.ItemName) {
        changeItem.ItemName = payload.ItemName
      }
    },
    setItems (state, payload) {
      state.Items = payload
    },
    ItemStatusChanges (state, payload) {
      const Item = state.Items.find(Item => {
        return Item.id === payload.ItemId
      })
      Item.Status = !payload.Status
      ItemsRepository.changeItemStatus(payload.cmpId, payload.ItemId, Item)
    },
    setItemRemove (state, payload) {
      const index = state.Items.indexOf(payload)
      state.Items.splice(index, 1)
    }
  }
}
