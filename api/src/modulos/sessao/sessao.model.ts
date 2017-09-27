import { Schema } from 'mongoose'
import { Model } from '../../shared/model'

export class SessaoModel extends Model {

    constructor() {
        let schema = {
            _usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
            token: {type: String, required: true},
            refresh: {type: String, required: true},
            expira: {type: Date, required: true},
            agent: {
                device: {type: String, required: true},
                ip: {type:String, required: true},
                browser: {
                    name: {type: String, required: true},
                    version: {type: String, required: true},
                },
                engine: {
                    name: {type: String, required: true},
                    version: {type: String, required: true}
                },
                os: {
                    name: {type: String, required: true},
                    version: {type: String, required: true}
                }
            },
            _sessao: {type: Schema.Types.ObjectId, ref: 'Sessao'}
        }
        let indexes = {
            token:1, refresh: 1, agent: 1
        }

        super('Sessao', schema, indexes);
    }

    getSessaoUsuario(usuario: String, cb: Function) {
        this.findOne({ _usuario: usuario, ativo: true }, cb)
    }

    getSessaoId(token: String, cb: Function) {
        this.findId({ token }, cb)
    }
    
    getSessaoRefresh(refresh: String, cb: Function) {
        this.findOne({ refresh, ativo: true }, cb)
    }

    getUsuario(token: String, cb: Function) {
        this.findOne({ token, ativo: true }, (err, item) => {
            if(err) return cb(err)
            if(!item) return cb(err, item)
            item._usuario.senha = undefined
            delete item._usuario.senha
            return cb(null, item._usuario)
        }, ['_usuario'])
    }

}