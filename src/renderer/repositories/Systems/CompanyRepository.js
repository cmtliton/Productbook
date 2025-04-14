import db from '../../../persistence'

import lodashId from 'lodash-id'

// const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

db.defaults({
  Company: []
}).write()

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  saveNewCompany (CompanyInfo) {
    return db
      .get('Company')
      .insert({
        ComName: CompanyInfo.ComName,
        Addr: CompanyInfo.Addr,
        Tel: CompanyInfo.Tel,
        Mobile: CompanyInfo.Mobile,
        Email: CompanyInfo.Email,
        CreatedDate: new Date(),
        Items: [],
        Brands: [],
        Products: [],
        Stocks: [],
        DailyStocks: [],
        Warehouses: [],
        WarehouseStocks: [],
        Transfers: [],
        Returns: [],
        PurOrds: [],
        PurOrdRcvs: [],
        Sales: [],
        Buyers: [],
        BuyersPaymentHistory: [],
        Suppliers: [],
        SuppliersPaymentHistory: [],
        Users: [],
        Expenses: [],
        Loans: []
      })
      .write()
  },
  changeCompanyValue (CompanyId, CompanyInfo) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .assign({
        ComName: CompanyInfo.ComName,
        Addr: CompanyInfo.Addr,
        Tel: CompanyInfo.Tel,
        Mobile: CompanyInfo.Mobile,
        Email: CompanyInfo.Email,
        UpdatedDate: new Date()
      })
      .write()
  },
  saveCompanyArray (companyArray) {
    return db
      .set('company', companyArray)
      .write()
  },
  getCompany () {
    return db.get('Company')
      .first()
      .cloneDeep()
      .value()
  },
  getComName () {
    return db.get('Company')
      .map('id')
      .value()
  }
}
