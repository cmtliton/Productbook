import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateProduct (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Products')
      .insert({
        id: 'P' + shortid.generate(),
        ProductName: payload.ProductName,
        ProductCode: payload.ProductCode,
        PurchasePrice: payload.PurchasePrice,
        MRP: payload.MRP,
        Warranty: payload.Warranty,
        MeasuringUnit: payload.MeasuringUnit,
        ItemId: payload.ItemId,
        BrandId: payload.BrandId,
        Status: payload.Status,
        CreatedDate: payload.CreatedDate,
        CreatorId: payload.CreatorId
      })
      .write()
  },
  changeProduct (CompanyId, ProductId, UpdateProduct) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Products')
      .find({id: ProductId})
      .assign({
        ProductName: UpdateProduct.ProductName,
        ProductCode: UpdateProduct.ProductCode,
        PurchasePrice: UpdateProduct.PurchasePrice,
        MRP: UpdateProduct.MRP,
        Warranty: UpdateProduct.Warranty,
        MeasuringUnit: UpdateProduct.MeasuringUnit,
        ItemId: UpdateProduct.ItemId,
        BrandId: UpdateProduct.BrandId,
        Status: UpdateProduct.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateProduct.UpdatorId
      })
      .write()
  },
  changeProductStatus (CompanyId, ProductId, UpdateProduct) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Products')
      .find({id: ProductId})
      .assign({
        Status: UpdateProduct.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  ProductRemove (CompanyId, ProductId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Products')
      .remove({id: ProductId})
      .write()
  },
  getProducts (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Products')
      .cloneDeep()
      .value()
  }
}
