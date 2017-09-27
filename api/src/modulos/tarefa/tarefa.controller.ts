import { Request, Response, NextFunction } from 'express'

import { Controller } from './../../shared/controller'

import TarefaValidation from './tarefa.validation'
import { TarefaModel } from './tarefa.model'

class TarefaController extends Controller {
    model: TarefaModel

    constructor() {
        const rotas = [
            { url: '', method: 'get', action: 'getAll' },
            { url: '', method: 'post', action: ['validaRota', 'salva'] },
            { url: '/feita', method: 'post', action: ['validaRota', 'feita'] },
            { url: '/:id', method: 'delete', action: 'delete' }
        ]

        super(rotas, TarefaValidation, { requireAuth: true })
        this.model = new TarefaModel()
    }

    getAll(req: Request, res: Response, next: NextFunction) {
        this.model.findAll(req.user.id, (err: Error, list) => {
            if (err) return this.ErrMsg(res, err, 'Erro ao buscar lista de tarefas!')

            return this.SuccMsg(res, list, 'Lista todas as tarefas')
        })
    }

    salva(req: Request, res: Response, next: NextFunction) {
        //Salva
        this.model.uniqueValid(req.body, (err: Error) => {
            if (err) return this.ErrMsg(res, err, 'Uma tarefa com essas informações já existe!')

            this.model.updateOrCreate(req.body, (err: Error, tarefa: any) => {
                if (err) return this.ErrMsg(res, err, 'Erro ao salvar tarefa!')
                if (!tarefa) return this.ErrMsg(res, null, 'Erro ao salvar tarefa!')

                return this.SuccMsg(res, tarefa, 'Tarefa salva com sucesso')
            })
        })
    }

    feita(req: Request, res: Response, next: NextFunction) {
        req.body.feita = !req.body.feita
        this.model.update(req.body._id, req.body, (err: Error, tarefa: any) => {
            if (err) return this.ErrMsg(res, err, 'Erro ao marcar tarefa como feita!')
            if (!tarefa) return this.ErrMsg(res, null, 'Tarefa não encontrada!')

            return this.SuccMsg(res, tarefa, 'Tarefa marcada como feita')
        })
    }

    delete(req: Request, res: Response, next: NextFunction) {
        this.model.delete({ _id: req.params.id, _usuario: req.user.id }, (err: Error) => {
            if (err) return this.ErrMsg(res, err, 'Erro ao exluir tarefa!')

            return this.SuccMsg(res, {}, 'Tarefa excluida com sucesso')
        })
    }

}

export default new TarefaController().route