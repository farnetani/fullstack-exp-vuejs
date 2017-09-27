import { Request, Response, NextFunction } from 'express'

import utils from '../../shared/utils'
import { Controller } from '../../shared/controller'
import auth from '../../shared/auth'

import { UsuarioModel } from './../usuario/usuario.model'
import SessaoValidation from './sessao.validation'
import { SessaoModel } from './sessao.model'

class SessaoController extends Controller {
    model: SessaoModel

    constructor() {
        const rotas = [
            { url: '', method: 'post', action: ['validaRota', 'add'] },
            { url: '/continue', method: 'post', action: ['validaRota', 'continue'] },
            { url: '/destroe', method: 'post', action: ['validaRota', 'destroe'] },
            { url: '/refresh', method: 'post', action: ['validaRota', 'refresh'] },
            { url: '/usuario', method: 'post', action: ['validaRota', 'usuario'] }
        ]

        super(rotas, SessaoValidation)
        this.model = new SessaoModel()
    }

    private validaUsuario(req: Request, res: Response, cb: Function) {
        let usuarioObj: UsuarioModel = new UsuarioModel()
        usuarioObj.findUsuario(req.body.usuario, (err, usuario) => {
            if (err) return this.ErrMsg(res, err, 'Usuário não encontrado!')
            if (!usuario) return this.ErrMsg(res, null, 'Usuário não encontrado!')
            if (!usuario.ativo) return this.ErrMsg(res, null, 'Usuário inativo')

            usuario.validaSenha(req.body.senha, (err, isMath) => {
                if (err) return this.ErrMsg(res, err, 'Senha incorreta!')
                if (!isMath) return this.ErrMsg(res, null, 'Senha incorreta!')

                usuario.senha = undefined
                delete usuario.senha
                return cb(usuario)
            })
        })
    }

    private criaSessao(req, res, usuario, sessao, cb) {
        usuario = usuario._id || usuario
        const { token, refresh, expira } = auth.newToken(usuario)
        const add: any = {
            _usuario: usuario,
            token,
            refresh,
            expira,
            agent: utils.getClientInfo(req)
        }
        if (sessao) add._sessao = sessao
        this.model.create(add, (err, sessao) => {
            if (err) return this.ErrMsg(res, err, 'Erro ao salvar sessão!')
            if (!sessao) return this.ErrMsg(res, null, 'Erro ao salvar sessão!')

            return cb(sessao)
        })
    }

    private destroeSessao(req, res, _id, cb) {
        this.model.ativa(_id, true, (err, edit) => {
            if (err) return this.ErrMsg(res, err, 'Erro ao destruir sessao!')
            return cb()
        })
    }

    private exibeSessao(res, sessao) {
        return this.SuccMsg(res, {
            token: sessao.token,
            refresh: sessao.refresh,
            expira: sessao.expira
        }, 'Sessão iniciada')
    }

    private validaSessao(req, res, id, cb) {
        this.model.getSessaoUsuario(id, (err, sessao) => {
            if (err) return this.ErrMsg(res, err, 'Erro na validação do usuário!')
            if (!sessao) return cb()
            //Caso a sessão já esteja expirada
            if (sessao.expira < Date.now()) {
                return this.destroeSessao(req, res, sessao._id, () => {
                    cb()
                })
            }

            //Caso já exista a sessao
            return this.WarnMsg(res, {
                id: sessao._id, usuarioId: id, agent: sessao.agent
            }, 'Já existe uma sessão com esse usuário')
        })
    }

    add(req: Request, res: Response, next: NextFunction) {
        this.validaUsuario(req, res, usuario => {
            this.validaSessao(req, res, usuario._id, () => {
                this.criaSessao(req, res, usuario, null, sessao => {
                    return this.exibeSessao(res, sessao)
                })
            })
        })
    }

    continue(req: Request, res: Response, next: NextFunction) {
        this.destroeSessao(req, res, req.body.id, () => {
            this.validaSessao(req, res, req.body.usuarioId, () => {
                this.criaSessao(req, res, req.body.usuarioId, null, sessao => {
                    return this.exibeSessao(res, sessao)
                })
            })
        })
    }

    destroe(req: Request, res: Response, next: NextFunction) {
        this.model.getSessaoId(req.body.token, (err, sessao) => {
            if (err) return this.ErrMsg(res, err, 'Sessão não encontrada!')
            if (!sessao) return this.ErrMsg(res, null, 'Sessão não encontrada!')
            this.destroeSessao(req, res, sessao._id, () => {
                this.SuccMsg(res, {}, 'Sessão destroida')
            })
        })
    }

    refresh(req: Request, res: Response, next: NextFunction) {
        this.model.getSessaoRefresh(req.body.refresh, (err, sessao) => {
            if (err) return this.ErrMsg(res, err, 'Refresh é inválido!')
            if (!sessao) return this.ErrMsg(res, null, 'Refresh é invállido!')

            this.criaSessao(req, res, { _id: sessao._usuario }, sessao, newSessao => {
                this.destroeSessao(req, res, sessao._id, () => {
                    return this.exibeSessao(res, sessao)
                })
            })
        })
    }

    usuario(req: Request, res: Response, next: NextFunction) {   
        this.model.getUsuario(req.body.token, (err, usuario) => {
            if (err) return this.ErrMsg(res, err, 'Sessão finalizada!')
            if (!usuario) return this.ErrMsg(res, null, 'Sessão finalizada!')

            this.SuccMsg(res, usuario, 'Usuário logado!')
        })
    }
}

export default new SessaoController().route