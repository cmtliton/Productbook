import store from '@/store'

export default {
  guardAuth (to, from, next) {
    if (store.getters['Users/getUser']) {
      next()
    } else {
      next('/signin')
    }
  }
}
