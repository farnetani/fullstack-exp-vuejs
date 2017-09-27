import { Validation } from './../../shared/validation'

class TarefaValidation extends Validation {

    constructor() {
        super()
    }

    salva(dados) {
        this.errorClean()

        this.forIsEmpty(dados, ['nome'])

        return this.response()
    }

    feita(dados) {
        this.errorClean()
        
        this.forIsEmpty(dados, ['_id', 'feita'])

        return this.response()
    }
}

export default new TarefaValidation()