import { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt-nodejs'

import { Model } from '../../shared/model'

export class UsuarioModel extends Model {

    constructor() {
        let schema = {
            nome: {type: String, required: true},
            usuario: {type: String, required: true},
            senha: {type: String, required: true} 
        }
        let indexes = {
            usuario: 1, nome: 1
        }

        super('Usuario', schema, indexes);
    }

    protected constructMethods() {
        this.entidade.methods.validaSenha = function(senha: String, cb: Function) {
            bcrypt.compare(senha, this.senha, function(err, isMatch){
                if (err) return cb(err, null);
                cb(null, isMatch);
            });
        }
    }

    uniqueValid(dados: any, cb: Function){
        super.uniqueValid(dados._id, {
            "$or": [
                { nome: dados.nome },
                { usuario: dados.usuario }
            ]
        }, cb);
    }

    updateOrCreate(dados: any, cb: Function) {
        bcrypt.hash(dados.senha, null, null, (err, hash) => {
            dados.senha = hash
            super.updateOrCreate(dados, cb)
        })
    }

    findUsuario(usuario: String, cb: Function) {
        this.findOne({ usuario }, cb)
    }

}