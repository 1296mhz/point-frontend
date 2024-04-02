import Vue from 'vue';
import VueRouter, { RouteConfig } from 'vue-router';
import RootView from '../views/RootView.vue';
import LoginView from '../views/LoginView.vue';
import DailyRevenueReportView from '../views/DailyRevenueReportView.vue';
import AddressPointView from '../views/AddressPointView.vue';
import UsersView from '../views/UsersView.vue';
import ReportsView from '../views/ReportsView.vue';
import store from '@/store';

Vue.use(VueRouter);

const routes: Array<RouteConfig> = [
  {
    path: '/login',
    name: 'Login',
    component: LoginView,
    meta: {
      guest: true,
    },
  },
  {
    path: '/',
    name: 'Root',
    component: RootView,
    meta: {
      requiresAuth: true,
      is_admin: true,
    },
    redirect: { name: 'DailyRevenueReportView' },
    children: [
      {
        path: '/DailyRevenueReport',
        name: 'DailyRevenueReportView',
        component: DailyRevenueReportView,
        meta: {
          requiresAuth: true,
          is_admin: true,
        },
      },
      {
        path: '/addressPoints',
        name: 'AddressPoint',
        component: AddressPointView,
        meta: {
          requiresAuth: true,
          is_admin: true,
        },
      },
      {
        path: '/users',
        name: 'Users',
        component: UsersView,
        meta: {
          requiresAuth: true,
          is_admin: true,
        },
      },
      {
        path: '/reports',
        name: 'Reports',
        component: ReportsView,
        meta: {
          requiresAuth: true,
          is_admin: true,
        },
      },
      // {
      //   path: '/districts/:districtId',
      //   name: 'District',
      //   // component: TaskView,
      //   props: true,
      //   meta: {
      //     requiresAuth: true,
      //     is_admin: true,
      //   },
      // },
      // {
      //   path: '/tasks',
      //   name: 'Tasks',
      //   component: TasksView,
      //   meta: {
      //     requiresAuth: true,
      //     is_admin: true,
      //   },
      // },
      // {
      //   path: '/tasks/:taskId',
      //   name: 'Task',
      //   component: TaskView,
      //   props: true,
      //   meta: {
      //     requiresAuth: true,
      //     is_admin: true,
      //   },
      // },
      // {
      //   path: '/pointsToTask/:taskId',
      //   name: 'PointsToTask',
      //   component: PointsToTask,
      //   props: true,
      //   meta: {
      //     requiresAuth: true,
      //     is_admin: true,
      //   },
      // },
      // {
      //   path: '/settings',
      //   name: 'Settings',
      //   component: SettingsView,
      //   meta: {
      //     requiresAuth: true,
      //     is_admin: true,
      //   },
      // },
    ],
  },
  {
    // catch all 404 - define at the very end
    path: '*',
    component: () => import('../views/NotFound.vue'),
  },
];

const router = new VueRouter({
  mode: 'history',
  base: process.env.BASE_URL,
  routes,
});

router.beforeEach(async (to, from, next) => {
  const authenticated = store.getters['isLoggedIn'];
  if (to.name === 'Login' && authenticated) {
    next(`/`);
  }

  if (to.name !== 'Login' && !authenticated) next({ name: 'Login' });
  else next();
});

export default router;
