import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateSupplier (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Suppliers')
      .insert({
        id: shortid.generate(),
        SupplierName: paylaod.SupplierName,
        PhoneNumber: paylaod.PhoneNumber,
        Address: paylaod.Address,
        Status: paylaod.Status,
        CreatedDate: paylaod.CreatedDate,
        CreatorId: paylaod.CreatorId
      })
      .write()
  },
  changeSupplier (CompanyId, SupplierId, UpdateSupplier) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Suppliers')
      .find({id: SupplierId})
      .assign({
        SupplierName: UpdateSupplier.SupplierName,
        PhoneNumber: UpdateSupplier.PhoneNumber,
        Address: UpdateSupplier.Address,
        Status: UpdateSupplier.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateSupplier.UpdatorId
      })
      .write()
  },
  changeSupplierStatus (CompanyId, SupplierId, UpdateSupplier) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Suppliers')
      .find({id: SupplierId})
      .assign({
        Status: UpdateSupplier.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  SupplierRemove (CompanyId, SupplierId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Suppliers')
      .remove({id: SupplierId})
      .write()
  },
  getSuppliers (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Suppliers')
      .cloneDeep()
      .value()
  }
}
