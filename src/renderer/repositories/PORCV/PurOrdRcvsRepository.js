import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  initializePOR (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrdRcvs')
      .insert({
        id: payload.PRN + shortid.generate(),
        PORDate: payload.PORDate,
        Status: payload.Status,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  CreatePurOrdRcv (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrdRcvs')
      .find({id: payload.PRN})
      .assign({
        PON: payload.PON,
        PORCartTotalqty: payload.PORCartTotalqty,
        PORCartTotal: payload.PORCartTotal,
        PORitems: payload.PORitems,
        UpdatorId: payload.UpdatorId,
        UpdatedDate: payload.UpdatedDate
      })
      .write()
  },
  SavedPaymentForSupplier (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('SuppliersPaymentHistory')
      .insert({
        id: shortid.generate(),
        SupplierId: payload.SupplierId,
        PRN: payload.PRN,
        PaidAmt: payload.PaidAmt,
        Date: payload.Date,
        CreatorId: payload.Username
      })
      .write()
  },
  StoreInStock (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Stocks')
      .insert({
        id: shortid.generate(),
        PRN: payload.PRN,
        ProductId: payload.ProductId,
        quantity: payload.quantity,
        SlNos: payload.SlNos
      })
      .write()
  },
  UpdateInStock (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Stocks')
      .find({PRN: payload.PRN, ProductId: payload.ProductId})
      .assign({
        quantity: payload.quantity,
        SlNos: payload.SlNos
      })
      .write()
  },
  DecreseFromStocks (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Stocks')
      .remove({PRN: payload.PRN, ProductId: payload.ProductId})
      .write()
  },
  CheckInStocks (CompanyId, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Stocks')
      .find({PRN: payload.PRN, ProductId: payload.ProductId})
      .cloneDeep()
      .value()
  },
  DeleteFromStocks (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Stocks')
      .remove({PRN: payload})
      .write()
  },
  LoadStocks (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Stocks')
      .cloneDeep()
      .value()
  },
  changePOsStatus (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .find({id: payload.PON})
      .assign({
        Status: payload.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  PurOrdRcvRemove (CompanyId, PurOrdRcvId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrdRcvs')
      .remove({id: PurOrdRcvId})
      .write()
  },
  getPurOrdRcvs (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrdRcvs')
      .cloneDeep()
      .value()
  },
  getPaymentHistoryForSupplier (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('SuppliersPaymentHistory')
      .cloneDeep()
      .value()
  },
  getPORInfo (CompanyId, PRN) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrdRcvs')
      .getById(PRN)
      .cloneDeep()
      .value()
  },
  getPO (CompanyId, PON) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrds')
      .getById(PON)
      .cloneDeep()
      .value()
  }
}
