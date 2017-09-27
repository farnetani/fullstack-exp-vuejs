import { MyApi } from '@/shared/MyApi'
import { Notify } from '@/shared/Notify'

const not = new Notify()
const api = new MyApi('/tarefa', not, true)

const state = {
    tarefas: []
}

const getters = {
    tarefasOrdenadas: state => {
        return _.orderBy(state.tarefas, ['feita'])
    }
}

const actions = {
    listTarefas({ commit }) {
        return new Promise((resolve, reject) => {
            api.get().then(response => {
                if(response.status){
                    commit('LISTTAREFAS', response.data)
                    resolve(true)
                }
            })
        })
    },
    addTarefa({ commit }, tarefa) {
        if (tarefa.nome != '') {
            return new Promise((resolve, reject) => {
                api.post(tarefa).then(response => {
                    if(response.status) {
                        commit('ADDTAREFA', response.data)
                        not.success(response.message)
                        resolve(true)
                    }
                })
            })
        }
    },
    tarefaFeita({ commit }, tarefa) {
        return new Promise((resolve, reject) => {
            api.post(tarefa, '/feita').then(response => {
                if(response.status) {
                    commit('TAREFAFEITA', tarefa)
                    resolve(true)
                }
            })
        })
    },
    deleteTarefa({ commit }, tarefa) {
        return new Promise((resolve, reject) => {
            api.delete('/'+tarefa._id).then(response => {
                if(response.status) {
                    commit('DELTAREFA', tarefa)
                    not.success(response.message)
                    return true
                }
            })
        })
    }
}

const mutations = {
    LISTTAREFAS(state, listaTarefas) {
        state.tarefas = {}
        state.tarefas = listaTarefas
    },
    ADDTAREFA(state, tarefa) {
        state.tarefas.push(tarefa)
    },
    TAREFAFEITA(state, tarefa) {
        const indice = _.findIndex(state.tarefas, el => el._id == tarefa._id)
        state.tarefas[indice].feita = !state.tarefas[indice].feita
    },
    DELTAREFA(state, tarefa) {
        const indice = _.findIndex(state.tarefas, el => el._id == tarefa._id)
        state.tarefas.splice(indice, 1)
    }
}

export default {
    namespaced: true,
    state, 
    getters, 
    actions, 
    mutations 
}