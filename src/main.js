import Vue from 'vue';
import App from './App.vue';
import router from './router';
import vuetify from './plugins/vuetify';
import vSelect from 'vue-select';
import axios from 'axios';
import store from './store/store';
import "./plugins/vuetify-money.js";

Vue.component('v-select2', vSelect);
Vue.config.productionTip = false

axios.defaults.headers.common['Authorization'] = `Bearer ${store.state.token}`;

new Vue({
  router,
  store,
  vuetify,
  render: h => h(App)
}).$mount('#app')
