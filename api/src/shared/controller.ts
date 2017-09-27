import { Router, Request, Response, NextFunction } from 'express'
import auth from './auth'

export class Controller {
    public route: Router = Router()
    protected validation: any = false

    constructor(rotas = [], validation: any = false, meta = {}) {
        rotas.forEach(rota => {
            //Função
            const method = 'rota'+rota.method || 'rotaget'

            this[method](rota, meta)
        })

        this.validation = validation
    }

    //Valida todas as requesições
    validaRota(req: Request, res: Response, next: NextFunction, rota: any) {
        if (!this.validation) return next()
        const funcao = rota.action[1]
        const valid = this.validation[funcao](req.body)
        if (!valid.status) return this.ErrMsg(res, valid.err, 'Erro na validação dos dados!')

        return next()
    }

    protected setUser(dados, req) {
        return Object.assign({ _usuario: req.user.id }, dados)
    }

    //Padrao de MSG
    private padraoMsg(status: Boolean, message: String, data: any) {
        return {
            "status": status,
            "message": message,
            "data": data
        }
    }

    //Padrao de msg de successo
    protected SuccMsg(res: Response, data: any, message: String) {
        return res.status(200).json(this.padraoMsg(true, message, data))
    }

    //Padrao de informação
    protected WarnMsg(res: Response, warn, message: String) {
        return res.status(200).json(this.padraoMsg(false, message, warn))
    }

    //Padrao de erro
    protected ErrMsg(res: Response, err, message: String) {
        return res.status(500).json(this.padraoMsg(false, message, this.trataErro(err, message)))
    }

    private trataErro(err, message) {
        if (err == null || (typeof (err.message) == 'undefined' && typeof (err.map) != 'function')) {
            return { _message: message }
        }
        if (typeof (err.map) == 'function') {
            return err.map(item => { return { _message: item.message } })
        }
        return { _message: err.message }
    }

    protected rotaget(rota, meta) {
        this.route.get(rota.url, [this.meta(rota, meta), this.request(rota)])
    }

    protected rotapost(rota, meta) {
        this.route.post(rota.url, [this.meta(rota, meta), this.request(rota)])
    }

    protected rotadelete(rota, meta) {
        this.route.delete(rota.url, [this.meta(rota, meta), this.request(rota)])
    }

    protected rotaput(rota, meta) {
        this.route.put(rota.url, [this.meta(rota, meta), this.request(rota)])
    }

    private request(rota) {
        let f = []
        
        if(typeof(rota.action) == 'object') {
            rota.action.forEach(element => {
                f.push(this.method(element, rota))
            })
        }else{
            f.push(this.method(rota.action, rota))
        }        

        return f
    }

    private method(action, rota) {
        return (req: Request, res: Response, next: NextFunction) => this[action](req, res, next, rota)
    }

    private metaError(res, data, message){
        return res.status(500).json({status: false, data, message})
    }

    private requireAuth(req: Request, res: Response, next: NextFunction) {
        const token = auth.valida(req.headers['x-access-token'])
        
        if(!token) return this.metaError(res, { token: true }, 'Token inválido')
        
        //Seta o usuário na sessao
        req.user = token
        if(req.body) req.body._usuario = token.id

        return next()
    }

    private meta(rota, meta) {
        const regras = Object.assign({}, meta, rota.meta)

        return (req: Request, res: Response, next: NextFunction) => {
            //Verifica se requer autenticação e se a altenticação está ok
            if(regras.requireAuth) return this.requireAuth(req, res, next)

            //Verifica tag teste 
            if(regras.teste) {
                console.log('É uma função ainda em teste')
            }
            
            return next()
        }
    }
}