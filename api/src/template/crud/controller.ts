import { Request, Response, NextFunction } from 'express'
import { Controller } from '../simple/controller'

export class CrudController extends Controller {
  protected model: any
  protected filter: any

  constructor (rotas, validation, filter, model, meta: any = {}) {
    // Constroe rotas
    rotas.push({ src: '/', action: 'index' })
    rotas.push({ src: '/:id', action: 'get', meta: { valida: true } })
    rotas.push({ method: 'post', src: '/', action: 'post', meta: { valida: true } })
    rotas.push({ method: 'put', src: '/:id', action: 'put', meta: { valida: true } })
    rotas.push({ method: 'delete', src: '/recycle/:id', action: 'recycle' })
    rotas.push({ method: 'delete', src: '/restore/:id', action: 'restore' })
    rotas.push({ method: 'delete', src: '/:id', action: 'delete' })
    
    super(rotas, new validation(), meta)

    //Model e Filter
    this.filter = filter
    this.model = model
  }

  index (req: Request, res: Response, next: NextFunction) {
    var filter = new this.filter(req.query)
    this.model.find(filter, (err, list) => {
      if(err) 
      return this.errorMsg(res, 404, 'error', 'Erro ao buscar registros', { err: err.errmsg })

      return this.succMsg(res, list)
    })
  }

  get (req: Request, res: Response) {
    if (!req.query.select) return this.errorMsg(res, 404, 'error', 'Campo select é obrigatório')
    const id = req.params.id
    this.model.getById(id, req.query.select, (err, usuario) => {
      if(err || !usuario) 
      return this.errorMsg(res, 404, 'error', 'Nenhum registro encontrado')

      return this.succMsg(res, usuario)
    })
  }

  post (req: Request, res: Response) {
    this.model.uniqueValid(req.body, err => {
      if(err) return this.errorMsg(res, 500, 'unique', 'Já existe um registro com esses dados')

      this.model.create(req.body, (err, usuario) => {
        if(err || !usuario) 
        return this.errorMsg(res, 500, 'error', 'Erro ao adicionar registro')
        
        return this.succMsg(res, usuario)
      })
    })
  }

  put (req: Request, res: Response) {
    const id = req.body._id = req.params.id
    this.model.uniqueValid(req.body, (err) => {
      if(err) return this.errorMsg(res, 404, 'unique', 'Já existe um registro com esses dados')

      this.model.update(id, req.body, (err, result) => {
        if (err) return this.errorMsg(res, 404, 'error', 'Erro ao editar registro')
        
        return this.succMsg(res, { message: 'Registro editado com sucesso' })
      })
    })    
  }
  
  recycle (req: Request, res: Response) {
    const id = req.body._id = req.params.id
    this.model.recycle(id, (err, result) => {
      if (err) return this.errorMsg(res, 404, 'unique', 'Erro ao excluir registro')
      
      return this.succMsg(res, { message: 'Registro movido para a lixeira!' })
    })
  }
  
  restore (req: Request, res: Response) {
    const id = req.body._id = req.params.id
    this.model.restore(id, (err, result) => {
      if (err) return this.errorMsg(res, 404, 'unique', 'Erro ao excluir registro')
      
      return this.succMsg(res, { message: 'Registro restaurado com sucesso!' })
    })
  }
  
  delete (req: Request, res: Response) {
    const id = req.body._id = req.params.id
    this.model.delete(id, (err, result) => {
      if (err) return this.errorMsg(res, 404, 'unique', 'Erro ao excluir registro')
      
      return this.succMsg(res, { message: 'Registro excluido!' })
    })
  }
}