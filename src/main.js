import Vue from "vue";
import App from "core/App";
import router from "./router";
import store from "core/store";
import ElementUI from 'element-ui';
import 'element-ui/lib/theme-chalk/index.css';
import locale from 'element-ui/lib/locale/lang/en'
import to from 'await-to-js';
import { getAuth, onAuthStateChanged } from "firebase/auth";

Vue.use(ElementUI, { locale })

Vue.config.productionTip = false;

Vue.prototype.$awaitTo = to;

let app;

onAuthStateChanged(getAuth(), () => {
  if (!app) {
    app = new Vue({
      el: '#app',
      router,
      store,
      render: h => h(App)
    })
  }
});
