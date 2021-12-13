import Auth from 'modules/auth';
import LandingPage from 'modules/landingPage';
import List from 'modules/list';

export default [
  {
    path: '*',
    redirect: Auth
  },
  {
    path: '/',
    redirect: '/login'
  },
  {
    path: '/login',
    name: 'Login',
    component: Auth,
    meta: {
      authRequired: false,
    },
  },
  {
    path: '/home',
    name: 'LandingPage',
    component: LandingPage,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '/list',
    name: 'List',
    component: List,
    meta: {
      authRequired: true,
    },
  },
  {
    path: '*',
    redirect: '404',
  },
];
