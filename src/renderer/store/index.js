import Vue from 'vue'
import Vuex from 'vuex'
import Company from './modules/Systems/Company'
import Menus from './modules/Systems/Menus'
import Users from './modules/Users/Users'
import Buyers from './modules/Buyers/Buyers'
import Suppliers from './modules/Suppliers/Suppliers'
import Items from './modules/Items/Items'
import Brands from './modules/Items/Brands'
import Products from './modules/Items/Products'
import PurOrds from './modules/PO/PurOrds'
import PurOrdRcvs from './modules/PORCV/PurOrdRcvs'
import Warehouses from './modules/Warehouses/Warehouses'
import Invoice from './modules/Sales/Invoice'
import Transfers from './modules/Warehouses/Transfers'
import Returns from './modules/Warehouses/Returns'

Vue.use(Vuex)

export default new Vuex.Store({
  strict: process.env.NODE_ENV !== 'production',
  modules: {
    Company: Company,
    Menus: Menus,
    Users: Users,
    Buyers: Buyers,
    Suppliers: Suppliers,
    Items: Items,
    Brands: Brands,
    Products: Products,
    PurOrds: PurOrds,
    PurOrdRcvs: PurOrdRcvs,
    Sales: Invoice,
    Warehouses: Warehouses,
    Transfers: Transfers,
    Returns: Returns
  }
})
