import { Validation } from './../../shared/validation'

class SessaoValidation extends Validation {

    constructor() {
        super()
    }

    add(dados) {
        this.errorClean()

        this.forIsEmpty(dados, ['usuario', 'senha'])

        return this.response()
    }

    destroe(dados) {
        this.errorClean()

        this.forIsEmpty(dados, ['token'])

        return this.response()
    }

    refresh(dados) {
        this.errorClean()

        this.forIsEmpty(dados, ['refresh'])

        return this.response()
    }

    continue(dados) {
        this.errorClean()

        this.forIsEmpty(dados, ['id', 'usuarioId'])

        return this.response()
    }

    usuario(dados) {
        this.errorClean()
        
        this.forIsEmpty(dados, ['token'])
        
        return this.response()
    }
}

export default new SessaoValidation()