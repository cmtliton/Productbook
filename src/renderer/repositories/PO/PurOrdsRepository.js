import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  initializePO (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .insert({
        id: payload.PON + shortid.generate(),
        PODate: payload.PODate,
        Status: payload.Status,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  CreatePurOrd (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .find({id: payload.PON})
      .assign({
        SupplierId: payload.SupplierId,
        POCartTotalqty: payload.POCartTotalqty,
        POCartTotal: payload.POCartTotal,
        POitems: payload.POitems,
        UpdatorId: payload.UpdatorId,
        UpdatedDate: payload.UpdatedDate,
        Status: payload.Status
      })
      .write()
  },
  changePurOrd (CompanyId, PurOrdId, UpdatePurOrd) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .find({id: PurOrdId})
      .assign({
        PurOrdName: UpdatePurOrd.PurOrdName,
        PurOrdCode: UpdatePurOrd.PurOrdCode,
        PurchasePrice: UpdatePurOrd.PurchasePrice,
        MRP: UpdatePurOrd.MRP,
        Warranty: UpdatePurOrd.Warranty,
        MeasuringUnit: UpdatePurOrd.MeasuringUnit,
        ItemId: UpdatePurOrd.ItemId,
        BrandId: UpdatePurOrd.BrandId,
        Status: UpdatePurOrd.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdatePurOrd.UpdatorId
      })
      .write()
  },
  changePurOrdStatus (CompanyId, PurOrdId, UpdatePurOrd) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .find({id: PurOrdId})
      .assign({
        Status: UpdatePurOrd.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  PurOrdRemove (CompanyId, PurOrdId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('PurOrds')
      .remove({id: PurOrdId})
      .write()
  },
  getPurOrds (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrds')
      .cloneDeep()
      .value()
  },
  getPOInfo (CompanyId, PON, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('PurOrds')
      .getById(PON)
      .cloneDeep()
      .value()
  }
}
