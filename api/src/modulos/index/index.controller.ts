import { Response, NextFunction } from 'express'

import utils from '../../shared/utils'
import { Controller } from './../../shared/controller'

class IndexController extends Controller {

    constructor() {
        const rotas = [
            {url:'', method:'get', action: 'index'}
        ]

        super(rotas)
    }

    index(req: Request, res: Response, next: NextFunction) {
        return this.SuccMsg(res, {}, 'Bem vindo a API!')
    }
}

export default new IndexController().route