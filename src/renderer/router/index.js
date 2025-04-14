import Vue from 'vue'
import Router from 'vue-router'
import AuthGuard from './authguard'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Home',
      component: require('@/components/Dashboard').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createuser',
      name: 'User',
      component: require('@/components/Users/Forms/CreateUser').default
    },
    {
      path: '/edituser/:id',
      name: 'EditUser',
      props: true,
      component: require('@/components/Users/Forms/EditUser').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/users',
      name: 'Users',
      component: require('@/components/Users/Forms/Users').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/signin',
      name: 'SignIn',
      component: require('@/components/Users/Forms/SignIn').default
    },
    {
      path: '/company',
      name: 'Company',
      component: require('@/components/Systems/Forms/Company').default
    },
    {
      path: '/items',
      name: 'Items',
      component: require('@/components/Items/Forms/Items').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/brands',
      name: 'Brands',
      component: require('@/components/Brands/Forms/Brands').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/products',
      name: 'Products',
      component: require('@/components/Products/Forms/Products').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createproduct',
      name: 'CreateProduct',
      component: require('@/components/Products/Forms/CreateProduct').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/suppliers',
      name: 'Suppliers',
      component: require('@/components/Suppliers/Forms/Suppliers').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createsupplier',
      name: 'CreateSupplier',
      component: require('@/components/Suppliers/Forms/CreateSupplier').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/buyers',
      name: 'Buyers',
      component: require('@/components/Buyers/Forms/Buyers').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createbuyer',
      name: 'Buyer',
      component: require('@/components/Buyers/Forms/CreateBuyer').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/stock',
      name: 'Stock',
      component: require('@/components/Warehouses/Forms/Stock').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/warehouses',
      name: 'Warehouses',
      component: require('@/components/Warehouses/Forms/Warehouses').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createwarehouse',
      name: 'Warehouse',
      component: require('@/components/Warehouses/Forms/CreateWarehouse').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/stocktransfer',
      name: 'StockTransfer',
      component: require('@/components/Transfers/Forms/Transfers').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createtransfer',
      name: 'CreateTransfer',
      component: require('@/components/Transfers/Forms/CreateTransfer').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'viewtransfer',
      name: 'ViewTransfer',
      props: true,
      component: require('@/components/Transfers/Reports/ViewTransfer').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/stockreturn',
      name: 'StockReturn',
      component: require('@/components/Returns/Forms/Returns').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createreturn',
      name: 'CreateReturn',
      component: require('@/components/Returns/Forms/CreateReturn').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'viewreturn',
      name: 'ViewReturn',
      props: true,
      component: require('@/components/Returns/Reports/ViewReturn').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/purords',
      name: 'PurOrds',
      component: require('@/components/PO/Forms/PurOrds').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createpo',
      name: 'CreatePO',
      component: require('@/components/PO/Forms/CreatePurOrd').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'vieworder',
      name: 'ViewOrder',
      props: true,
      component: require('@/components/PO/Reports/ViewOrder').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/purordrcvs',
      name: 'PurOrdRcvs',
      component: require('@/components/PORCV/Forms/PurOrdRcvs').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createpor',
      name: 'CreatePOR',
      component: require('@/components/PORCV/Forms/CreatePurOrdRcv').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'viewreceive',
      name: 'ViewReceive',
      props: true,
      component: require('@/components/PORCV/Reports/ViewReceive').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/receivesreporting',
      name: 'ReceivesReporting',
      component: require('@/components/PORCV/Forms/ReceivesReporting').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'rptreceives',
      name: 'RptReceives',
      props: true,
      component: require('@/components/PORCV/Reports/RptReceives').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/sales',
      name: 'Sales',
      component: require('@/components/Sales/Forms/Sales').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/createinvoice',
      name: 'CreateInvoice',
      component: require('@/components/Sales/Forms/CreateInvoice').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/salessummaryforreporting',
      name: 'SalesSummaryForReporting',
      component: require('@/components/Sales/Forms/SalesSummaryForReporting').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'salessummary',
      name: 'SalesSummary',
      props: true,
      component: require('@/components/Sales/Reports/SalesSummary').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/salesreportingbybuyer',
      name: 'SalesReportingByBuyer',
      component: require('@/components/Sales/Forms/SalesReportingByBuyer').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'rptsalesbybuyer',
      name: 'RptSalesByBuyer',
      props: true,
      component: require('@/components/Sales/Reports/RptSalesByBuyer').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'payment',
      name: 'Payment',
      props: true,
      component: require('@/components/Sales/Forms/Payment').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: '/salesreturn',
      name: 'SalesReturn',
      component: require('@/components/Sales/Forms/SalesReturn').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'slnos',
      name: 'SlNos',
      props: true,
      component: require('@/components/Shared/SlNos').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'removeslnofromcart',
      name: 'RemoveSlNoFromCart',
      props: true,
      component: require('@/components/Shared/RemoveSlNoFromCart').default,
      beforeEnter: AuthGuard.guardAuth
    },
    {
      path: 'viewinvoice',
      name: 'ViewInvoice',
      props: true,
      component: require('@/components/Sales/Reports/ViewInvoice').default,
      beforeEnter: AuthGuard.guardAuth
    }
  ],
  mode: 'history'
})
