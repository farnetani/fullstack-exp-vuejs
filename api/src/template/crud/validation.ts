import { Validation } from '../simple/validation'

export interface CrudValidationInterface {
  post (dados)
  put (dados)
}

export class CrudValidation extends Validation {
  constructor() {
    super()
  }
}