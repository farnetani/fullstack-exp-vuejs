import { Socket } from './../../shared/socket'

export class SessaoSocket extends Socket {

    constructor(io) {
        super(io, '/sessao')

        this.app.on('connection', function (client) {
            client.on('autenticacao', function (usuario) {
                if (usuario) {
                    client.join(usuario)
                    client.to(usuario).emit('novo login')
                }
            })
            client.on('disconectar', function (usuario) {
                if (usuario) {
                    client.leave(usuario)
                }
            })
        })
    }

}