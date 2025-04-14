import ProductsRepository from './../../../repositories/Items/ProductsRepository'
import _ from 'lodash'
export default {
  namespaced: true,
  state: {
    Products: []
  },
  getters: {
    getProducts (state) {
      return state.Products
    },
    getProductsWithItemAndBrand (state, getters, rootState, rootGetters) {
      return state.Products.map(product => {
        const item = rootGetters['Items/getItems'].find(item => item.id === product.ItemId)
        const brand = rootGetters['Brands/getBrands'].find(brand => brand.id === product.BrandId)
        return {
          ProductId: product.id,
          ItemId: item.id,
          BrandId: brand.id,
          title: item.ItemName + ' ' + brand.BrandName + ' ' + product.ProductName,
          ProductCode: product.ProductCode,
          PurchasePrice: product.PurchasePrice,
          MRP: product.MRP,
          Warranty: product.Warranty,
          MeasuringUnit: product.MeasuringUnit,
          Status: product.Status
        }
      })
    },
    getProductsWithStocks (state, getters, rootState, rootGetters) {
      return rootGetters['PurOrdRcvs/getStocks'].map(stock => {
        const product = rootGetters['Products/getProductsWithItemAndBrand'].find(product => product.ProductId === stock.ProductId)
        return {
          ProductId: product.ProductId,
          ItemId: product.ItemId,
          BrandId: product.BrandId,
          title: product.title,
          ProductCode: product.ProductCode,
          PurchasePrice: product.PurchasePrice,
          MRP: product.MRP,
          Warranty: product.Warranty,
          MeasuringUnit: product.MeasuringUnit,
          quantity: stock.quantity,
          SlNos: stock.SlNos,
          Status: product.Status
        }
      })
    },
    getProductsWithStocksAndPurchasePrice (state, getters, rootState, rootGetters) {
      return rootGetters['PurOrdRcvs/getStocksWithPurchasePrice'].map(stock => {
        const product = getters.getProductsWithItemAndBrand.find(product => product.ProductId === stock.ProductId)
        return {
          ProductId: product.ProductId,
          ItemId: product.ItemId,
          BrandId: product.BrandId,
          title: product.title,
          ProductCode: product.ProductCode,
          PurchasePrice: stock.PurchasePrice,
          MRP: product.MRP,
          Warranty: product.Warranty,
          MeasuringUnit: product.MeasuringUnit,
          quantity: stock.quantity,
          SlNos: stock.SlNos,
          Status: product.Status
        }
      })
    },
    StockPurchasePriceTotal (state, getters) {
      return _.sumBy(getters.getProductsWithStocksAndPurchasePrice, product => { return product.quantity * product.PurchasePrice })
    },
    StockMRPTotal (state, getters) {
      return _.sumBy(getters.getProductsWithStocksAndPurchasePrice, product => { return product.quantity * product.MRP })
    },
    StockTotalqty (state, getters) {
      return _.sumBy(getters.getProductsWithStocksAndPurchasePrice, product => { return product.quantity })
    },
    getProductById (state) {
      return (ProductId) => {
        return state.Products.find((Product) => {
          return Product.id === ProductId
        })
      }
    },
    getDuplicateProduct (state) {
      return (ProductName) => {
        return state.Products.find((Product) => {
          return Product.ProductName === ProductName
        })
      }
    },
    Productsqty (state) {
      return _.size(state.Products)
    }
  },
  actions: {
    loadProducts ({ state, getters, commit, rootState, rootGetters }) {
      const cmpId = rootGetters['Company/getCompany'].id
      const Products = ProductsRepository.getProducts(cmpId)
      commit('setProducts', Products)
    },
    onSavingProduct ({ state, getters, commit, rootState, rootGetters }, payload) {
      const CreateProduct = {
        ProductName: payload.ProductName,
        ProductCode: payload.ProductCode,
        PurchasePrice: payload.PurchasePrice,
        MRP: payload.MRP,
        Warranty: payload.Warranty,
        MeasuringUnit: payload.MeasuringUnit,
        ItemId: payload.ItemId,
        BrandId: payload.BrandId,
        Status: payload.Status,
        CreatedDate: new Date(),
        CreatorId: rootGetters['Users/getUser'].id
      }
      const Product = ProductsRepository.CreateProduct(rootGetters['Company/getCompany'].id, CreateProduct)
      commit('setProduct', Product)
    },
    onSavingChangeProduct ({ state, getters, commit, rootState, rootGetters }, payload) {
      const cmpId = rootGetters['Company/getCompany'].id
      const UpdateProduct = {}
      if (payload.ProductName) {
        UpdateProduct.ProductName = payload.ProductName
      }
      if (payload.ProductCode) {
        UpdateProduct.ProductCode = payload.ProductCode
      }
      if (payload.PurchasePrice) {
        UpdateProduct.PurchasePrice = payload.PurchasePrice
      }
      if (payload.MRP) {
        UpdateProduct.MRP = payload.MRP
      }
      if (payload.Warranty) {
        UpdateProduct.Warranty = payload.Warranty
      }
      if (payload.MeasuringUnit) {
        UpdateProduct.MeasuringUnit = payload.MeasuringUnit
      }
      if (payload.ItemId) {
        UpdateProduct.ItemId = payload.ItemId
      }
      if (payload.BrandId) {
        UpdateProduct.BrandId = payload.BrandId
      }
      UpdateProduct.Status = true
      UpdateProduct.UpdatorId = rootGetters['Users/getUser'].id
      ProductsRepository.changeProduct(cmpId, payload.id, UpdateProduct)
      commit('setChangeProduct', payload)
    },
    ProductStatusChanges ({ state, getters, commit, rootState, rootGetters }, payload) {
      const Productinfo = {
        cmpId: rootGetters['Company/getCompany'].id,
        ProductId: payload.id,
        Status: payload.Status
      }
      confirm('Are you sure you want to change this Product status?') && commit('ProductStatusChanges', Productinfo)
    },
    ProductRemove ({ state, getters, commit, rootState, rootGetters }, payload) {
      confirm('Are you sure you want to delete this Product?') && ProductsRepository.ProductRemove(rootGetters['Company/getCompany'].id, payload.id) &&
      commit('setProductRemove', payload)
    }
  },
  mutations: {
    setProduct (state, payload) {
      state.Products.push(payload)
    },
    setChangeProduct (state, payload) {
      const changeProduct = state.Products.find(Product => {
        return Product.id === payload.id
      })
      if (payload.ProductName) {
        changeProduct.ProductName = payload.ProductName
      }
      if (payload.ProductCode) {
        changeProduct.ProductCode = payload.ProductCode
      }
      if (payload.PurchasePrice) {
        changeProduct.PurchasePrice = payload.PurchasePrice
      }
      if (payload.MRP) {
        changeProduct.MRP = payload.MRP
      }
      if (payload.Warranty) {
        changeProduct.Warranty = payload.Warranty
      }
      if (payload.MeasuringUnit) {
        changeProduct.MeasuringUnit = payload.MeasuringUnit
      }
      if (payload.ItemId) {
        changeProduct.ItemId = payload.ItemId
      }
      if (payload.BrandId) {
        changeProduct.BrandId = payload.BrandId
      }
    },
    setProducts (state, payload) {
      state.Products = payload
    },
    ProductStatusChanges (state, payload) {
      const Product = state.Products.find(Product => {
        return Product.id === payload.ProductId
      })
      Product.Status = !payload.Status
      ProductsRepository.changeProductStatus(payload.cmpId, payload.ProductId, Product)
    },
    setProductRemove (state, payload) {
      const index = state.Products.indexOf(payload)
      state.Products.splice(index, 1)
    }
  }
}
