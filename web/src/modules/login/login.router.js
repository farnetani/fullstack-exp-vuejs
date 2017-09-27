import loadOnDemand from '@/router/loadOnDemand'

export default { 
    path: '/login', component: loadOnDemand('modules/login/loginLayout'), children: [
        { path: '', component: loadOnDemand('modules/login/login') },
        { path: 'continue', component: loadOnDemand('modules/login/continue') }
    ]
}