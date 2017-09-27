import { Request, Response, NextFunction } from 'express'

import { Controller } from './../../shared/controller'

import UsuarioValidation from './usuario.validation'
import { UsuarioModel } from './usuario.model'

class UsuarioController extends Controller {
    model: UsuarioModel

    constructor() {
        const rotas = [
            {url:'', method:'post', action: ['validaRota', 'salva']}
        ]

        super(rotas, UsuarioValidation)
        this.model = new UsuarioModel()
    }

    salva(req: Request, res: Response, next: NextFunction) {
        //Salva
        this.model.uniqueValid(req.body, (err: Error) => {
            if(err) return this.ErrMsg(res, err, 'Um usuário com essas informações já existe!')

            this.model.updateOrCreate(req.body, (err: Error, usuario: any) => {
                if(err) return this.ErrMsg(res, err, 'Erro ao salvar usuário!')
                if(!usuario) return this.ErrMsg(res, null, 'Erro ao salvar usuário!')

                return this.SuccMsg(res, usuario, 'Usuário salvo com sucesso')
            })
        })
    }
}

export default new UsuarioController().route