import Return from './../../../repositories/Warehouses/ReturnsRepository'
import PORcvsRepository from './../../../repositories/PORCV/PurOrdRcvsRepository'
import WarehousesRepository from './../../../repositories/Warehouses/WarehousesRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Returns: [],
    RtnInfo: null,
    Cart: [],
    ReturnReports: []
  },
  getters: {
    getReturns (state) {
      return _.sortBy(state.Returns, Return => {
        return Return.RtnDate
      })
    },
    getRtnInfo (state) {
      return state.RtnInfo
    },
    getAllProductsFromCart (state, getters, rootState, rootGetters) {
      return state.Cart.map(cartitem => {
        const Product = rootGetters['Products/getProductsWithItemAndBrand'].find(p => p.ProductId === cartitem.ProductId)
        return {
          ProductId: Product.ProductId,
          title: Product.title,
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
    RtnCartTotal (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return (product.PurchasePrice * product.quantity) })
    },
    RtnCartTotalqty (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return product.quantity })
    },
    ReturnsTotalqty (state, getters) {
      return _.sumBy(state.Returns, Return => Return.RtnCartTotalqty)
    },
    ReturnsTotalAmt (state, getters) {
      return _.sumBy(state.Returns, Return => Return.RtnCartTotal)
    },
    getReturnsProductForReporting (state, getters) {
      return _(state.ReturnReports)
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
    },
    getWarehouseIdFrmCart (state) {
      var wid = ''
      for (let key in state.Cart) {
        wid = state.Cart[key].WarehouseId
      }
      return wid
    }
  },
  actions: {
    loadReturns ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Returns = Return.getReturns(cmpId)
      commit('setReturns', Returns)
    },
    loadReturn ({commit, getters}, payload) {
      var ReturnInfo = getters.getReturns.find(Rtn => Rtn.id === payload.id)
      var Rtnitems = ReturnInfo.Rtnitems
      commit('setRtnInfo', ReturnInfo)
      commit('setRtnCartProducts', Rtnitems)
    },
    initializingReturn ({ state, getters, commit, rootState, rootGetters }) {
      var date = new Date()
      var Year = date.getFullYear().toString().slice(2)
      var month = date.getMonth() + 1
      const RtnRealize = {}
      RtnRealize.RtnDate = date
      RtnRealize.RTN = 'RTN' + Year + month.toString()
      RtnRealize.Status = true
      RtnRealize.CreatorId = rootGetters['Users/getUser'].username
      const ReturnRtnRealize = Return.initializedReturn(rootGetters['Company/getCompany'].id, RtnRealize)
      commit('setRtnInfo', ReturnRtnRealize)
      commit('PushReturns', ReturnRtnRealize)
    },
    SavingReturnsItem ({state, getters, commit, rootState, rootGetters}, payload) {
      var CartItems = state.Cart
      var CmpId = rootGetters['Company/getCompany'].id
      const RtnInfo = {
        id: payload.id,
        WarehouseId: payload.WarehouseId,
        RtnDate: payload.RtnDate.toISOString(),
        RtnCartTotalqty: payload.RtnCartTotalqty,
        RtnCartTotal: payload.RtnCartTotal,
        Rtnitems: CartItems,
        UpdatedDate: new Date(),
        UpdatorId: rootGetters['Users/getUser'].username
      }
      const ReturnInfo = Return.SavedReturnsItem(CmpId, RtnInfo)
      for (let key in ReturnInfo.Rtnitems) {
        const ReturnedProduct = {
          RTN: ReturnInfo.id,
          WarehouseId: ReturnInfo.WarehouseId,
          TRN: ReturnInfo.Rtnitems[key].TRN,
          PRN: ReturnInfo.Rtnitems[key].PRN,
          ProductId: ReturnInfo.Rtnitems[key].ProductId,
          quantity: ReturnInfo.Rtnitems[key].quantity,
          SlNos: ReturnInfo.Rtnitems[key].SlNos
        }
        // Stock Remove From Warehouses
        const InWarehouses = WarehousesRepository.StockCheckInWarehouses(CmpId, ReturnedProduct)
        if (InWarehouses !== undefined) {
          if (InWarehouses.quantity >= ReturnedProduct.quantity || InWarehouses.SlNos.length >= ReturnedProduct.SlNos.length) {
            var wStockSlNos = {}
            if (InWarehouses.SlNos.length === InWarehouses.quantity) {
              wStockSlNos.SlNos = _.xor(InWarehouses.SlNos, ReturnedProduct.SlNos)
            } else {
              wStockSlNos.SlNos = InWarehouses.SlNos
            }
            var wStocking = {
              WarehouseId: InWarehouses.WarehouseId,
              TRN: InWarehouses.TRN,
              PRN: InWarehouses.PRN,
              ProductId: InWarehouses.ProductId,
              quantity: InWarehouses.quantity - ReturnedProduct.quantity,
              SlNos: wStockSlNos.SlNos // if found stock getting without search item
            }
            if (wStocking.quantity === 0) {
              WarehousesRepository.StockRemoveFromWarehouses(CmpId, wStocking)
            } else {
              WarehousesRepository.StockUpdateInWarehouses(CmpId, wStocking)
              commit('Warehouses/DecrementStockFromWarhouses', wStocking, {root: true})
            }
          }
        } else {
          alert('Warehouses Stock not available!')
        }
        // Stock Update in Main Stock
        const InStock = PORcvsRepository.CheckInStocks(CmpId, ReturnedProduct)
        if (InStock !== undefined) {
          if (InStock.quantity >= ReturnedProduct.quantity || InStock.SlNos.length >= ReturnedProduct.SlNos.length) {
            var Stocking = {
              PRN: InStock.PRN,
              ProductId: InStock.ProductId,
              quantity: InStock.quantity + ReturnedProduct.quantity,
              SlNos: _.concat(InStock.SlNos, ReturnedProduct.SlNos) // if found stock getting without search item
            }
            PORcvsRepository.UpdateInStock(CmpId, Stocking)
            commit('PurOrdRcvs/PushInStocks', Stocking, {root: true})
          }
        } else {
          PORcvsRepository.StoreInStock(CmpId, ReturnedProduct)
          commit('PurOrdRcvs/PushInStocks', ReturnedProduct, {root: true})
        }
      }
      commit('UpdateReturns', RtnInfo)
      commit('setRtnInfo', null)
      commit('setRtnCartProducts', [])
    },
    setRtnInfo ({commit}, payload) {
      commit('setRtnInfo', payload)
    },
    setRtnCartProducts ({commit}, payload) {
      commit('setRtnCartProducts', payload)
    },
    addingProductToCart ({state, getters, commit, rootState, rootGetters}, payload) {
      var Stock = rootGetters['Warehouses/getWarehousesStock'].find(stock => stock.quantity > 0 && stock.WarehouseId === payload.WarehouseId && stock.ProductId === payload.ProductId)
      if (Stock !== undefined) {
        var StockWithPurchasePrice = rootGetters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === Stock.ProductId)
        var product = {
          WarehouseId: Stock.WarehouseId,
          TRN: Stock.TRN,
          PRN: Stock.PRN,
          ProductId: Stock.ProductId,
          quantity: Stock.quantity,
          PurchasePrice: StockWithPurchasePrice.PurchasePrice
        }
        if (product.quantity > 0) {
          var CartItem = state.Cart.find(CartItem => CartItem.WarehouseId === product.WarehouseId && CartItem.TRN === product.TRN && CartItem.PRN === product.PRN && CartItem.ProductId === product.ProductId)
          if (!CartItem) {
            commit('PushProductToCart', product)
          } else {
            commit('IncrementProductQty', CartItem)
          }
          commit('Warehouses/DecrementStockFromWarhouses', product, {root: true})
          // commit('Warehouses/DecrementSelectedWarehousesStock', product, {root: true})
        }
      } else {
        alert('Product not available')
      }
    },
    SearchingStockInWarehouses ({state, getters, commit, rootState, rootGetters}, payload) {
      var filterKey = String(payload)
      if (filterKey.length >= 8) {
        var filterdata = rootGetters['Warehouses/getWarehousesStock'].filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (filterdata) {
        var ProductWithPurchasePrice = filterdata.map(filter => {
          var pro = rootGetters['Products/getProducts'].find(product => product.id === filter.ProductId)
          return {
            WarehouseId: filter.WarehouseId,
            TRN: filter.TRN,
            PRN: filter.PRN,
            ProductId: pro.id,
            PurchasePrice: pro.PurchasePrice,
            quantity: filter.quantity,
            SlNos: filter.SlNos
          }
        })
        const product = {}
        for (let key in ProductWithPurchasePrice) {
          product.WarehouseId = ProductWithPurchasePrice[key].WarehouseId
          product.TRN = ProductWithPurchasePrice[key].TRN
          product.PRN = ProductWithPurchasePrice[key].PRN
          product.ProductId = ProductWithPurchasePrice[key].ProductId
          product.PurchasePrice = ProductWithPurchasePrice[key].PurchasePrice
          product.quantity = ProductWithPurchasePrice[key].quantity
          product.SlNos = ProductWithPurchasePrice[key].SlNos
          product.SlNo = payload
          if (product.quantity > 0) {
            var CartItem = state.Cart.find(CartItem => CartItem.WarehouseId === product.WarehouseId && CartItem.TRN === product.TRN && CartItem.PRN === product.PRN && CartItem.ProductId === product.ProductId)
            if (!CartItem) {
              commit('PushProductToCart', product)
            } else {
              commit('IncrementProductQty', {
                ...CartItem,
                SlNo: payload
              })
            }
            commit('Warehouses/DecrementStockFromWarhouses', product, {root: true})
          }
        }
      }
    },
    DeletingReturn ({state, getters, commit, rootState, rootGetters}, payload) {
      const CmpId = rootGetters['Company/getCompany'].id
      const Rtn = Return.gottedReturnitems(CmpId, payload)
      if (Rtn.RtnCartTotal !== undefined) {
        var isDeleting = confirm('Confirm Deleting...?')
        if (isDeleting) {
          for (let key in Rtn.Rtnitems) {
            const Rtnitem = {
              TRN: Rtn.Rtnitems[key].TRN,
              WarehouseId: Rtn.Rtnitems[key].WarehouseId,
              PRN: Rtn.Rtnitems[key].PRN,
              ProductId: Rtn.Rtnitems[key].ProductId,
              quantity: Rtn.Rtnitems[key].quantity,
              SlNos: Rtn.Rtnitems[key].SlNos
            }
            const foundStock = PORcvsRepository.CheckInStocks(CmpId, Rtnitem)
            if (foundStock.quantity >= Rtnitem.quantity) {
              const Stocking = {
                PRN: Rtnitem.PRN,
                ProductId: Rtnitem.ProductId,
                quantity: foundStock.quantity - Rtnitem.quantity,
                SlNos: _.xor(foundStock.SlNos, Rtnitem.SlNos)
              }
              PORcvsRepository.UpdateInStock(CmpId, Stocking)
              commit('PurOrdRcvs/PushInStocks', Stocking, {root: true})
              // push in warehouses stock
              const WStock = WarehousesRepository.StockCheckInWarehouses(CmpId, Rtnitem)
              if (WStock) {
                // update warehouses stock
                const wStocking = {
                  WarehouseId: Rtnitem.WarehouseId,
                  TRN: Rtnitem.TRN,
                  PRN: Rtnitem.PRN,
                  ProductId: Rtnitem.ProductId,
                  quantity: WStock.quantity + Rtnitem.quantity,
                  SlNos: _.concat(WStock.SlNos, Rtnitem.SlNos)
                }
                WarehousesRepository.StockUpdateInWarehouses(CmpId, wStocking)
                commit('Warehouses/StoreInWarehousesStock', Rtnitem, {root: true})
              } else {
                // push in warehouses stock
                WarehousesRepository.StockStoreInWarehouses(CmpId, Rtnitem)
                commit('Warehouses/StoreInWarehousesStock', Rtnitem, {root: true})
              }
              // delete from return
              Return.DeletedReturn(CmpId, Rtn.id)
              console.log(Rtn.id)
              commit('RemoveReturn', Rtn.id)
            } else {
              alert('Return can not be deleted!')
            }
          }
        }
      } else {
        confirm('Deleting?') &&
        Return.DeletedReturn(CmpId, Rtn.id) &&
        commit('RemoveReturn', Rtn.id)
        var cart = state.Cart
        if (cart.length > 0) {
          for (let item in cart) {
            var products = {
              WarehouseId: cart[item].WarehouseId,
              TRN: cart[item].TRN,
              PRN: cart[item].PRN,
              ProductId: cart[item].ProductId,
              quantity: cart[item].quantity,
              SlNos: cart[item].SlNos
            }
            var gettingStock = WarehousesRepository.StockCheckInWarehouses(CmpId, products)
            if (gettingStock) {
              console.log(gettingStock)
              var StockSlNos = {}
              if (gettingStock.SlNos.length === gettingStock.quantity) {
                StockSlNos.SlNos = gettingStock.SlNos
              } else {
                StockSlNos.SlNos = _.concat(gettingStock.SlNos, products.SlNos)
              }
              var keeping = {
                WarehouseId: gettingStock.WarehouseId,
                TRN: gettingStock.TRN,
                PRN: gettingStock.PRN,
                ProductId: gettingStock.ProductId,
                quantity: gettingStock.quantity,
                SlNos: StockSlNos.SlNos
              }
              WarehousesRepository.StockUpdateInWarehouses(CmpId, keeping)
            }
            commit('Warehouses/StoreInWarehousesStock', products, {root: true})
          }
        }
        commit('setRtnCartProducts', [])
        commit('setRtnInfo', null)
      }
    },
    decrementingProductSlNoFromCart ({state, commit}, payload) {
      var filterkey = String(payload)
      var SlNos = []
      SlNos.push(filterkey)
      var FilteringProductFromCart = state.Cart.filter(function (row) {
        return Object.keys(row).some(function (key) {
          return String(row[key]).toLowerCase().indexOf(filterkey) > -1
        })
      })
      console.log(FilteringProductFromCart)
      for (let key in FilteringProductFromCart) {
        var product = {
          WarehouseId: FilteringProductFromCart[key].WarehouseId,
          TRN: FilteringProductFromCart[key].TRN,
          PRN: FilteringProductFromCart[key].PRN,
          ProductId: FilteringProductFromCart[key].ProductId,
          quantity: 1,
          SlNos: SlNos,
          SlNo: filterkey
        }
        console.log(product)
        commit('Warehouses/StoreInWarehousesStock', product, {root: true})
        commit('decrementingProductFromCart', product)
      }
    },
    decrementingProductFromCart ({state, commit}, payload) {
      var CartItem = state.Cart.find(item => item.ProductId === payload.ProductId)
      var product = {
        PRN: CartItem.PRN,
        ProductId: CartItem.ProductId,
        quantity: 1,
        SlNos: []
      }
      commit('Warehouses/StoreInWarehousesStock', product, {root: true})
      commit('decrementingProductFromCart', product)
    },
    // findReturnsProduct ({state, getters, commit, rootState, rootGetters}, payload) {
    //   var products = []
    //   if (payload.WarehouseId === null || payload.WarehouseId === undefined) {
    //     const results = (_.filter(getters.getReturnsWithPayment, prd => prd.RtnDate >= payload.d1.toISOString() && prd.RtnDate <= payload.d2.toISOString()))
    //   } else {
    //     const results = (_.filter(getters.getReturnsWithPayment, prd => prd.RtnDate >= payload.d1.toISOString() && prd.RtnDate <= payload.d2.toISOString() && prd.WarehouseId === payload.WarehouseId))
    //   }
    //   for (let r in results) {
    //     var Items = (results[r].Rtnitems)
    //     for (let l in Items) {
    //       products.push({
    //         ProductId: Items[l].ProductId,
    //         PurchasePrice: Items[l].PurchasePrice,
    //         quantity: Items[l].quantity
    //       })
    //     }
    //   }
    //   commit('PushProductToReports', products)
    // },
    ClearingItemsInCart ({state, getters, commit, rootState, rootGetters}) {
      const CartItems = state.Cart
      if (CartItems.length > 0) {
        for (let key in CartItems) {
          var item = {
            WarehouseId: CartItems[key].WarehouseId,
            TRN: CartItems[key].TRN,
            PRN: CartItems[key].PRN,
            ProductId: CartItems[key].ProductId,
            quantity: CartItems[key].quantity,
            SlNos: CartItems[key].SlNos
          }
          commit('Warehouses/StoreInWarehousesStock', item, { root: true })
          commit('setRtnCartProducts', [])
        }
      } else {
        commit('setRtnCartProducts', [])
      }
    }
  },
  mutations: {
    PushProductToCart (state, payload) {
      state.Cart.push({
        WarehouseId: payload.WarehouseId,
        TRN: payload.TRN,
        PRN: payload.PRN,
        ProductId: payload.ProductId,
        PurchasePrice: payload.PurchasePrice,
        SlNos: [],
        quantity: 1
      })
      var getPrd = state.Cart.find(p => p.WarehouseId === payload.WarehouseId && p.TRN === payload.TRN && p.PRN === payload.PRN && p.ProductId === payload.ProductId)
      if (payload.SlNos && payload.SlNos.length > 0) {
        getPrd.SlNos.push(payload.SlNo)
      }
    },
    IncrementProductQty (state, payload) {
      var getPrd = state.Cart.find(p => p.WarehouseId === payload.WarehouseId && p.TRN === payload.TRN && p.PRN === payload.PRN && p.ProductId === payload.ProductId)
      if (payload.SlNo) {
        getPrd.SlNos.push(payload.SlNo)
      }
      getPrd.quantity++
    },
    setRtnInfo (state, payload) {
      state.RtnInfo = payload
    },
    success (state, payload) {
      alert('Success')
    },
    setRtnCartProducts (state, payload) {
      state.Cart = payload
    },
    setReturns (state, payload) {
      state.Returns = payload
    },
    PushReturns (state, payload) {
      state.Returns.push(payload)
    },
    UpdateReturns (state, payload) {
      var Return = state.Returns.find(Return => Return.id === payload.id)
      if (Return) {
        Return.WarehouseId = payload.WarehouseId
        Return.RtnDate = payload.RtnDate
        Return.RtnCartTotalqty = payload.RtnCartTotalqty
        Return.RtnCartTotal = payload.RtnCartTotal
        Return.Rtnitems = payload.Rtnitems
        Return.UpdatedDate = payload.UpdatedDate
        Return.UpdatorId = payload.UpdatorId
      }
    },
    RemoveReturn (state, payload) {
      var Return = state.Returns.find(Return => Return.id === payload)
      console.log(Return)
      if (Return !== undefined) {
        var index = state.Returns.indexOf(Return)
        state.Returns.splice(index, 1)
      }
    },
    decrementingProductFromCart (state, payload) {
      const CartItem = state.Cart.find(item => item.WarehouseId === payload.WarehouseId && item.TRN === payload.TRN && item.PRN === payload.PRN && item.ProductId === payload.ProductId)
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
      state.ReturnReports = Payload
    }
  }
}
