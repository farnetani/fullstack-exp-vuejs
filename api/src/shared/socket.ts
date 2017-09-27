import auth from './auth'

export class Socket {
    protected app

    /*Informação Importante
    socket.broadcast.emit // Envia para todos conectados menos para quem enviou a requisição
    socket.emit // Envia somente para quem quiser enviou a requisição
    socket.join // Nomeia a sessão aberta
    socket.in([session-name]).emit //Envia somente para quem está logado na sessão
    */
    constructor(protected io, url: string) {
        this.app = this.io.of(url)
    }

}