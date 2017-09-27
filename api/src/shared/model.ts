import { Schema, model } from 'mongoose'
import * as sanitize from 'mongo-sanitize'

export class Model {
    public name: String
    public entidade: Schema

    constructor(name: String, fields: any, indexes: any) {
        this.name = name
        this.constructSchema(fields)
        this.constructIndex(indexes)
        this.constructMethods()
        this.constructEntidade()
    }

    //Construir Schema
    protected constructSchema(fields: any) {
        //Padrão de controle de toda aplicação
        fields.ativo = { type: Boolean, required: true, default: true }
        fields.criado = { type: Date, required: true, default: Date.now }
        fields.alterado = { type: Date }
        fields.inativado = { type: Date }

        this.entidade = new Schema(fields)
    }

    //Constroi os indexes para otimização de pesquisa
    protected constructIndex(indexes: any) {
        indexes = Object.assign({ ativo: -1, criado: 1 }, indexes)
        this.entidade.index(indexes)
    }

    //Construir methods da entidade
    protected constructMethods() {
        //this.entidade.methods[name] = f
    }

    //Construir entidade do mongoose
    protected constructEntidade() {
        try {
            this.entidade = model(this.name)
        } catch {
            this.entidade = model(this.name, this.entidade)
        }
    }

    //Retorna uma lista de registro de acordo com parametros
    protected find(select: any, query: any, sort: any, cb: Function) {
        //Trata a pagina
        if (!query.page) query.page = 1
        if (!query.itensPorPagina) query.itensPorPagina = 10
        let limit = query.page * query.itensPorPagina
        let skip = limit - query.itensPorPagina

        //Trata select e sort
        select = Object.assign({ ativo: 1, criado: 1 }, select)
        sort = Object.assign({ ativo: -1 }, sort)
        
        //Executa a busca
        this.entidade.find(query.where).limit(limit).skip(skip).select(select).sort(sort).exec(cb)
    }

    protected findAtivos(select: any, query: any, sort: any, cb: Function) {
        query.where = Object.assign({ativo: true}, query.where)
        
        return this.find(select, query, sort, cb)
    }

    protected findOne(query: any, cb: Function, populate: any = false) {
        let consulta = this.entidade.findOne(query)
        if (populate) {
            for (let item of populate)
            consulta.populate(item)
        }
        consulta.exec(cb)
    }

    protected findId(query: any, cb: Function) {
        this.entidade.findOne(query, '_id', cb)
    }

    //Verifica se o registro é unico
    protected uniqueValid(_id: String, params: any, cb: Function) {
        this.entidade.findOne(params, function (err, item) {
            if (err) return cb(err)
            if (!(item == null || item._id == _id))
                return cb(new Error("Registro não é unico!"))

            return cb(null)
        })
    }

    //Altera ou cria um registro de acordo com o _id
    updateOrCreate(dados: any, cb: Function) {
        if (dados._id) {
            this.update(dados._id, dados, cb)
        } else {
            this.create(dados, cb)
        }
    }

    //Altera um registro
    update(_id: String, dados: any, cb: Function) {
        dados.alterado = Date.now()
        const where: any = {
            _id: sanitize(_id)
        }
        //Deixa editar somente o usuario na sessao
        if(dados._usuario) where._usuario = dados._usuario 

        //Edita
        this.entidade.where(where).update({$set: dados}, cb)
    }

    //Cria um registro
    create(dados: any, cb: Function) {
        this.entidade.create(dados, cb)
    }

    //Retorna um único registro
    getOne(_id: String, cb: Function, populate: any = false) {
        let query = this.entidade.findById(sanitize(_id))
        if (populate) {
            for (let item of populate)
                query.populate(item)
        }
        query.exec(cb)
    }

    //Ativar ou inativar o registro
    ativa(_id: String, valor: Boolean, cb: Function) {
        //Salva ativação ou inativação
        valor = !valor
        let dados: any = { ativo: valor }
        if (valor == false) dados.inativado = Date.now()

        this.update(sanitize(_id), dados, cb)
    }

    //Deletar o registro
    delete(dados, cb: Function) {
        const where: any = {
            _id: sanitize(dados._id)
        }
        //Deixa editar somente o usuario na sessao
        if(dados._usuario) where._usuario = dados._usuario 

        //Edita
        this.entidade.where(where).remove(cb)
    }
}