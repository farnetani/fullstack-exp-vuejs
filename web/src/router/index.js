import Vue from 'vue'
import Router from 'vue-router'
import loadOnDemand from '@/router/loadOnDemand'

//Initial page layouts include
import LoginRouter from '@/modules/login/login.router'
import HomeRouter from '@/modules/home/home.router'

//Build a router array
let routes = [
  LoginRouter, HomeRouter,
  { path: '*', redirect: '/home' }
];

Vue.use(Router)

let router = new Router({ mode: 'history', routes })

router.beforeEach((to, from, next) => {
  if(to.matched.some(record => record.meta.requiresAuth)){
    if(!!localStorage.getItem('token')) {
      next()
    } else {
      next({
        path: '/login',
        query: { redirect: to.fullPath }
      })
    }
  }else{
    next()
  }
})

export default router;