import Vue from 'vue'

// Estilos
import 'font-awesome/css/font-awesome.css'
// import './assets/sass/main.sass'
import './assets/scss/main.scss'

// Components e functions
import components from './components'
import { created } from './data'

const GlobalPlugin = {}

GlobalPlugin.install = function (Vue) {
  Vue.mixin({ created, components })
}

Vue.use(GlobalPlugin)
