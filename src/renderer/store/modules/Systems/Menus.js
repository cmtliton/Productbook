export default {
  state: {
    menuItems: [
      {
        menuIcon: 'mdi-xbox-controller',
        menuTitle: 'Purchase Order',
        menuType: 'main',
        link: '/purords',
        status: true,
        subMenuItems: []
      },
      {
        menuIcon: 'shop_two',
        menuTitle: 'Order Receive',
        menuType: 'main',
        link: '/purordrcvs',
        status: true,
        subMenuItems: [
          {subMenuIcon: 'shopping_basket', subMenuTitle: 'Reporting', subMenuType: 'report', subMenuLink: '/receivesreporting', status: true}
        ]
      },
      {
        menuIcon: 'shopping_basket',
        menuTitle: 'Sales',
        menuType: 'main',
        link: '/sales',
        status: true,
        subMenuItems: [
          {subMenuIcon: 'shopping_basket', subMenuTitle: 'Reporting', subMenuType: 'sub', subMenuLink: '/salesreportingbybuyer', status: true}
        ]
      },
      {
        menuIcon: 'list',
        menuTitle: 'Stock',
        menuType: 'report',
        link: '/stock',
        status: true,
        subMenuItems: [
          {subMenuIcon: 'shopping_basket', subMenuTitle: 'Stock Transfer', subMenuType: 'sub', subMenuLink: '/stocktransfer', status: true},
          {subMenuIcon: 'shopping_basket', subMenuTitle: 'Stock Return', subMenuType: 'sub', subMenuLink: '/stockreturn', status: true}
        ]
      },
      {
        menuIcon: 'settings',
        menuTitle: 'System',
        menuType: 'main',
        link: '/company',
        status: true,
        subMenuItems: [
          {subMenuIcon: 'mdi-account-location', subMenuTitle: 'Company', subMenuType: 'sub', subMenuLink: '/company', status: true},
          {subMenuIcon: 'person_add', subMenuTitle: 'User List', subMenuType: 'sub', subMenuLink: '/users', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Item List', subMenuType: 'sub', subMenuLink: '/items', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Brand List', subMenuType: 'sub', subMenuLink: '/brands', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Product List', subMenuType: 'sub', subMenuLink: '/products', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Supplier List', subMenuType: 'sub', subMenuLink: '/suppliers', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Buyer List', subMenuType: 'sub', subMenuLink: '/buyers', status: true},
          {subMenuIcon: 'list', subMenuTitle: 'Warehouse List', subMenuType: 'sub', subMenuLink: '/warehouses', status: true}
        ]
      }
    ]
  },
  getters: {
    getMenus (state) {
      return state.menuItems
    },
    mainMenuItems (state) {
      return state.menuItems.filter(item => item.menuType === 'main')
    },
    subMenuItems (state) {
      return state.menuItems.filter(item => item.menuType === 'report')
    },
    reportMenuItems (state) {
    },
    reportSubMenuItems (state) {
    }
  }
}
