import Transfer from './../../../repositories/Warehouses/TransfersRepository'
import PORcvsRepository from './../../../repositories/PORCV/PurOrdRcvsRepository'
import WarehousesRepository from './../../../repositories/Warehouses/WarehousesRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Transfers: [],
    TrnInfo: null,
    Cart: [],
    TransferReports: []
  },
  getters: {
    getTransfers (state) {
      return _.sortBy(state.Transfers, Transfer => {
        return Transfer.TrnDate
      })
    },
    getTrnInfo (state) {
      return state.TrnInfo
    },
    getAllProductsFromCart (state, getters, rootState, rootGetters) {
      return state.Cart.map(cartitem => {
        const stockproduct = rootGetters['Products/getProductsWithStocks'].find(stockproduct => stockproduct.ProductId === cartitem.ProductId)
        return {
          ProductId: stockproduct.ProductId,
          title: stockproduct.title,
          PurchasePrice: cartitem.PurchasePrice,
          quantity: cartitem.quantity,
          SlNos: cartitem.SlNos
        }
      })
    },
    getSummationProductsFromCart (state, getters) {
      const result = _.reduce(getters.getAllProductsFromCart, (r, {PRN, ...c}) => {
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
    TrnCartTotal (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return (product.PurchasePrice * product.quantity) })
    },
    TrnCartTotalqty (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return product.quantity })
    },
    TransfersTotalqty (state, getters) {
      return _.sumBy(state.Transfers, Transfer => Transfer.TrnCartTotalqty)
    },
    TransfersTotalAmt (state, getters) {
      return _.sumBy(state.Transfers, Transfer => Transfer.TrnCartTotal)
    },
    getTransfersProductForReporting (state, getters) {
      return _(state.TransferReports)
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
    loadTransfers ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Transfers = Transfer.getTransfers(cmpId)
      commit('setTransfers', Transfers)
    },
    loadTransfer ({commit, getters}, payload) {
      var TransferInfo = getters.getTransfers.find(Trn => Trn.id === payload.id)
      var Trnitems = TransferInfo.Trnitems
      commit('setTrnInfo', TransferInfo)
      commit('setTrnCartProducts', Trnitems)
    },
    initializingTransfer ({ state, getters, commit, rootState, rootGetters }) {
      var date = new Date()
      var Year = date.getFullYear().toString().slice(2)
      var month = date.getMonth() + 1
      const TrnRealize = {}
      TrnRealize.TrnDate = date
      TrnRealize.TRN = 'TRN' + Year + month.toString()
      TrnRealize.Status = true
      TrnRealize.CreatorId = rootGetters['Users/getUser'].username
      const ReturnTrnRealize = Transfer.initializedTransfer(rootGetters['Company/getCompany'].id, TrnRealize)
      commit('setTrnInfo', ReturnTrnRealize)
      commit('PushTransfers', ReturnTrnRealize)
    },
    SavingTransfersItem ({state, getters, commit, rootState, rootGetters}, payload) {
      var CartItems = state.Cart
      var CmpId = rootGetters['Company/getCompany'].id
      const TrnInfo = {
        id: payload.id,
        WarehouseId: payload.WarehouseId,
        TrnDate: payload.TrnDate.toISOString(),
        TrnCartTotalqty: payload.TrnCartTotalqty,
        TrnCartTotal: payload.TrnCartTotal,
        Trnitems: CartItems,
        UpdatedDate: new Date(),
        UpdatorId: rootGetters['Users/getUser'].username
      }
      const ReturnTransferInfo = Transfer.SavedTransfersItem(CmpId, TrnInfo)
      for (let key in ReturnTransferInfo.Trnitems) {
        const TransferredProduct = {
          TRN: ReturnTransferInfo.id,
          WarehouseId: ReturnTransferInfo.WarehouseId,
          PRN: ReturnTransferInfo.Trnitems[key].PRN,
          ProductId: ReturnTransferInfo.Trnitems[key].ProductId,
          quantity: ReturnTransferInfo.Trnitems[key].quantity,
          SlNos: ReturnTransferInfo.Trnitems[key].SlNos
        }
        console.log(TransferredProduct)
        const InWarehouses = WarehousesRepository.StockCheckInWarehouses(CmpId, TransferredProduct)
        if (InWarehouses !== undefined) {
          if (InWarehouses.id === TransferredProduct.TRN && InWarehouses.WarehouseId === TransferredProduct.WarehouseId && InWarehouses.PRN === TransferredProduct.PRN && InWarehouses.ProductId === TransferredProduct.ProductId) {
          // update in warehouse
            WarehousesRepository.StockUpdateInWarehouses(CmpId, TransferredProduct)
            commit('Warehouses/UpdateInWarehousesStock', TransferredProduct, { root: true })
          } else {
          // push in warehouse
            WarehousesRepository.StockStoreInWarehouses(CmpId, TransferredProduct)
            commit('Warehouses/StoreInWarehousesStock', TransferredProduct, { root: true })
          }
        } else {
        // push in warehouse
          WarehousesRepository.StockStoreInWarehouses(CmpId, TransferredProduct)
          commit('Warehouses/StoreInWarehousesStock', TransferredProduct, { root: true })
        }
        const InStock = PORcvsRepository.CheckInStocks(CmpId, TransferredProduct)
        if (InStock.quantity >= TransferredProduct.quantity || InStock.SlNos.length >= TransferredProduct.SlNos.length) {
          var StockSlNos = {}
          if (InStock.SlNos.length === InStock.quantity) {
            StockSlNos.SlNos = _.xor(InStock.SlNos, TransferredProduct.SlNos)
          } else {
            StockSlNos.SlNos = InStock.SlNos
          }
          var Stocking = {
            PRN: InStock.PRN,
            ProductId: InStock.ProductId,
            quantity: InStock.quantity - TransferredProduct.quantity,
            SlNos: StockSlNos.SlNos // if found stock getting without search item
          }
          if (Stocking.quantity === 0) {
            PORcvsRepository.DecreseFromStocks(CmpId, Stocking)
          } else {
            PORcvsRepository.UpdateInStock(CmpId, Stocking)
          }
        }
      }
      commit('UpdateTransfers', TrnInfo)
      commit('setTrnInfo', null)
      commit('setTrnCartProducts', [])
    },
    setTrnInfo ({commit}, payload) {
      commit('setTrnInfo', payload)
    },
    setTrnCartProducts ({commit}, payload) {
      commit('setTrnCartProducts', payload)
    },
    addingProductToCart ({state, getters, commit, rootState, rootGetters}, payload) {
      var Stock = rootGetters['PurOrdRcvs/getAllStocksWithPurchasePrice'].find(stock => stock.quantity > 0 && stock.ProductId === payload.ProductId && stock.PurchasePrice === payload.PurchasePrice)
      if (Stock !== undefined) {
        // var StockWithPurchasePrice = rootGetters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === Stock.ProductId)
        var product = {
          PRN: Stock.PRN,
          ProductId: Stock.ProductId,
          quantity: Stock.quantity,
          PurchasePrice: Stock.PurchasePrice
        }
        if (product.quantity > 0) {
          var CartItem = state.Cart.find(CartItem => CartItem.PRN === product.PRN && CartItem.ProductId === product.ProductId)
          if (!CartItem) {
            commit('PushProductToCart', product)
          } else {
            commit('IncrementProductQty', CartItem)
          }
          commit('PurOrdRcvs/DecrementProductStock', product, {root: true})
        }
      } else {
        alert('Product not available')
      }
    },
    SearchingInStock ({state, getters, commit, rootState, rootGetters}, payload) {
      var filterKey = String(payload)
      console.log(filterKey)
      if (filterKey.length >= 8) {
        var filterdata = rootState.PurOrdRcvs.Stocks.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      console.log(filterdata)
      if (filterdata) {
        var ProductWithPurchasePrice = filterdata.map(filter => {
          var pro = rootGetters['Products/getProducts'].find(product => product.id === filter.ProductId)
          return {
            PRN: filter.PRN,
            ProductId: pro.id,
            PurchasePrice: pro.PurchasePrice,
            quantity: filter.quantity,
            SlNos: filter.SlNos
          }
        })
        const Product = {}
        for (let key in ProductWithPurchasePrice) {
          Product.PRN = ProductWithPurchasePrice[key].PRN
          Product.ProductId = ProductWithPurchasePrice[key].ProductId
          Product.PurchasePrice = ProductWithPurchasePrice[key].PurchasePrice
          Product.quantity = ProductWithPurchasePrice[key].quantity
          Product.SlNos = ProductWithPurchasePrice[key].SlNos
          Product.SlNo = payload
          if (Product.quantity > 0) {
            var CartItem = state.Cart.find(CItem => CItem.PRN === Product.PRN && CItem.ProductId === Product.ProductId)
            if (!CartItem) {
              commit('PushProductToCart', Product)
            } else {
              commit('IncrementProductQty', {
                ...CartItem,
                SlNo: payload
              })
            }
            commit('PurOrdRcvs/DecrementProductStock', Product, {root: true})
          }
        }
      }
    },
    DeletingTransfer ({state, getters, commit, rootState, rootGetters}, payload) {
      const CmpId = rootGetters['Company/getCompany'].id
      const Trn = Transfer.gottedTransferitems(CmpId, payload)
      if (Trn.TrnCartTotal !== undefined) {
        var isDeleting = confirm('Confirm Deleting...?')
        if (isDeleting) {
          for (let key in Trn.Trnitems) {
            var Trnitem = {
              TRN: Trn.Trnitems[key].TRN,
              WarehouseId: Trn.Trnitems[key].WarehouseId,
              PRN: Trn.Trnitems[key].PRN,
              ProductId: Trn.Trnitems[key].ProductId,
              quantity: Trn.Trnitems[key].quantity,
              SlNos: Trn.Trnitems[key].SlNos
            }
            var foundStock = PORcvsRepository.CheckInStocks(CmpId, Trnitem)
            if (foundStock) {
              var Stocking = {
                PRN: Trnitem.PRN,
                ProductId: Trnitem.ProductId,
                quantity: foundStock.quantity + Trnitem.quantity,
                SlNos: _.concat(foundStock.SlNos, Trnitem.SlNos)
              }
              PORcvsRepository.UpdateInStock(CmpId, Stocking)
              commit('PurOrdRcvs/PushInStocks', Stocking, {root: true})
            } else {
              PORcvsRepository.StoreInStock(CmpId, Trnitem)
              commit('PurOrdRcvs/PushInStocks', Trnitem, {root: true})
            }
          }
          WarehousesRepository.StockDeleteFromWarehouses(CmpId, Trn.id)
          Transfer.DeletedTransfer(CmpId, Trn.id)
          commit('Warehouses/RemoveFromWarehousesStock', Trn.id, { root: true })
          commit('RemoveTransfer', Trn.id)
        }
      } else {
        confirm('Deleting...Liton?') &&
        Transfer.DeletedTransfer(CmpId, Trn.id) &&
        WarehousesRepository.StockDeleteFromWarehouses(CmpId, Trn.id)
        commit('Warehouses/RemoveFromWarehousesStock', Trn.id, { root: true })
        commit('RemoveTransfer', Trn.id)
        var cart = state.Cart
        if (cart.length > 0) {
          for (let item in cart) {
            var products = {
              PRN: cart[item].PRN,
              ProductId: cart[item].ProductId,
              quantity: cart[item].quantity,
              SlNos: cart[item].SlNos
            }
            var gettingStock = PORcvsRepository.CheckInStocks(CmpId, products)
            if (gettingStock) {
              console.log(gettingStock)
              var StockSlNos = {}
              if (gettingStock.SlNos.length === gettingStock.quantity) {
                StockSlNos.SlNos = gettingStock.SlNos
              } else {
                StockSlNos.SlNos = _.concat(gettingStock.SlNos, products.SlNos)
              }
              var keeping = {
                PRN: gettingStock.PRN,
                ProductId: gettingStock.ProductId,
                quantity: gettingStock.quantity,
                SlNos: StockSlNos.SlNos
              }
              PORcvsRepository.UpdateInStock(CmpId, keeping)
            }
            commit('PurOrdRcvs/PushInStocksFromCart', products, {root: true})
          }
          commit('setTrnCartProducts', [])
        }
        commit('setTrnInfo', null)
      }
    },
    decrementingProductSlNoFromCart ({state, getters, commit, rootState, rootGetters}, payload) {
      var filterkey = String(payload)
      var SlNos = []
      SlNos.push(filterkey)
      var FilteringProductFromCart = state.Cart.filter(function (row) {
        return Object.keys(row).some(function (key) {
          return String(row[key]).toLowerCase().indexOf(filterkey) > -1
        })
      })
      for (let key in FilteringProductFromCart) {
        var product = {
          PRN: FilteringProductFromCart[key].PRN,
          ProductId: FilteringProductFromCart[key].ProductId,
          quantity: 1,
          SlNos: SlNos,
          SlNo: filterkey
        }
        commit('PurOrdRcvs/PushInStocksFromCart', product, {root: true})
        commit('decrementingProductFromCart', product)
      }
    },
    decrementingProductFromCart ({state, getters, commit, rootState, rootGetters}, payload) {
      var CartItem = state.Cart.find(item => item.ProductId === payload.ProductId)
      var product = {
        PRN: CartItem.PRN,
        ProductId: CartItem.ProductId,
        quantity: 1,
        SlNos: []
      }
      commit('PurOrdRcvs/PushInStocksFromCart', product, {root: true})
      commit('decrementingProductFromCart', product)
    },
    findTransfersProduct ({state, getters, commit, rootState, rootGetters}, payload) {
      var products = []
      var results = []
      if (payload.WarehouseId === null || payload.WarehouseId === undefined) {
        results = (_.filter(getters.getTransfersWithPayment, prd => prd.TrnDate >= payload.d1.toISOString() && prd.TrnDate <= payload.d2.toISOString()))
      } else {
        results = (_.filter(getters.getTransfersWithPayment, prd => prd.TrnDate >= payload.d1.toISOString() && prd.TrnDate <= payload.d2.toISOString() && prd.WarehouseId === payload.WarehouseId))
      }
      for (let r in results) {
        var Items = (results[r].Trnitems)
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
    PushProductToCart (state, payload) {
      state.Cart.push({
        PRN: payload.PRN,
        ProductId: payload.ProductId,
        PurchasePrice: payload.PurchasePrice,
        SlNos: [],
        quantity: 1
      })
      var getPrd = state.Cart.find(p => p.PRN === payload.PRN && p.ProductId === payload.ProductId)
      if (payload.SlNos && payload.SlNos.length > 0) {
        getPrd.SlNos.push(payload.SlNo)
      }
    },
    IncrementProductQty (state, payload) {
      var getPrd = state.Cart.find(p => p.PRN === payload.PRN && p.ProductId === payload.ProductId)
      if (payload.SlNo) {
        getPrd.SlNos.push(payload.SlNo)
      }
      getPrd.quantity++
    },
    setTrnInfo (state, payload) {
      state.TrnInfo = payload
    },
    success (state, payload) {
      alert('Success')
    },
    setTrnCartProducts (state, payload) {
      state.Cart = payload
    },
    setTransfers (state, payload) {
      state.Transfers = payload
    },
    PushTransfers (state, payload) {
      state.Transfers.push(payload)
    },
    UpdateTransfers (state, payload) {
      var Transfer = state.Transfers.find(Transfer => Transfer.id === payload.id)
      if (Transfer) {
        Transfer.WarehouseId = payload.WarehouseId
        Transfer.TrnDate = payload.TrnDate
        Transfer.TrnCartTotalqty = payload.TrnCartTotalqty
        Transfer.TrnCartTotal = payload.TrnCartTotal
        Transfer.Trnitems = payload.Trnitems
        Transfer.UpdatedDate = payload.UpdatedDate
        Transfer.UpdatorId = payload.UpdatorId
      }
    },
    RemoveTransfer (state, payload) {
      var Transfer = state.Transfers.find(Transfer => Transfer.id === payload)
      var index = state.Transfers.indexOf(Transfer)
      state.Transfers.splice(index, 1)
    },
    decrementingProductFromCart (state, payload) {
      const CartItem = state.Cart.find(item => item.PRN === payload.PRN && item.ProductId === payload.ProductId)
      if (CartItem) {
        if (payload.SlNo || payload.SlNos.length > 0) {
          // working with sl sno
          if (CartItem.quantity === 1) {
            state.Cart.splice(state.Cart.indexOf(CartItem), 1)
          } else {
            CartItem.SlNos.splice(CartItem.SlNos.indexOf(payload.SlNo), 1)
            CartItem.quantity--
          }
        } else {
          if (CartItem.quantity === 1) {
            state.Cart.splice(state.Cart.indexOf(CartItem), 1)
          } else {
            CartItem.quantity--
          }
        }
      }
    },
    PushProductToReports (state, Payload) {
      state.TransferReports = Payload
    }
  }
}
