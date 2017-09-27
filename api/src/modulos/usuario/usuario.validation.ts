import { Validation } from './../../shared/validation'

class UsuarioValidation extends Validation {

    constructor() {
        super()
    }

    senha(pass) {
        if(pass) {
            let regex = /^(?=(?:.*?[a-zA-Z]){1})(?=(?:.*?[0-9]){1})(?=(?:.*?[!@#$%*()_+^&}{:?.]){1})(?!.*\s)[0-9a-zA-Z!@#$%*()_+^&}{:?.]*$/
    
            if (pass.length < 8) {
                this.status = false
                this.err.push(new Error('Senha precisa ter no mínimo 8 caracteres!')) 
            }             
            if (!regex.exec(pass)) {
                this.status = false
                this.err.push(new Error('Senha precisa ter letras, números e caracteres especiais!'))
            }    
        }
    }

    salva(dados) {
        this.errorClean()
        
        this.forIsEmpty(dados, ['nome', 'usuario', 'senha'])
        this.senha(dados.senha)

        return this.response()
    }
}

export default new UsuarioValidation()