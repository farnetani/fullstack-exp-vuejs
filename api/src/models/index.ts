import * as fs from 'fs'
import Sequelize from 'sequelize'
import { basename, resolve } from 'path'

//Carrega as configurações do database
const filename  = basename(__filename)
const env       = process.env.NODE_ENV || 'development'
const config    = require( resolve(__dirname, '../../config/database.json') )[env]

// Aliases de Operador ===========
const Op = Sequelize.Op

config.operatorsAliases = {
  $eq: Op.eq,
  $ne: Op.ne,
  $gte: Op.gte,
  $gt: Op.gt,
  $lte: Op.lte,
  $lt: Op.lt,
  $not: Op.not,
  $in: Op.in,
  $notIn: Op.notIn,
  $is: Op.is,
  $like: Op.like,
  $notLike: Op.notLike,
  $iLike: Op.iLike,
  $notILike: Op.notILike,
  $regexp: Op.regexp,
  $notRegexp: Op.notRegexp,
  $iRegexp: Op.iRegexp,
  $notIRegexp: Op.notIRegexp,
  $between: Op.between,
  $notBetween: Op.notBetween,
  $overlap: Op.overlap,
  $contains: Op.contains,
  $contained: Op.contained,
  $adjacent: Op.adjacent,
  $strictLeft: Op.strictLeft,
  $strictRight: Op.strictRight,
  $noExtendRight: Op.noExtendRight,
  $noExtendLeft: Op.noExtendLeft,
  $and: Op.and,
  $or: Op.or,
  $any: Op.any,
  $all: Op.all,
  $values: Op.values,
  $col: Op.col
}

let db = new Sequelize(config.database, config.username, config.password, config)

const models:any = { pure: {} }

require('fs').readdirSync(__dirname).filter(file => {
  return (file.indexOf('.') !== 0) && (file !== filename) && (file.slice(-3) === '.js')
}).forEach(file => {
  let mFile = require( resolve(__dirname, file) ).default(db)
  db = mFile.getDb()
  models[mFile.name] = mFile
  models.pure[mFile.name] = mFile.getEntidade()
})

Object.keys(models).forEach(modelName => {
  if (modelName !== 'pure') {
    models[modelName].associations(models.pure)
  }
})

models.instance = db
models.Sequelize = Sequelize

export default models