import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  initializedInvoice (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Sales')
      .insert({
        id: payload.INV + shortid.generate(),
        InvDate: payload.InvDate,
        Status: payload.Status,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  SavedSalesItem (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Sales')
      .find({id: payload.id})
      .assign({
        BuyerId: payload.BuyerId,
        InvCartTotalqty: payload.InvCartTotalqty,
        InvCartTotal: payload.InvCartTotal,
        DiscountedTk: payload.DiscountedTk,
        VatTk: payload.VatTk,
        Invitems: payload.Invitems,
        UpdatorId: payload.UpdatorId,
        UpdatedDate: payload.UpdatedDate
      })
      .write()
  },
  SavedPayment (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('BuyersPaymentHistory')
      .insert({
        id: shortid.generate(),
        BuyerId: payload.BuyerId,
        INV: payload.INV,
        CollectedTk: payload.CollectedTk,
        Date: payload.Date,
        CreatorId: payload.Username
      })
      .write()
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
  DeletedInvoice (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Sales')
      .remove({id: payload})
      .write()
  },
  DeletedPayment (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('BuyersPaymentHistory')
      .remove({INV: payload})
      .write()
  },
  getSales (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Sales')
      .cloneDeep()
      .value()
  },
  getPaymentHistory (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('BuyersPaymentHistory')
      .cloneDeep()
      .value()
  },
  getInvInfo (CompanyId, PRN) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrdRcvs')
      .getById(PRN)
      .cloneDeep()
      .value()
  },
  gottedInvoiceitems (CompanyId, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Sales')
      .getById(payload.id)
      .cloneDeep()
      .value()
  },
  DecrementFromStock (CompanyId, payload) {
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
  }
}
