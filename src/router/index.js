/* eslint-disable */

import { createRouter, createWebHistory } from 'vue-router'

// Auth Default Routes
const authChildRoutes = (prefix) => [
  {
    path: '',
    name: prefix + '.login',
    meta: { auth: false, name: 'Login' },
    component: () => import('@/views/auth/SignIn.vue'),
  },
  {
    path: 'register',
    name: prefix + '.register',
    meta: { auth: false, name: 'Register' },
    component: () => import('@/views/auth/SignUp.vue')
  },
  {
    path: 'verify-email',
    name: prefix + '.verify-email',
    meta: { auth: false, name: 'Verify Email' },
    component: () => import('@/views/auth/VerifyEmail.vue')
  },
]

// User routes
const userRoutes = (prefix) => [
  // DASHBOARD 
  {
    path: 'dashboard',
    name: prefix + '.dashboard',
    meta: { auth: true, name: 'HomeAdmin', isBanner: false },
    component: () => import('@/views/_user/DashboardPage.vue')
  },

  // SHIP 
  {
    path: 'ship',
    name: prefix + '.ship',
    meta: { auth: true, name: 'ShipPage', isBanner: false },
    component: () => import('@/views/_user/ShipPage/ShipPage.vue')
  },
  {
    path: 'ship/:shipId',
    name: prefix + '.shipDetail',
    meta: { auth: true, name: 'ShipDetailPage', isBanner: false },
    component: () => import('@/views/_user/ShipPage/ShipDetail.vue'),
  },

  // ARRIVAL 
  {
    path: 'arrival',
    name: prefix + '.arrival',
    meta: { auth: true, name: 'ArrivalPage', isBanner: false },
    component: () => import('@/views/_user/ArrivalPage/ArrivalPage.vue')
  },

  // DEBT 
  {
    path: 'debt',
    name: prefix + '.debt',
    meta: { auth: true, name: 'DebtPage', isBanner: true },
    component: () => import('@/views/_user/DebtPage/DebtPage.vue')
  },

  // APPROVAL 
  {
    path: 'approval/accepted',
    name: prefix + '.approval-accepted',
    meta: { auth: true, name: 'ApprovalAcceptedPage', isBanner: false },
    component: () => import('@/views/_user/ApprovalPage/AcceptedPage.vue')
  },
  {
    path: 'approval/pending',
    name: prefix + '.approval-pending',
    meta: { auth: true, name: 'ApprovalPendingPage', isBanner: false },
    component: () => import('@/views/_user/ApprovalPage/PendingPage.vue')
  },
  {
    path: 'approval/rejected',
    name: prefix + '.approval-rejected',
    meta: { auth: true, name: 'ApprovalRejectedPage', isBanner: false },
    component: () => import('@/views/_user/ApprovalPage/RejectedPage.vue')
  },

  // REPORT 
  {
    path: 'report/docking',
    name: prefix + '.report-docking',
    meta: { auth: true, name: 'ReportDockingPage', isBanner: false },
    component: () => import('@/views/_user/ReportPage/DockingPage.vue')
  },
  {
    path: 'report/fraud',
    name: prefix + '.report-fraud',
    meta: { auth: true, name: 'ReportFraudPage', isBanner: false },
    component: () => import('@/views/_user/ReportPage/FraudPage.vue')
  },

  // SETTING 
  {
    path: 'setting/aplication',
    name: prefix + '.setting-application',
    meta: { auth: true, name: 'SettingApplicationPage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/ApplicationPage.vue')
  },
  {
    path: 'setting/geofence',
    name: prefix + '.setting-geofence',
    meta: { auth: true, name: 'SettingGeofencePage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/GeofencePage.vue')
  },
  {
    path: 'setting/geofence/:geofenceId',
    name: prefix + '.setting-geofenceDetail',
    meta: { auth: true, name: 'SettingGeofenceDetailPage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/EditGeofence.vue'),
  }, 
  {
    path: 'setting/geofence/add',
    name: prefix + '.add-geofence',
    meta: { auth: true, name: 'AddGeofencePage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/AddGeofence.vue')
  },


  {
    path: 'setting/geofence/929292',
    name: prefix + '.setting-geofence-tegalsari',
    meta: { auth: true, name: 'SettingPage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/GeofencePage_tegalsari.vue')
  },
  {
    path: 'setting/geofence/919191',
    name: prefix + '.setting-geofence-nizamZachman',
    meta: { auth: true, name: 'SettingPage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/GeofencePage_nizam.vue')
  },
  {
    path: 'setting/geofence/test',
    name: prefix + '.map-test',
    meta: { auth: true, name: 'testPage', isBanner: false },
    component: () => import('@/views/_user/SettingPage/tester.vue')
  },

  // USER 
  {
    path: 'user/web',
    name: prefix + '.user-web',
    meta: { auth: true, name: 'User Web', isBanner: false },
    component: () => import('@/views/_user/UserPage/UserWeb.vue')
  },
  {
    path: 'user/mobile',
    name: prefix + '.user-mobile',
    meta: { auth: true, name: 'User Mobile', isBanner: false },
    component: () => import('@/views/_user/UserPage/UserMobile.vue')
  },
]

// Error routes
const errorRoutes = (prefix) => [
  // Error Pages
  {
    path: '404',
    name: prefix + '.404',
    meta: { auth: true, name: 'Error 404', isBanner: true },
    component: () => import('@/views/errors/Error404Page.vue')
  },
  {
    path: '500',
    name: prefix + '.500',
    meta: { auth: true, name: 'Error 500', isBanner: true },
    component: () => import('@/views/errors/Error500Page.vue')
  },
  {
    path: 'maintenance',
    name: prefix + '.maintenance',
    meta: { auth: true, name: 'Maintenance', isBanner: true },
    component: () => import('@/views/errors/MaintenancePage.vue')
  }
]

const router = createRouter({
  linkActiveClass: 'active',
  linkExactActiveClass: 'exact-active',
  history: createWebHistory(process.env.BASE_URL),
  base: process.env.BASE_URL,

  routes: [
    // Auth
    {
      path: '/',
      name: 'auth',
      component: () => import('../layouts/BlankLayout.vue'),
      children: authChildRoutes('auth')
    },


    // User
    {
      path: '/',
      name: 'userPage',
      component: () => import('../layouts/DashboardLayout.vue'),
      children: userRoutes('admin'),
      meta: { requiresAuth: true }
    },

    // Errors
    {
      path: '/errors',
      name: 'errors',
      component: () => import('../layouts/BlankLayout.vue'),
      children: errorRoutes('errors')
    }
  ]
})


// router.beforeEach((to, from, next) => {
//   const requiresAuth = to.matched.some(route => route.meta.auth);
//   const isAuthenticated = localStorage.getItem("authenticated");

//   if (to.name !== 'auth.login' && !isAuthenticated && requiresAuth) {
//     next({ name: 'auth.login' });
//   } else if (to.name === 'auth.login' && isAuthenticated) {
//     next({ to: 'admin.dashboard' });
//   } else if (to.matched.length === 0) {
//     next({ name: 'errors.404' });
//   } else {
//     next();
//   }
// });

export default router
