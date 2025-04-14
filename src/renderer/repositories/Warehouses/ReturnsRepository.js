import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  initializedReturn (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Returns')
      .insert({
        id: payload.RTN + shortid.generate(),
        RtnDate: payload.RtnDate,
        Status: payload.Status,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  SavedReturnsItem (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Returns')
      .find({id: payload.id})
      .assign({
        WarehouseId: payload.WarehouseId,
        RtnCartTotalqty: payload.RtnCartTotalqty,
        RtnCartTotal: payload.RtnCartTotal,
        Rtnitems: payload.Rtnitems,
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
  DeletedReturn (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Returns')
      .remove({id: payload})
      .write()
  },
  getReturns (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Returns')
      .cloneDeep()
      .value()
  },
  getRtnInfo (CompanyId, RTN) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Returns')
      .getById(RTN)
      .cloneDeep()
      .value()
  },
  gottedReturnitems (CompanyId, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Returns')
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
