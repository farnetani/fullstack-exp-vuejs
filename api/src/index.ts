import { Router } from 'express'
import indexRoute from './modules/index.controller'
import usuarioRoute from './modules/usuario/usuario.controller'
import tarefaRoute from './modules/tarefa/tarefa.controller'


//Rotas principais da API
const routes = [
  { src: '/', ctrl: indexRoute },
  { src: '/usuario', ctrl: usuarioRoute },
  { src: '/tarefa', ctrl: tarefaRoute }
]

//Constroe rotas
const rt = Router()
routes.forEach(el => {
  rt.use(el.src, el.ctrl)
})
export default rt