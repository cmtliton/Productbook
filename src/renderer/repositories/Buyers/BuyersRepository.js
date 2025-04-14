import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateBuyer (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Buyers')
      .insert({
        id: shortid.generate(),
        BuyerName: paylaod.BuyerName,
        PhoneNumber: paylaod.PhoneNumber,
        Address: paylaod.Address,
        Status: paylaod.Status,
        CreatedDate: paylaod.CreatedDate,
        CreatorId: paylaod.CreatorId
      })
      .write()
  },
  changeBuyer (CompanyId, BuyerId, UpdateBuyer) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Buyers')
      .find({id: BuyerId})
      .assign({
        BuyerName: UpdateBuyer.BuyerName,
        PhoneNumber: UpdateBuyer.PhoneNumber,
        Address: UpdateBuyer.Address,
        Status: UpdateBuyer.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateBuyer.UpdatorId
      })
      .write()
  },
  changeBuyerStatus (CompanyId, BuyerId, UpdateBuyer) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Buyers')
      .find({id: BuyerId})
      .assign({
        Status: UpdateBuyer.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  BuyerRemove (CompanyId, BuyerId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Buyers')
      .remove({id: BuyerId})
      .write()
  },
  getBuyers (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Buyers')
      .cloneDeep()
      .value()
  }
}
