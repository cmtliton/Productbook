import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateWarehouse (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Warehouses')
      .insert({
        id: 'W' + shortid.generate(),
        WarehouseName: paylaod.WarehouseName,
        KeyPerson: paylaod.KeyPerson,
        PhoneNumber: paylaod.PhoneNumber,
        Address: paylaod.Address,
        Status: paylaod.Status,
        CreatedDate: paylaod.CreatedDate,
        CreatorId: paylaod.CreatorId
      })
      .write()
  },
  changeWarehouse (CompanyId, WarehouseId, UpdateWarehouse) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Warehouses')
      .find({id: WarehouseId})
      .assign({
        WarehouseName: UpdateWarehouse.WarehouseName,
        KeyPerson: UpdateWarehouse.KeyPerson,
        PhoneNumber: UpdateWarehouse.PhoneNumber,
        Address: UpdateWarehouse.Address,
        Status: UpdateWarehouse.Status,
        UpdatedDate: new Date(),
        UpdatorId: UpdateWarehouse.UpdatorId
      })
      .write()
  },
  changeWarehouseStatus (CompanyId, WarehouseId, UpdateWarehouse) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Warehouses')
      .find({id: WarehouseId})
      .assign({
        Status: UpdateWarehouse.Status,
        UpdatedDate: new Date()
      })
      .write()
  },
  WarehouseRemove (CompanyId, WarehouseId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Warehouses')
      .remove({id: WarehouseId})
      .write()
  },
  getWarehouses (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Warehouses')
      .cloneDeep()
      .value()
  },
  StockLoadFrmWarehouses (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('WarehouseStocks')
      .cloneDeep()
      .value()
  },
  StockCheckInWarehouses (CompanyId, payload) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('WarehouseStocks')
      .find({WarehouseId: payload.WarehouseId, TRN: payload.TRN, PRN: payload.PRN, ProductId: payload.ProductId})
      .cloneDeep()
      .value()
  },
  StockStoreInWarehouses (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('WarehouseStocks')
      .insert({
        id: shortid.generate(),
        TRN: payload.TRN,
        WarehouseId: payload.WarehouseId,
        PRN: payload.PRN,
        ProductId: payload.ProductId,
        quantity: payload.quantity,
        SlNos: payload.SlNos
      })
      .write()
  },
  StockUpdateInWarehouses (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('WarehouseStocks')
      .find({WarehouseId: payload.WarehouseId, TRN: payload.TRN, PRN: payload.PRN, ProductId: payload.ProductId})
      .assign({
        quantity: payload.quantity,
        SlNos: payload.SlNos
      })
      .write()
  },
  StockRemoveFromWarehouses (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('WarehouseStocks')
      .remove({TRN: payload.TRN, WarehouseId: payload.WarehouseId, PRN: payload.PRN, ProductId: payload.ProductId})
      .write()
  },
  StockDeleteFromWarehouses (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('WarehouseStocks')
      .remove({TRN: payload})
      .write()
  }
}
