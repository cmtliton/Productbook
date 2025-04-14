import WarehousesRepository from './../../../repositories/Warehouses/WarehousesRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Warehouses: [],
    StockInWarehouses: [],
    SelectedWarehousesItem: []
  },
  getters: {
    getWarehouses (state) {
      return state.Warehouses
    },
    getWarehouseById (state) {
      return (WarehouseId) => {
        return state.Warehouses.find((Warehouse) => {
          return Warehouse.id === WarehouseId
        })
      }
    },
    getDuplicateWMobile (state) {
      return (PhoneNumber) => {
        return state.Warehouses.find((Warehouse) => {
          return Warehouse.PhoneNumber === PhoneNumber
        })
      }
    },
    Warehousesqty (state) {
      return _.size(state.Warehouses)
    },
    getWarehousesStock (state) {
      return state.StockInWarehouses
    },
    getWarehousesItem (state, getters, rootState, rootGetters) {
      const result = _.reduce(state.SelectedWarehousesItem, (r, {TRN, WarehouseId, PRN, ...c}) => {
        let _c = _.find(r, {'ProductId': c.ProductId})
        if (_c) {
          _c = _.mergeWith(_c, c, (ov, sv, k) => _.includes(['quantity', 'SlNos'], k) ? _.isArray(sv) ? (ov || []).concat(sv) : _.isNumber(sv) ? sv + (ov || 0) : sv : ov)
        } else {
          r.push(c)
        }
        return r
      }, [])
      const WarehouseItem = result.map(warehouseprd => {
        var product = rootGetters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === warehouseprd.ProductId)
        return {
          ProductId: warehouseprd.ProductId,
          title: product.title,
          PurchasePrice: product.PurchasePrice,
          quantity: warehouseprd.quantity,
          SlNos: warehouseprd.SlNos
        }
      })
      return WarehouseItem
    }
  },
  actions: {
    loadWarehouses ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Warehouses = WarehousesRepository.getWarehouses(cmpId)
      commit('setWarehouses', Warehouses)
    },
    loadWarehousesStocks ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Stocks = WarehousesRepository.StockLoadFrmWarehouses(cmpId)
      const StockInfo = []
      for (let key in Stocks) {
        StockInfo.push({
          TRN: Stocks[key].TRN,
          WarehouseId: Stocks[key].WarehouseId,
          PRN: Stocks[key].PRN,
          ProductId: Stocks[key].ProductId,
          quantity: Stocks[key].quantity,
          SlNos: Stocks[key].SlNos
        })
      }
      commit('setStockInWarehouses', StockInfo)
    },
    onSavingWarehouse ({ state, getters, commit, rootState, rootGetters }, payload) {
      const CreateWarehouse = {
        WarehouseName: payload.WarehouseName,
        KeyPerson: payload.KeyPerson,
        PhoneNumber: payload.PhoneNumber,
        Address: payload.Address,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Warehouse = WarehousesRepository.CreateWarehouse(rootGetters['Company/getCompany'].id, CreateWarehouse)
      commit('setWarehouse', Warehouse)
    },
    onSavingChangeWarehouse ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateWarehouse = {}
      if (payload.WarehouseName) {
        UpdateWarehouse.WarehouseName = payload.WarehouseName
      }
      if (payload.KeyPerson) {
        UpdateWarehouse.KeyPerson = payload.KeyPerson
      }
      if (payload.PhoneNumber) {
        UpdateWarehouse.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        UpdateWarehouse.Address = payload.Address
      }
      UpdateWarehouse.UpdatorId = rootGetters['Users/getUser'].id
      UpdateWarehouse.Status = true
      WarehousesRepository.changeWarehouse(cmpId, payload.id, UpdateWarehouse)
      commit('setChangeWarehouse', payload)
    },
    WarehouseStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Warehouseinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        WarehouseId: payload.id,
        Status: payload.Status
      }
      commit('WarehouseStatusChanges', Warehouseinfo)
    },
    WarehouseRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this Warehouse?') && WarehousesRepository.WarehouseRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setWarehouseRemove', payload)
    },
    gettingItemFromWarehouses ({ state, getters, commit, rootState, rootGetters }, payload) {
      const WarehousesStocks = _.filter(state.StockInWarehouses, warhouse => warhouse.WarehouseId === payload)
      commit('setWarehousesItem', WarehousesStocks)
    },
    RemoveStockInWarehouses ({ state, getters, commit, rootState, rootGetters }, payload) {
      console.log(payload)
    },
    UpdateStockInWarehouses ({ state, getters, commit, rootState, rootGetters }, payload) {
      console.log(payload)
    }
  },
  mutations: {
    setWarehouse (state, payload) {
      state.Warehouses.push(payload)
    },
    setStockInWarehouses (state, payload) {
      state.StockInWarehouses = payload
    },
    setChangeWarehouse (state, payload) {
      const changeWarehouse = state.Warehouses.find(Warehouse => {
        return Warehouse.id === payload.id
      })
      if (payload.WarehouseName) {
        changeWarehouse.WarehouseName = payload.WarehouseName
      }
      if (payload.KeyPerson) {
        changeWarehouse.KeyPerson = payload.KeyPerson
      }
      if (payload.PhoneNumber) {
        changeWarehouse.PhoneNumber = payload.PhoneNumber
      }
      if (payload.Address) {
        changeWarehouse.Address = payload.Address
      }
    },
    setWarehouses (state, payload) {
      state.Warehouses = payload
    },
    WarehouseStatusChanges (state, payload) {
      const Warehouse = state.Warehouses.find(Warehouse => {
        return Warehouse.id === payload.WarehouseId
      })
      Warehouse.Status = !payload.Status
      WarehousesRepository.changeWarehouseStatus(payload.cmpId, payload.WarehouseId, Warehouse)
    },
    setWarehouseRemove (state, payload) {
      const index = state.Warehouses.indexOf(payload)
      state.Warehouses.splice(index, 1)
    },
    StoreInWarehousesStock (state, payload) {
      const WStock = state.StockInWarehouses.find(s => s.WarehouseId === payload.WarehouseId && s.TRN === payload.TRN && s.PRN === payload.PRN && s.ProductId === payload.ProductId)
      if (WStock !== undefined) {
        // Update in Warehouses Stock
        WStock.WarehouseId = payload.WarehouseId
        WStock.TRN = payload.TRN
        WStock.PRN = payload.PRN
        WStock.ProductId = payload.ProductId
        WStock.quantity = WStock.quantity + payload.quantity
        WStock.SlNos = _.concat(WStock.SlNos, payload.SlNos)
      } else {
        // set in Warehouses Stock
        state.StockInWarehouses.push(payload)
      }
    },
    UpdateInWarehousesStock (state, payload) {},
    RemoveFromWarehousesStock (state, payload) {
      const index = state.StockInWarehouses.indexOf(payload)
      state.StockInWarehouses.splice(index, 1)
    },
    setWarehousesItem (state, payload) {
      state.SelectedWarehousesItem = payload
    },
    DecrementStockFromWarhouses (state, payload) {
      var Stock = state.StockInWarehouses.find(s => s.quantity > 0 && s.WarehousesId === payload.WarehousesId && s.TRN === payload.TRN && s.PRN === payload.PRN && s.ProductId === payload.ProductId)
      if (Stock) {
        if (payload.SlNo) {
          var index = Stock.SlNos.indexOf(payload.SlNo)
          Stock.SlNos.splice(index, 1)
          Stock.quantity--
        } else {
          Stock.quantity--
        }
      }
    }
  }
}
