import { MyApi } from '@/shared/MyApi'
import { Notify } from '@/shared/Notify'
import { Socket } from '@/shared/Socket'

const api = new MyApi('/sessao', new Notify())
const not = new Notify()
const socket = new Socket('/sessao').socket

const state = {
    isLoggedIn: !!localStorage.getItem('token'),
    usuario: {},
    //Controla o tempo da sessao
    lastActive: Date.now(),
    eventoOut: false,
    //Quando já existe um usuário logado
    bloqueado: false,
    sessaoBloqueando: {}
}

const getters = {
    isLoggedIn: state => state.isLoggedIn,
    sessaoUsuario: state => state.usuario
}

const actions = {
    login({ commit, state, dispatch }, usuario) {
        return new Promise((resolve, reject) => {
            api.post(usuario).then(response => {
                if (response.status) {
                    commit('LOGIN', response.data)
                    dispatch('getUsuarioSessao')
                    resolve(true)
                } else {
                    commit('BLOCK', response.data)
                    resolve(false)
                }
            })
        })
    },
    logout({ state, commit }) {
        return new Promise((resolve, reject) => {
            api.post({
                token: localStorage.getItem('token')
            }, '/destroe').then(response => {
                if(state.eventoOut) clearTimeout(state.eventoOut)
                commit('LOGOUT')
                resolve(true)
            })
        })
    },
    remBloqueioLogin({ commit }) {
        commit('REMBLOCK')
        return true
    },
    continueLogin({ commit, state, dispatch }) {
        return new Promise((resolve, reject) => {
            api.post(state.sessaoBloqueando, '/continue').then(response => {
                if (response.status) {
                    commit('REMBLOCK')
                    commit('LOGIN', response.data)
                    dispatch('getUsuarioSessao')
                    resolve(true)
                }
            })
        })
    },
    refresh({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            api.post({ refresh: localStorage.getItem('refresh') }, '/refresh').then(response => {
                commit('LOGIN', response.data)
                dispatch('controlaSessao')
            }).catch(() => {
                dispatch('logout')
            })
        })
    },
    getUsuarioSessao({ commit, dispatch }) {
        return new Promise((resolve, reject) => {
            api.post({ token: localStorage.getItem('token') }, '/usuario').then(response => {
                commit('SETUSUARIO', response.data)
                dispatch('controlaSessao')
            }).catch(() => {
                dispatch('logout')
                reject()
            })
        })
    },
    controlaSessao({ state, commit, dispatch }) {
        //Observa se outra pessoa entra na sessao
        socket.on('novo login', data => {
            if(state.isLoggedIn){
                not.error('Outro computador acessou com esse usuário!')
                dispatch('logout')
            }
        })
        //Calcula o tempo até terminar a sessao da API
        const expira = new Date(localStorage.getItem('expira')).getTime()
        const horaAtual = Date.now()
        const sessao = expira - horaAtual - (60 * 1000) //1 minuto antes do limite
        //Calcula o tempo ate terminar a sessao do usuario
        const inativo = Date.now() - state.lastActive
        //Tempo limite de uma sessao do usuario sem inatividade
        const limite = 10 * 60 * 1000 //10 minutos
        //Timeout para verificar a sessao do usuario
        commit('TIMEOUTSESSAO', setTimeout(() => {
            if(state.isLoggedIn) {
                if(inativo >= limite){
                    dispatch('logout')
                }else{
                    dispatch('refresh')
                }
            }
        }, sessao))
    },
}

const mutations = {
    SETUSUARIO(state, payload) {
        socket.emit('autenticacao', payload._id)
        state.usuario = payload
    },
    TIMEOUTSESSAO(state, payload) {
        state.eventoOut = payload
    },
    LOGIN(state, payload) {
        localStorage.setItem('token', payload.token)
        localStorage.setItem('refresh', payload.refresh)
        localStorage.setItem('expira', payload.expira)        

        state.isLoggedIn = true
    },
    BLOCK(state, payload) {
        state.bloqueado = true
        state.sessaoBloqueando = payload
    },
    REMBLOCK(state) {
        state.bloqueado = false
    },
    LOGOUT(state) {
        socket.emit('disconectar', state.usuario._id)
        localStorage.removeItem('token')
        localStorage.removeItem('refresh')
        localStorage.removeItem('expira')

        state.isLoggedIn = false
        state.usuario = {}
    },
    LASTACTIVE(state) {
        state.lastActive = Date.now()
    }
}

export default {
    namespaced: true,
    state, 
    getters, 
    actions, 
    mutations 
}