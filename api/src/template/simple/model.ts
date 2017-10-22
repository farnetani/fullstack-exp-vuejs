import Sequelize from 'sequelize'

export class Model {
  protected name: String = ''
  
  protected instance: any = {}
  protected fields: any = {}
  protected options: any = {}
  protected entidade: any = {}
  protected models: any = {}

  constructor (db, name, { fields, options }) {
    this.instance = db
    this.name = name
    this.options = options || {}
    this.constructSchema(fields)
  }

  protected associations (models) {
    // Associações devem vir aqui
    this.models = models
  }

  protected constructSchema (fields) {
    this.fields = {
      id: { type: Sequelize.INTEGER, allowNull: false, autoIncrement: true, primaryKey: true },
      active: { type: Sequelize.BOOLEAN, allowNull: false, defaultValue: true },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW
      }
    }

    this.fields = Object.assign({}, this.fields, fields)
    this.entidade = this.instance.define(this.name, this.fields, this.options)
  }

  /* ============= Functions que precisa de implementacao ============= */
  //Retorna uma lista de registro de acordo com parametros
  protected find (select: any, query: any, order: any, cb: Function, include: any = []) {
    if (!query.page) query.page = 1
    if (!query.itensPorPagina) query.itensPorPagina = 10
    let limit = query.itensPorPagina
    let offset = (query.page * query.itensPorPagina) - query.itensPorPagina
    
    //Trata attributes e order
    let attributes = ['id', 'active', 'createdAt', 'updatedAt']
    attributes = attributes.concat(select)
    order = order.concat([ ['active', 'DESC'] ])

    // Where do select
    let where = query.where || {}
    let options = { attributes, where, limit, offset, order, include }
    this.entidade.findAll(options)
      .then((result) => cb(null, result))
      .catch(cb)
  } 
  
  //Retorna um único registro
  protected findOne(filters: any, select: any = {}, cb: Function, include: any = []) {
    //Trata attributes e where
    let attributes = ['id', 'active', 'createdAt', 'updatedAt']
    attributes = attributes.concat(select)
    let where = filters || {}

    //Executa a busca
    let options = { attributes, where, include }
    this.entidade.findOne(options)
      .then((result) => cb(null, result))
      .catch(cb)
  }

  //Verifica se é unico
  protected uniqueValid(dados, where: any = {}, cb: Function) {
    let options = { attributes: ['id'], where }
    this.entidade.findOne(options)
      .then((result) => {
        if (result && result.id != dados.id) return cb({ message: "Registro não é unico!" })
        return cb(null)
      }).catch(cb)
  }

  /* ============= Public Methods ============= */
  //Retorna um único registro pelo ID
  getById(id: String, select: any = {}, cb: Function, include: any = false) {
    this.findOne({ id }, select, cb, include)
  }

  //Adiciona novo registro
  create (dados: any, cb: Function) {
    this.entidade.create(dados)
      .then((result) => cb(null, result))
      .catch(cb)
  }
  
  //Altera um registro
  update(id: String, dados: any, cb: Function) {
    const where: any = { id }  
    //Edita
    this.entidade.update(dados, { where: { id } } )
      .then((result) => cb(null, result))
      .catch(cb)
  }

  //Lixeira
  recycle(id, cb: Function) {
    this.update(id, { active: false }, cb)
  }
  
  //Volta lixeira
  restore(id, cb: Function) {
    this.update(id, { active: true }, cb)
  }
  
  //Deletar o registro
  delete(id, cb: Function) {
    this.entidade.destroy({ where: { id } })
      .then((result) => cb(null, result))
      .catch(cb)
  }

  /* ============= Instances e Fields ============= */
  getDb() {
    return this.instance
  }

  getEntidade() {
    return this.entidade
  }

  getFields () {
    return this.fields
  }
}