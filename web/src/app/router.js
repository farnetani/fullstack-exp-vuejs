const lazy = (component) => () => import(`@/app/${component}.vue`)

export default [
  { name: 'home', path: '/', component: lazy('default/index') },

  // Redirect para a home em caso de não encontrar a página solicitada
  { path: '*', redirect: '/' }
]
