import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateBrand (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Brands')
      .insert({
        id: 'B' + shortid.generate(),
        BrandName: paylaod.BrandName,
        Status: paylaod.Status,
        CreatedDate: paylaod.CreatedDate,
        CreatorId: paylaod.CreatorId
      })
      .write()
  },
  changeBrand (CompanyId, BrandId, UpdateBrand) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Brands')
      .find({id: BrandId})
      .assign({
        BrandName: UpdateBrand.BrandName,
        Status: UpdateBrand.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateBrand.UpdatorId
      })
      .write()
  },
  changeBrandStatus (CompanyId, BrandId, UpdateBrand) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Brands')
      .find({id: BrandId})
      .assign({
        Status: UpdateBrand.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  BrandRemove (CompanyId, BrandId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Brands')
      .remove({id: BrandId})
      .write()
  },
  getBrands (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Brands')
      .cloneDeep()
      .value()
  }
}
