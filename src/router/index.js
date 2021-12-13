import Vue from 'vue';
import Router from 'vue-router';
import routes from './routes';
import { getAuth } from "firebase/auth";

Vue.use(Router);

const router = new Router({
  mode: 'history',
  linkActiveClass: 'open active',
  routes
});

router.beforeEach((to, from, next) => {
  const authRequired = to.matched.some(record => record.meta.authRequired);
  const currentUser = getAuth().currentUser;

  if (authRequired && !currentUser) next('/login');
  else if (!authRequired && currentUser) next('/home');
  else next();
});

export default router;
