import Sequelize from 'sequelize'
import * as bcrypt from 'bcrypt-nodejs'
import { Model } from '../template/simple/model'
import { CrudModel } from '../template/crud/model'

class UsuarioModel extends Model implements CrudModel{
  constructor (db) {
    const fields = {
      nome: { type: Sequelize.STRING, allowNull: false },
      email: { type: Sequelize.STRING, allowNull: false, unique: true },
      senha: { type: Sequelize.STRING, allowNull: false }
    }
    const options = {}
    super(db, 'Usuario', { fields, options })
  }

  //Update dados senha
  private hashSenha (senha, cb) {
    bcrypt.hash(senha, null, null, (err, hash) => {
      if(err) return cb(err)
      return cb(null, hash)
    })
  }

  find (query: any, cb: Function) {
    super.find(['nome', 'email'], query, [ ['nome', 'ASC'] ], cb)
  }

  //Verifica se é unico
  uniqueValid (dados, cb) {
    const params = { email: dados.email }
    super.uniqueValid(dados, params, cb)
  }

  //Cria um novo usuário
  create (dados, cb) {
    this.hashSenha(dados.senha, (err, hash) => {
      if(err) return cb(err)
      dados.senha = hash
      super.create(dados, cb)
    })
  }

  //Edita usuário
  update (id, dados, cb) {
    if(dados.senha) {
      this.hashSenha(dados.senha, (err, hash) => {
        if(err) return cb(err)
        dados.senha = hash
        super.update(id, dados, cb)
      })
    }else{
      super.update(id, dados, cb)
    }
  }
}

export default (db) => new UsuarioModel(db)
