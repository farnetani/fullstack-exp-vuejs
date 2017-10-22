import Sequelize from 'sequelize'
import { Model } from '../template/simple/model'
import { CrudModel } from '../template/crud/model'

class TarefaModel extends Model implements CrudModel{
  constructor (db) {
    const fields = {
      usuario_id: { type: Sequelize.INTEGER, allowNull: false },
      feita: { type: Sequelize.BOOLEAN, allowNull: false },
      nome: { type: Sequelize.STRING, allowNull: false }
    }
    const options = {}
    super(db, 'Tarefa', { fields, options })
  }

  associations (models) {
    models.Tarefa.belongsTo(models.Usuario, { as: 'usuario', foreignKey: 'usuario_id', foreignKeyConstraint: true })
    super.associations(models)
  }

  find (query: any, cb: Function) {
    super.find(['feita', 'nome'], query, [ ['nome', 'ASC'] ], cb, [{
      model: this.models.Usuario,
      as: 'usuario',
      attributes: ['nome']
    }])
  }

  //Verifica se é unico
  uniqueValid (dados, cb) {
    const params = { usuario_id: dados.usuario_id, nome: dados.nome }
    super.uniqueValid(dados, params, cb)
  }

}

export default (db) => new TarefaModel(db)
