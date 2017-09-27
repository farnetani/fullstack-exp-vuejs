import Vue from 'vue'
import Vuex from 'vuex'
import config from '@/config'
Vue.use(Vuex)
/* --------- Lodash ------------ */
import _ from 'lodash'
/* ------------------------------ */

//import modules
import sessao from '@/store/modules/sessao.store'
import tarefa from '@/modules/home/tarefa/tarefa.store'

export default  new Vuex.Store({
    modules:{
        sessao,
        tarefa
    },
    strict: config.strict
})