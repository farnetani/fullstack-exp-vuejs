// The Vue build version to load with the `import` command
// (runtime-only or standalone) has been set in webpack.base.conf with an alias.
import Vue from 'vue'

// Plugins
import utils from './plugins/js-utils' // Rotas e Vuex
import './plugins/ui' // Global e UI

// App Principal
import App from './main.vue'
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  router: utils.router,
  store: utils.store,
  components: { App },
  template: '<app/>'
})
