export default [
  {
    path: '/',
    component: () =>
      import(/* webpackChunkName 'layout' */ '@/layouts/default.vue'),
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName 'marketplace' */ '@/views/Marketplace.vue')
      }
    ]
  },
  {
    path: '/marketplace/:id',
    component: () =>
      import(/* webpackChunkName 'layout' */ '@/layouts/default.vue'),
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: 'listing' */ '@/views/Listing.vue')
      }
    ]
  },
  {
    path: '/dashboard',
    component: () =>
      import(/* webpackChunkName 'layout' */ '@/layouts/default.vue'),
    children: [
      {
        path: '',
        component: () =>
          import(/* webpackChunkName: 'dashboard' */ '@/views/Dashboard.vue')
      }
    ]
  },
  // leave 404 as last one always
  {
    path: '*',
    component: () =>
      import(/* webpackChunkName: 'notFound' */ '@/views/NotFound.vue')
  }
]
