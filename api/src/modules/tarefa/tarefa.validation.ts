import { CrudValidation, CrudValidationInterface } from './../../template/crud/validation'

export class TarefaValidation extends CrudValidation implements CrudValidationInterface{
  constructor() {
    super()
  }

  post (dados) {
    this.errorClean()
    this.forIsEmpty(dados, ['feita', 'nome'])
    return this.response()
  }

  put (dados) {
    this.errorClean()   
    return this.response()
  }

}