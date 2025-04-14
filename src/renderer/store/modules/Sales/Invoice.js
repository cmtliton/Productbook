import Invoice from './../../../repositories/Sales/InvoiceRepository'
import PORcvsRepository from './../../../repositories/PORCV/PurOrdRcvsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Sales: [],
    BuyersPaymentHistory: [],
    InvInfo: null,
    Cart: [],
    SaleReports: []
  },
  getters: {
    getSales (state) {
      return _.sortBy(state.Sales, Sale => {
        return Sale.InvDate
      })
    },
    getInvInfo (state) {
      return state.InvInfo
    },
    getAllProductsFromCart (state, getters, rootState, rootGetters) {
      return state.Cart.map(cartitem => {
        const stockproduct = rootGetters['Products/getProductsWithStocks'].find(stockproduct => stockproduct.ProductId === cartitem.ProductId)
        return {
          ProductId: stockproduct.ProductId,
          title: stockproduct.title,
          MRP: cartitem.MRP,
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
    InvCartTotal (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return (product.MRP * product.quantity) })
    },
    InvCartTotalqty (state, getters) {
      return _.sumBy(getters.getAllProductsFromCart, product => { return product.quantity })
    },
    SalesTotalqty (state, getters) {
      return _.sumBy(state.Sales, sale => sale.InvCartTotalqty)
    },
    SalesTotalAmt (state, getters) {
      return _.sumBy(state.Sales, sale => sale.InvCartTotal)
    },
    getBuyerPaymentHistory (state) {
      return _.sortBy(state.BuyersPaymentHistory, pmt => {
        return pmt.Date
      })
    },
    getConsolidatedPayment (state, getters) {
      return _(state.BuyersPaymentHistory)
        .groupBy('INV')
        .map((g, INV) => {
          return {
            INV: INV,
            CollectedTk: _.sumBy(g, 'CollectedTk')
          }
        })
        .values()
        .value()
    },
    getSalesWithPayment (state, getters) {
      return getters.getConsolidatedPayment.map(INV => {
        var sales = getters.getSales.find(Invoice => Invoice.id === INV.INV)
        return {
          ...sales,
          CollectedTk: INV.CollectedTk
        }
      })
    },
    getConsolidatedPaymentByBuyer (state, getters) {
      return _(state.BuyersPaymentHistory)
        .groupBy('BuyerId')
        .map((g, BuyerId) => {
          return {
            BuyerId: BuyerId,
            CollectedTk: _.sumBy(g, 'CollectedTk')
          }
        })
        .values()
        .value()
    },
    getConsolidatedSalesInvAmt (state, getters) {
      return _(getters.getSales)
        .groupBy('BuyerId')
        .map((g, BuyerId) => {
          return {
            BuyerId: BuyerId,
            InvCartTotal: _.sumBy(g, 'InvCartTotal')
          }
        })
        .values()
        .value()
    },
    getSalesWithPaymentByBuyer (state, getters) {
      return getters.getConsolidatedPaymentByBuyer.map(Buyer => {
        var sales = getters.getConsolidatedSalesInvAmt.find(Invoice => Invoice.BuyerId === Buyer.BuyerId)
        return {
          Buyer: Buyer.BuyerId,
          InvTotal: sales.InvCartTotal,
          CollectedTk: Buyer.CollectedTk
        }
      })
    },
    getSalesProductForReporting (state, getters) {
      return _(state.SaleReports)
        .groupBy('ProductId')
        .map((g, ProductId) => {
          const quantity = _.sumBy(g, 'quantity')
          return {
            ProductId: ProductId,
            quantity,
            MRP: quantity * _.get(g, '[0].MRP')
          }
        })
        .values()
        .value()
    }
  },
  actions: {
    loadSales ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Sales = Invoice.getSales(cmpId)
      commit('setSales', Sales)
    },
    loadBuyersPaymentHistory ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const BuyersPaymentHistory = Invoice.getPaymentHistory(cmpId)
      commit('setBuyersPaymentHistory', BuyersPaymentHistory)
    },
    loadInvoice ({commit, getters}, payload) {
      var InvoiceInfo = getters.getSales.find(Inv => Inv.id === payload.id)
      var Invitems = InvoiceInfo.Invitems
      commit('setInvInfo', InvoiceInfo)
      commit('setInvCartProducts', Invitems)
    },
    initializingInvoice ({ state, getters, commit, rootState, rootGetters }) {
      var date = new Date()
      var Year = date.getFullYear().toString().slice(2)
      var month = date.getMonth() + 1
      const InvRealize = {}
      InvRealize.InvDate = date
      InvRealize.INV = 'INV' + Year + month.toString()
      InvRealize.Status = true
      InvRealize.CreatorId = rootGetters['Users/getUser'].username
      const ReturnInvRealize = Invoice.initializedInvoice(rootGetters['Company/getCompany'].id, InvRealize)
      commit('setInvInfo', ReturnInvRealize)
      commit('PushSales', ReturnInvRealize)
    },
    SavingSalesItem ({state, getters, commit, rootState, rootGetters}, payload) {
      var CartItems = state.Cart
      var CmpId = rootGetters['Company/getCompany'].id
      const InvInfo = {
        id: payload.id,
        BuyerId: payload.BuyerId,
        InvDate: payload.InvDate.toISOString(),
        InvCartTotalqty: payload.InvCartTotalqty,
        InvCartTotal: payload.InvCartTotal,
        DiscountedTk: payload.DiscountedTk,
        VatTk: payload.VatTk,
        Invitems: CartItems,
        UpdatedDate: new Date(),
        UpdatorId: rootGetters['Users/getUser'].username
      }
      const PaymentInfo = {
        BuyerId: payload.BuyerId,
        INV: payload.id,
        Date: payload.InvDate,
        CollectedTk: payload.CollectedTk,
        Username: rootGetters['Users/getUser'].username
      }
      const ReturnSaleInfo = Invoice.SavedSalesItem(CmpId, InvInfo)
      Invoice.SavedPayment(CmpId, PaymentInfo)
      for (let key in ReturnSaleInfo.Invitems) {
        var SoldProduct = {
          PRN: ReturnSaleInfo.Invitems[key].PRN,
          ProductId: ReturnSaleInfo.Invitems[key].ProductId,
          quantity: ReturnSaleInfo.Invitems[key].quantity,
          SlNos: ReturnSaleInfo.Invitems[key].SlNos
        }
        const InStock = PORcvsRepository.CheckInStocks(CmpId, SoldProduct)
        if (InStock.quantity >= SoldProduct.quantity || InStock.SlNos.length >= SoldProduct.SlNos.length) {
          var StockSlNos = {}
          if (InStock.SlNos.length === InStock.quantity) {
            StockSlNos.SlNos = _.xor(InStock.SlNos, SoldProduct.SlNos)
          } else {
            StockSlNos.SlNos = InStock.SlNos
          }
          var Stocking = {
            PRN: InStock.PRN,
            ProductId: InStock.ProductId,
            quantity: InStock.quantity - SoldProduct.quantity,
            SlNos: StockSlNos.SlNos // if found stock getting without search item
          }
          if (Stocking.quantity === 0) {
            PORcvsRepository.DecreseFromStocks(CmpId, Stocking)
          } else {
            PORcvsRepository.UpdateInStock(CmpId, Stocking)
          }
        }
      }
      commit('UpdateSales', InvInfo)
      commit('PushPaymentInfo', PaymentInfo)
      commit('setInvInfo', null)
      commit('setInvCartProducts', [])
    },
    setInvInfo ({commit}, payload) {
      commit('setInvInfo', payload)
    },
    setInvCartProducts ({commit}, payload) {
      commit('setInvCartProducts', payload)
    },
    addingProductToCart ({state, getters, commit, rootState, rootGetters}, payload) {
      var Stock = rootGetters['PurOrdRcvs/getAllStocksWithPurchasePrice'].find(stock => stock.quantity > 0 && stock.ProductId === payload.ProductId && stock.PurchasePrice === payload.PurchasePrice)
      if (Stock !== undefined) {
        var StockWithMRP = rootGetters['Products/getProductsWithItemAndBrand'].find(prd => prd.ProductId === Stock.ProductId)
        var product = {
          PRN: Stock.PRN,
          ProductId: Stock.ProductId,
          quantity: Stock.quantity,
          MRP: StockWithMRP.MRP
        }
        if (product.quantity > 0) {
          var CartItem = state.Cart.find(CartItem => CartItem.ProductId === product.ProductId && CartItem.PRN === product.PRN)
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
      if (filterKey.length >= 8) {
        var filterdata = rootState.PurOrdRcvs.Stocks.filter(function (row) {
          return Object.keys(row).some(function (key) {
            return String(row[key]).toLowerCase().indexOf(filterKey) > -1
          })
        })
      }
      if (filterdata) {
        var ProductWithMRP = filterdata.map(filter => {
          var pro = rootGetters['Products/getProducts'].find(product => product.id === filter.ProductId)
          return {
            PRN: filter.PRN,
            ProductId: pro.id,
            MRP: pro.MRP,
            quantity: filter.quantity,
            SlNos: filter.SlNos
          }
        })
        const Product = {}
        for (let key in ProductWithMRP) {
          Product.PRN = ProductWithMRP[key].PRN
          Product.ProductId = ProductWithMRP[key].ProductId
          Product.MRP = ProductWithMRP[key].MRP
          Product.quantity = ProductWithMRP[key].quantity
          Product.SlNos = ProductWithMRP[key].SlNos
          Product.SlNo = payload
          if (Product.quantity > 0) {
            var CartItem = state.Cart.find(CartItem => CartItem.ProductId === Product.ProductId && CartItem.PRN === Product.PRN)
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
    DeletingInvoice ({state, getters, commit, rootState, rootGetters}, payload) {
      const CmpId = rootGetters['Company/getCompany'].id
      const Inv = Invoice.gottedInvoiceitems(CmpId, payload)
      if (Inv.InvCartTotal !== undefined) {
        var isDeleting = confirm('Confirm Deleting...?')
        if (isDeleting) {
          for (let key in Inv.Invitems) {
            var Invitem = {
              PRN: Inv.Invitems[key].PRN,
              ProductId: Inv.Invitems[key].ProductId,
              quantity: Inv.Invitems[key].quantity,
              SlNos: Inv.Invitems[key].SlNos
            }
            var foundStock = PORcvsRepository.CheckInStocks(CmpId, Invitem)
            if (foundStock) {
              var Stocking = {
                PRN: Invitem.PRN,
                ProductId: Invitem.ProductId,
                quantity: foundStock.quantity + Invitem.quantity,
                SlNos: _.concat(foundStock.SlNos, Invitem.SlNos)
              }
              PORcvsRepository.UpdateInStock(CmpId, Stocking)
              commit('PurOrdRcvs/PushInStocks', Stocking, {root: true})
            } else {
              PORcvsRepository.StoreInStock(CmpId, Invitem)
              commit('PurOrdRcvs/PushInStocks', Invitem, {root: true})
            }
          }
          Invoice.DeletedInvoice(CmpId, Inv.id)
          Invoice.DeletedPayment(CmpId, Inv.id)
          commit('RemoveInvoice', Inv.id)
          commit('RemovePayment', Inv.id)
        }
      } else {
        confirm('Deleting...Liton?') &&
        Invoice.DeletedInvoice(CmpId, Inv.id) &&
        commit('RemoveInvoice', Inv.id)
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
          commit('setInvCartProducts', [])
        }
        commit('setInvInfo', null)
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
          PRN: FilteringProductFromCart[key].PRN,
          ProductId: FilteringProductFromCart[key].ProductId,
          quantity: 1,
          SlNos: SlNos,
          SlNo: filterkey
        }
        console.log(product)
        commit('PurOrdRcvs/PushInStocksFromCart', product, {root: true})
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
      commit('PurOrdRcvs/PushInStocksFromCart', product, {root: true})
      commit('decrementingProductFromCart', product)
    },
    onSavingPayment ({state, getters, commit, rootState, rootGetters}, payload) {
      var PaymentInfo = {
        ...payload,
        Date: new Date(),
        Username: rootGetters['Users/getUser'].username
      }
      Invoice.SavedPayment(rootGetters['Company/getCompany'].id, PaymentInfo)
      commit('PushPaymentInfo', PaymentInfo)
    },
    findSalesProduct ({state, getters, commit, rootState, rootGetters}, payload) {
      var products = []
      var results = []
      if (payload.BuyerId === null || payload.BuyerId === undefined) {
        results = (_.filter(getters.getSalesWithPayment, prd => prd.InvDate >= payload.d1.toISOString() && prd.InvDate <= payload.d2.toISOString()))
      } else {
        results = (_.filter(getters.getSalesWithPayment, prd => prd.InvDate >= payload.d1.toISOString() && prd.InvDate <= payload.d2.toISOString() && prd.BuyerId === payload.BuyerId))
      }
      for (let r in results) {
        var Items = (results[r].Invitems)
        for (let l in Items) {
          products.push({
            ProductId: Items[l].ProductId,
            MRP: Items[l].MRP,
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
        MRP: payload.MRP,
        SlNos: [],
        quantity: 1
      })
      var getPrd = state.Cart.find(p => p.ProductId === payload.ProductId && p.PRN === payload.PRN)
      if (payload.SlNos && payload.SlNos.length > 0) {
        getPrd.SlNos.push(payload.SlNo)
      }
    },
    IncrementProductQty (state, CartItem) {
      var getPrd = state.Cart.find(p => p.ProductId === CartItem.ProductId && p.PRN === CartItem.PRN)
      if (CartItem.SlNo) {
        getPrd.SlNos.push(CartItem.SlNo)
      }
      getPrd.quantity++
    },
    setInvInfo (state, payload) {
      state.InvInfo = payload
    },
    success (state, payload) {
      alert('Success')
    },
    setInvCartProducts (state, payload) {
      state.Cart = payload
    },
    setSales (state, payload) {
      state.Sales = payload
    },
    setBuyersPaymentHistory (state, payload) {
      state.BuyersPaymentHistory = payload
    },
    PushSales (state, payload) {
      state.Sales.push(payload)
    },
    UpdateSales (state, payload) {
      var Sale = state.Sales.find(sale => sale.id === payload.id)
      if (Sale) {
        Sale.BuyerId = payload.BuyerId
        Sale.InvDate = payload.InvDate
        Sale.InvCartTotalqty = payload.InvCartTotalqty
        Sale.InvCartTotal = payload.InvCartTotal
        Sale.DiscountedTk = payload.DiscountedTk
        Sale.VatTk = payload.VatTk
        Sale.Invitems = payload.Invitems
        Sale.UpdatedDate = payload.UpdatedDate
        Sale.UpdatorId = payload.UpdatorId
      }
    },
    RemoveInvoice (state, payload) {
      var Sale = state.Sales.find(sale => sale.id === payload)
      var index = state.Sales.indexOf(Sale)
      state.Sales.splice(index, 1)
    },
    PushPaymentInfo (state, payload) {
      state.BuyersPaymentHistory.push(payload)
    },
    RemovePayment (state, payload) {
      var payment = state.BuyersPaymentHistory.find(pmt => pmt.INV === payload)
      var index = state.BuyersPaymentHistory.indexOf(payment)
      state.BuyersPaymentHistory.splice(index, 1)
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
      state.SaleReports = Payload
    }
  }
}
