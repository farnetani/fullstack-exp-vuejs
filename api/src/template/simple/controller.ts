import { Router, Request, Response, NextFunction } from 'express'

import { getClientInfo } from './../../util/request'

export class Controller {
  protected act_log: any
  public route: Router = Router()
  protected validation: any

  protected errorMsg (res, code, type, message, obj = {}) {
    const json = Object.assign({ type, message }, obj)
    return res.status(code).json(json)
  }

  protected succMsg (res, result, type = 'response') {
    const json = { type, result }
    return res.json(json)
  }

  constructor (rotas, validation: any = false, meta = {}) {
    rotas.forEach(rota => {
      let method = rota.method || 'get'
      this[`set${method}`](rota, meta)
    })
    this.validation = validation
  }

  protected setget (rota, meta) {
    this.route.get(rota.src, [this.meta(rota, meta), this.method(rota)])
  }

  protected setpost (rota, meta) {
    this.route.post(rota.src, [this.meta(rota, meta), this.method(rota)])
  }

  protected setput (rota, meta) {
    this.route.put(rota.src, [this.meta(rota, meta), this.method(rota)])
  }

  protected setdelete (rota, meta) {
    this.route.delete(rota.src, [this.meta(rota, meta), this.method(rota)])
  }

  private method(rota) {
    return (req: Request, res: Response, next: NextFunction) => this[rota.action](req, res, next, rota)
  }

  private meta(rota, meta) {
    const regras = Object.assign({}, meta, rota.meta)
    return (req: Request, res: Response, next: NextFunction) => {
      return this.asyncMeta(regras, req, res, next, rota).then(fc => {        
        if(fc.err) return this.errorMsg(res, fc.err, fc.type, fc.message, fc.obj)
        return next()
      })
    }
  }
  
  private async asyncMeta(regras:any = {}, req, res, next, rota) {
    try {
      //Valida rota com validation
      if (regras.valida) {
        await this.validaRota(req, res, rota)
      }
    } catch (e) {
      return e
    }
    return true
  }

  private validaRota(req, res, rota: any): any {
    return new Promise((resolve, reject) => {
      if (!this.validation) return resolve(true)
      const funcao = typeof(rota.action) == "object"?rota.valida:rota.action
      const valid = this.validation[funcao](req.body)
      if (!valid.status) 
      return reject({ err: 500, type: 'validation', message: 'Erro na validação', obj: { fields: valid.err } })

      return resolve(true)
    })
  }

}