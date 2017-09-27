import { Schema } from 'mongoose'
import * as bcrypt from 'bcrypt-nodejs'

import { Model } from '../../shared/model'

export class TarefaModel extends Model {

    constructor() {
        let schema = {
            _usuario: {type: Schema.Types.ObjectId, ref: 'Usuario', required: true},
            feita: {type: Boolean, required: true, default: false}, 
            nome: {type: String, required: true}
        }
        let indexes = {
            _usuario: 1, feita: 1, nome: 1
        }

        super('Tarefa', schema, indexes);
    }

    uniqueValid(dados: any, cb: Function){
        super.uniqueValid(dados._id, {
            nome: dados.nome,
            feita: false,
            _usuario: dados._usuario
        }, cb);
    }

    findAll(_usuario, cb) {
        super.findAtivos({
            nome: 1, feita: 1
        }, { where: {_usuario} }, {}, cb)
    }

}