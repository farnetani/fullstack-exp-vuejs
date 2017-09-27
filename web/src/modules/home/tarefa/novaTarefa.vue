<script>
import { mapActions } from 'vuex'

export default {
    data() {
        return {
            novaTarefa: {
                nome: ''
            }
        }
    },
    methods: mapActions({
        addTarefa: 'tarefa/addTarefa'
    })
}
</script>

<template>
    <form class="row" @submit.prevent="addTarefa(novaTarefa)">
        <div class="col-sm-10 col-9 el-form-item">
            <label>Nova Tarefa</label>
            <el-input placeholder="Digite uma nova tarefa" v-model="novaTarefa.nome"></el-input>
        </div>
        <div class="col-sm-2 col-3 mt-label text-right">
            <el-tooltip content="Adicionar esta tarefa">
                <el-button native-type="submit" type="primary" icon="plus"></el-button>
            </el-tooltip>
        </div>
    </form>
</template>

