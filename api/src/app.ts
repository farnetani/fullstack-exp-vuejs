//Importa rotas REST
import IndexController from './modulos/index/index.controller'
import SessaoController from './modulos/sessao/sessao.controller'
import UsuarioController from './modulos/usuario/usuario.controller'
import TarefaController from './modulos/tarefa/tarefa.controller'

//Importa rotas Socket
import { SessaoSocket } from './modulos/sessao/sessao.socket'

class App {
    public rotas: any[] = []

    constructor() {
        //Cria urls de acordo com o módulo
        this.rotas.push({ url: '', modulo: IndexController })
        this.rotas.push({ url: '/sessao', modulo: SessaoController })
        this.rotas.push({ url: '/usuario', modulo: UsuarioController })
        this.rotas.push({ url: '/tarefa', modulo: TarefaController })
    }

    socket(io) {
        new SessaoSocket(io)
    }
}

export default new App()