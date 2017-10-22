import { Request, Response, NextFunction } from 'express'
import { CrudController } from './../../template/crud/controller'
import db from '../../models'

import { UsuarioValidation } from './usuario.validation'
import { UsuarioFilter } from './usuario.filter'

export class UsuarioCtrl extends CrudController {
  constructor () {
    const rotas = []
    super(rotas, UsuarioValidation, UsuarioFilter, db.Usuario, { sessao: true })
  }
}

export default new UsuarioCtrl().route