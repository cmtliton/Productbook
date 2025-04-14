import db from '../../../persistence'

import lodashId from 'lodash-id'

const shortid = require('shortid')
// const storage = require('electron').remote.require('electron-settings')

db._.mixin(lodashId)

export default {
  get () {
    console.log(`${JSON.stringify(db.getState())}`)
  },
  CreateUser (CompanyId, paylaod) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Users')
      .insert({
        id: shortid.generate(),
        fullname: paylaod.fullname,
        email: paylaod.email,
        username: paylaod.username,
        status: paylaod.status,
        password: paylaod.password,
        role: paylaod.role,
        CreatedDate: paylaod.CreatedDate
      })
      .write()
  },
  changeUser (CompanyId, UserId, UpdateUser) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Users')
      .find({id: UserId})
      .assign({
        fullname: UpdateUser.fullname,
        email: UpdateUser.email,
        status: UpdateUser.status,
        password: UpdateUser.password,
        role: UpdateUser.role,
        UpdatedDate: new Date(),
        UpdatorId: UpdateUser.UpdatorId
      })
      .write()
  },
  changeUserStatus (CompanyId, UserId, UpdateUser) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Users')
      .find({id: UserId})
      .assign({
        status: UpdateUser.status,
        UpdatedDate: new Date()
      })
      .write()
  },
  checkUser (CompanyId, payload) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Users')
      .find({username: payload.username, password: payload.password, status: true})
      .value()
  },
  UserRemove (CompanyId, UserId) {
    return db
      .get('Company')
      .find({id: CompanyId})
      .get('Users')
      .remove({id: UserId})
      .write()
  },
  getUsers (CompanyId) {
    return db
      .get('Company')
      .getById(CompanyId)
      .get('Users')
      .cloneDeep()
      .value()
  }
}
