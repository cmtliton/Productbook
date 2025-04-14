import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  initializedTransfer (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Transfers')
      .insert({
        id: payload.TRN + shortid.generate(),
        TrnDate: payload.TrnDate,
        Status: payload.Status,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  SavedTransfersItem (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Transfers')
      .find({id: payload.id})
      .assign({
        WarehouseId: payload.WarehouseId,
        TrnCartTotalqty: payload.TrnCartTotalqty,
        TrnCartTotal: payload.TrnCartTotal,
        Trnitems: payload.Trnitems,
        UpdatorId: payload.UpdatorId,
        UpdatedDate: payload.UpdatedDate
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
  DeletedTransfer (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Transfers')
      .remove({id: payload})
      .write()
  },
  getTransfers (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Transfers')
      .cloneDeep()
      .value()
  },
  getTrnInfo (CompanyId, PRN) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrdRcvs')
      .getById(PRN)
      .cloneDeep()
      .value()
  },
  gottedTransferitems (CompanyId, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Transfers')
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
