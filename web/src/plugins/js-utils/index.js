import Vue from 'vue'
import Vuex from 'vuex'
import Router from 'vue-router'
import VeeValidate from 'vee-validate'
import createPersistedState from 'vuex-persistedstate'
import { sync } from 'vuex-router-sync'

import modules from '@/app/store'
import routes from '@/app/router'

Vue.use(Vuex)
Vue.use(Router)
Vue.use(VeeValidate)

const store = new Vuex.Store({ modules, plugins: [createPersistedState()] })
const router = new Router({ mode: 'history', routes })

sync(store, router)

export default { store, router }
