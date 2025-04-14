import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateItem (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Items')
      .insert({
        id: 'I' + shortid.generate(),
        ItemName: paylaod.ItemName,
        Status: paylaod.Status,
        CreatedDate: paylaod.CreatedDate,
        CreatorId: paylaod.CreatorId
      })
      .write()
  },
  changeItem (CompanyId, ItemId, UpdateItem) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Items')
      .find({id: ItemId})
      .assign({
        ItemName: UpdateItem.ItemName,
        Status: UpdateItem.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateItem.UpdatorId
      })
      .write()
  },
  changeItemStatus (CompanyId, ItemId, UpdateItem) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Items')
      .find({id: ItemId})
      .assign({
        Status: UpdateItem.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  ItemRemove (CompanyId, ItemId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Items')
      .remove({id: ItemId})
      .write()
  },
  getItems (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Items')
      .cloneDeep()
      .value()
  }
}
