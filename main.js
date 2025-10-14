import App from "./App";
import * as Pinia from "pinia";
import piniasistedstate from "pinia-plugin-persistedstate";

// #ifndef VUE3
import Vue from "vue";
import "./uni.promisify.adaptor";
Vue.config.productionTip = false;
App.mpType = "app";
const app = new Vue({
  ...App,
});
app.$mount();
// #endif

// #ifdef VUE3
import {
  createSSRApp
} from "vue";
export function createApp() {
  const app = createSSRApp(App);
  const pinia = Pinia.createPinia();
  pinia.use(piniasistedstate);
  app.use(pinia);
  return {
    app,
    Pinia,
  };
}
// #endif