import loadOnDemand from '@/router/loadOnDemand'

export default { 
    path: '/home', component: loadOnDemand('modules/home/home'), meta: { requiresAuth:true },
}