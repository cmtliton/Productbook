import PORcvsRepository from './../../../repositories/PORCV/PurOrdRcvsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Stocks: [],
    PORcvs: [],
    SuppliersPaymentHistory: [],
    PORInfo: null,
    PORCartProducts: [],
    ReceivesReport: []
  },
  getters: {
    getPORcvs (state) {
      return _.sortBy(state.PORcvs, POR => {
        return POR.PORDate
      })
    },
    // getPORcvsWithSupplier (state, getters, rootState, rootGetters) {
    //   return rootGetters['PurOrds/getPurOrds'].map(po => {
    //     const rcvs = getters.getPORcvs.find(rcv => rcv.PON === po.id)
    //     return {
    //       ...rcvs,
    //       SupplierId: po.SupplierId
    //     }
    //   })
    // },
    getPORInfo (state) {
      return state.PORInfo
    },
    getPORCartProducts (state) {
      return state.PORCartProducts
    },
    getPORById (state) {
      return (PurOrdId) => {
        return state.PORcvs.find((PurOrd) => {
          return PurOrd.id === PurOrdId
        })
      }
    },
    PORCartTotal (state) {
      return _.sumBy(state.PORCartProducts, product => { return (product.PurchasePrice * product.quantity) })
    },
    PORCartTotalqty (state) {
      return _.sumBy(state.PORCartProducts, product => { return product.quantity })
    },
    ReceivesTotalqty (state) {
      return _.sumBy(state.PORcvs, product => product.PORCartTotalqty)
    },
    ReceivesTotal (state) {
      return _.sumBy(state.PORcvs, product => product.PORCartTotal)
    },
    getStockByPRN (state) {
      return _(state.Stocks)
        .groupBy('PRN')
        .map((g, PRN) => {
          return {
            PRN: PRN,
            quantity: _.sumBy(g, 'quantity')
          }
        })
        .values()
        .value()
    },
    getStocks (state) {
      const result = _.reduce(state.Stocks, (r, {PRN, ...c}) => {
        let _c = _.find(r, {'ProductId': c.ProductId})
        if (_c) {
          _c = _.mergeWith(_c, c, (ov, sv, k) => _.includes(['quantity', 'SlNos'], k) ? _.isArray(sv) ? (ov || []).concat(sv) : _.isNumber(sv) ? sv + (ov || 0) : sv : ov)
        } else {
          r.push(c)
        }
        return r
      }, [])
      return result
    },
    getAllStocks (state) {
      return state.Stocks
    },
    getAllStocksWithPurchasePrice (state, getters) {
      return getters.getAllStocks.map(s => {
        var Receive = state.PORcvs.find(r => r.id === s.PRN)
        var item = Receive.PORitems.find(prd => prd.ProductId === s.ProductId)
        return {
          PRN: s.PRN,
          ProductId: s.ProductId,
          PurchasePrice: item.PurchasePrice,
          quantity: s.quantity,
          SlNos: s.SlNos
        }
      })
    },
    getStocksWithPurchasePrice (state, getters) {
      const result = _.reduce(getters.getAllStocksWithPurchasePrice, (r, {PRN, ...c}) => {
        let _c = _.find(r, {'ProductId': c.ProductId, 'PurchasePrice': c.PurchasePrice})
        if (_c) {
          _c = _.mergeWith(_c, c, (ov, sv, k) => _.includes(['quantity', 'SlNos'], k) ? _.isArray(sv) ? (ov || []).concat(sv) : _.isNumber(sv) ? sv + (ov || 0) : sv : ov)
        } else {
          r.push(c)
        }
        return r
      }, [])
      return result
    },
    getSupplierPaymentHistory (state) {
      return state.SuppliersPaymentHistory
    },
    getReceivesProductForReporting (state, getters) {
      return _(state.ReceivesReport)
        .groupBy('ProductId')
        .map((g, ProductId) => {
          const quantity = _.sumBy(g, 'quantity')
          return {
            ProductId: ProductId,
            quantity,
            PurchasePrice: quantity * _.get(g, '[0].PurchasePrice')
          }
        })
        .values()
        .value()
    }
  },
  actions: {
    loadPORcvs ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const PORcvs = PORcvsRepository.getPurOrdRcvs(cmpId)
      commit('setPORcvs', PORcvs)
    },
    loadSuppliersPaymentHistory ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const SuppliersPaymentHistory = PORcvsRepository.getPaymentHistoryForSupplier(cmpId)
      commit('setSuppliersPaymentHistory', SuppliersPaymentHistory)
    },
    loadStocks ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Stocks = PORcvsRepository.LoadStocks(cmpId)
      const StockInfo = []
      for (let key in Stocks) {
        StockInfo.push({
          PRN: Stocks[key].PRN,
          ProductId: Stocks[key].ProductId,
          quantity: Stocks[key].quantity,
          SlNos: Stocks[key].SlNos
        })
      }
      commit('LoadStocks', StockInfo)
    },
    gettingPOitems ({state, getters, commit, rootState, rootGetters}, payload) {
      const PO = PORcvsRepository.getPO(rootGetters['Company/getCompany'].id, payload)
      commit('setPOitems', PO.POitems)
    },
    initializePOR ({ state, getters, commit, rootState, rootGetters }) {
      var date = new Date()
      var Year = date.getFullYear().toString().slice(2)
      var month = date.getMonth() + 1
      const PORrealize = {}
      PORrealize.PORDate = date.toISOString()
      PORrealize.PRN = 'PRN' + Year + 0 + month.toString()
      PORrealize.Status = false
      PORrealize.CreatorId = rootGetters['Users/getUser'].username
      const ReturnPORrealize = PORcvsRepository.initializePOR(rootGetters['Company/getCompany'].id, PORrealize)
      commit('setPORInfo', ReturnPORrealize)
      commit('PushToPORcvs', ReturnPORrealize)
    },
    onSavingPurOrdRcv ({ state, getters, commit, rootState, rootGetters }, payload) {
      const PORInfo = {
        PRN: payload.PRN,
        PORDate: payload.PORDate,
        PON: payload.PON,
        PORCartTotalqty: payload.PORCartTotalqty,
        PORCartTotal: payload.PORCartTotal,
        Status: true,
        UpdatedDate: new Date(),
        UpdatorId: rootGetters['Users/getUser'].username,
        PORitems: getters.getPORCartProducts
      }
      // const PaymentInfo = {
      //   SupplierId: payload.SupplierId,
      //   PRN: payload.PRN,
      //   Date: payload.PORDate,
      //   PaidAmt: payload.PaidAmt,
      //   Username: rootGetters.getUser.username
      // }
      PORcvsRepository.CreatePurOrdRcv(rootGetters['Company/getCompany'].id, PORInfo)
      PORcvsRepository.changePOsStatus(rootGetters['Company/getCompany'].id, PORInfo)
      // PORcvsRepository.SavedPaymentForSupplier(rootGetters['Company/getCompany'].id, PaymentInfo)
      commit('UpdateInPORcvs', PORInfo)
      commit('PurOrds/PurOrdStatusChanges', PORInfo, {root: true})
      // commit('PushPaymentInfoForSupplier', PaymentInfo)
    },
    StoreInStock ({state, getters, commit, rootState, rootGetters}, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      for (let Key in getters.getPORCartProducts) {
        const Stock = {
          PRN: payload,
          ProductId: getters.getPORCartProducts[Key].ProductId,
          quantity: getters.getPORCartProducts[Key].quantity,
          SlNos: getters.getPORCartProducts[Key].SlNos
        }
        if (PORcvsRepository.CheckInStocks(cmpId, Stock) === undefined) {
          PORcvsRepository.StoreInStock(cmpId, Stock)
          commit('PushInStocks', Stock)
        } else {
          PORcvsRepository.UpdateInStock(cmpId, Stock)
          commit('PushInStocks', Stock)
        }
      }
    },
    setPORInfo ({commit}, payload) {
      commit('setPORInfo', payload)
    },
    setPORCartProducts ({commit}, payload) {
      commit('setPORCartProducts', payload)
    },
    DeletingReceived ({state, getters, commit, rootState, rootGetters}, payload) {
      var CheckInStock = getters.getStockByPRN.find(PRN => {
        return PRN.PRN === payload.id
      })
      var Stocks = state.Stocks
      var getFromStocks = []
      for (let key in Stocks) {
        if (Stocks[key].PRN === payload.id) {
          getFromStocks.push({
            PRN: Stocks[key].PRN,
            quantity: Stocks[key].quantity
          })
        }
      }
      var PONInfo = {
        PON: payload.PON,
        PORDate: payload.PORDate,
        Status: false
      }
      if (CheckInStock !== undefined) {
        if (CheckInStock.quantity === payload.PORCartTotalqty) {
          var isDeleted = confirm('Are you sure you want to delete this Receive?')
          if (isDeleted) {
            PORcvsRepository.PurOrdRcvRemove(rootGetters['Company/getCompany'].id, payload.id)
            PORcvsRepository.changePOsStatus(rootGetters['Company/getCompany'].id, PONInfo)
            for (let key in getFromStocks) {
              PORcvsRepository.DeleteFromStocks(rootGetters['Company/getCompany'].id, getFromStocks[key].PRN)
              commit('removeFromStocks', getFromStocks[key].PRN)
            }
            commit('setPORRemove', payload)
            commit('PurOrds/PurOrdStatusChanges', PONInfo, {root: true})
            commit('setPORInfo', null) &&
            commit('setPORCartProducts', [])
          }
        } else {
          alert('This are not deletable, few product are sale out')
        }
      } else {
        if (!payload.PORCartTotalqty) {
          confirm('Are you sure you want to delete this Receive--Liton?') &&
          PORcvsRepository.PurOrdRcvRemove(rootGetters['Company/getCompany'].id, payload.id) &&
          commit('setPORRemove', payload) &&
          commit('PurOrds/PurOrdStatusChanges', PONInfo, {root: true}) &&
          commit('setPORInfo', null) &&
          commit('setPORCartProducts', [])
        } else {
          alert('This are not deletable, All product are sale out')
        }
      }
    },
    loadPORInfo ({state, getters, commit, rootState, rootGetters}, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const PRN = payload.id
      var CheckInStock = getters.getStockByPRN.find(PRN => {
        return PRN.PRN === payload.id
      })
      var Stock = {}
      if (CheckInStock !== undefined) {
        Stock.quantity = CheckInStock.quantity
      } else {
        Stock.quantity = 0
      }
      const returnPORInfo = PORcvsRepository.getPORInfo(cmpId, PRN)
      const setPORInfo = {
        id: returnPORInfo.id,
        PORDate: returnPORInfo.PORDate,
        PON: returnPORInfo.PON,
        PORCartTotalqty: returnPORInfo.PORCartTotalqty,
        PORCartTotal: returnPORInfo.PORCartTotal,
        StockQty: Stock.quantity
      }
      commit('setPORInfo', setPORInfo)
      if (returnPORInfo.PORitems !== undefined) {
        commit('setPORCartProducts', returnPORInfo.PORitems)
      }
    },
    onSubmittedEditedProductToPOCart ({commit}, payload) {
      commit('updatingProductToPOCart', payload)
    },
    takingSlNos ({commit}, payload) {
      commit('setTakingSlNos', payload)
    },
    findReceivesProduct ({state, getters, commit, rootState, rootGetters}, payload) {
      var products = []
      var results = []
      if (payload.SupplierId === null || payload.SupplierId === undefined) {
        results = (_.filter(getters.getPORcvs, prd => prd.PORDate >= payload.d1.toISOString() && prd.PORDate <= payload.d2.toISOString()))
      } else {
        const RcvsWithSupplier = rootGetters['PurOrds/getPurOrds'].map(po => {
          const rcvs = getters.getPORcvs.find(rcv => rcv.PON === po.id)
          return {
            ...rcvs,
            SupplierId: po.SupplierId
          }
        })
        results = (_.filter(RcvsWithSupplier, prd => prd.PORDate >= payload.d1.toISOString() && prd.PORDate <= payload.d2.toISOString() && prd.SupplierId === payload.SupplierId))
      }
      for (let r in results) {
        var Items = (results[r].PORitems)
        for (let l in Items) {
          products.push({
            ProductId: Items[l].ProductId,
            PurchasePrice: Items[l].PurchasePrice,
            quantity: Items[l].quantity
          })
        }
      }
      commit('PushProductToReports', products)
    }
  },
  mutations: {
    PushToPORcvs (state, payload) {
      state.PORcvs.push(payload)
    },
    PushPaymentInfoForSupplier (state, payload) {
      state.SuppliersPaymentHistory.push(payload)
    },
    UpdateInPORcvs (state, payload) {
      var PORcv = state.PORcvs.find(por => por.id === payload.PRN)
      if (PORcv) {
        PORcv.PORDate = payload.PORDate
        PORcv.PORCartTotalqty = payload.PORCartTotalqty
        PORcv.PORCartTotal = payload.PORCartTotal
        PORcv.Status = payload.Status
        PORcv.PON = payload.PON
      }
    },
    setPORInfo (state, payload) {
      state.PORInfo = payload
    },
    setPOitems (state, payload) {
      state.PORCartProducts = payload
    },
    setPORCartProducts (state, payload) {
      state.PORCartProducts = payload
    },
    setPORcvs (state, payload) {
      state.PORcvs = payload
    },
    setSuppliersPaymentHistory (state, payload) {
      state.SuppliersPaymentHistory = payload
    },
    setPORRemove (state, payload) {
      const index = state.PORcvs.indexOf(payload)
      state.PORcvs.splice(index, 1)
      state.PurOrd = null
    },
    removeFromStocks (state, payload) {
      const Stock = state.Stocks.find(prn => prn.PRN === payload)
      state.Stocks.splice(state.Stocks.indexOf(Stock), 1)
    },
    setTakingSlNos (state, payload) {
      const productInCart = state.PORCartProducts.find(Pid => {
        return Pid.ProductId === payload.ProductId
      })
      productInCart.SlNos = payload.SlNos
    },
    PushInStocks (state, payload) {
      var RemovingStock = state.Stocks.find(stock => stock.quantity === 0 && stock.PRN === payload.PRN && stock.ProductId === payload.ProductId)
      if (RemovingStock) {
        state.Stocks.splice(state.Stocks.indexOf(RemovingStock), 1)
      }
      var stock = state.Stocks.find(stock => stock.quantity > 0 && stock.PRN === payload.PRN && stock.ProductId === payload.ProductId)
      if (stock) { // Update Stock
        if (payload.quantity) {
          stock.quantity = payload.quantity
        }
        if (payload.SlNos) {
          stock.SlNos = payload.SlNos
        }
      } else { // Push To Stock
        state.Stocks.push({
          PRN: payload.PRN,
          ProductId: payload.ProductId,
          quantity: payload.quantity,
          SlNos: payload.SlNos
        })
      }
    },
    PushInStocksFromCart (state, payload) {
      var RemovingStock = state.Stocks.find(stock => stock.quantity === 0 && stock.PRN === payload.PRN && stock.ProductId === payload.ProductId)
      if (RemovingStock) {
        state.Stocks.splice(state.Stocks.indexOf(RemovingStock), 1)
      }
      var Stock = state.Stocks.find(stock => stock.quantity > 0 && stock.PRN === payload.PRN && stock.ProductId === payload.ProductId)
      if (Stock) {
        var nowStock = {}
        nowStock.quantity = Stock.quantity + payload.quantity
        if (payload.SlNos.length > 0) {
          nowStock.SlNos = _.concat(Stock.SlNos, payload.SlNos)
        }
        Stock.quantity = nowStock.quantity
        Stock.SlNos = nowStock.SlNos
      } else {
        state.Stocks.push({
          PRN: payload.PRN,
          ProductId: payload.ProductId,
          quantity: payload.quantity,
          SlNos: payload.SlNos
        })
      }
    },
    LoadStocks (state, payload) {
      state.Stocks = payload
    },
    DecrementProductStock (state, payload) {
      var Stock = state.Stocks.find(s => s.quantity > 0 && s.PRN === payload.PRN && s.ProductId === payload.ProductId)
      if (Stock) {
        if (payload.SlNo) {
          var index = Stock.SlNos.indexOf(payload.SlNo)
          Stock.SlNos.splice(index, 1)
          Stock.quantity--
        } else {
          Stock.quantity--
        }
      }
    },
    PushProductToReports (state, Payload) {
      state.ReceivesReport = Payload
    }
  }
}
