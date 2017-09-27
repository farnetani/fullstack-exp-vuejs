<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

export default {
    computed: mapGetters({
        tarefasOrdenadas: 'tarefa/tarefasOrdenadas'
    }),
    methods: mapActions({
        tarefaFeita: 'tarefa/tarefaFeita',
        deleteTarefa: 'tarefa/deleteTarefa'
    })
}
</script>

<template>
    <div class="row">
        <div class="col-lg-12">
            <table class="el-table">
                <thead>
                    <tr>
                        <th colspan="3">Todas as Tarefas</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in tarefasOrdenadas" :key="item.feita" :class="{'feita': item.feita}">
                        <td class="text-center action-icon">
                            <el-tooltip content="Tarefa feita" placement="left">
                                <el-button type="text" icon="check" @click="tarefaFeita(item)" class="check-button"></el-button>
                            </el-tooltip>
                        </td>
                        <td>{{ item.nome }}</td>
                        <td class="text-center action">
                            <el-tooltip content="Excluir" placement="right">
                                <el-button type="danger" icon="delete" size="mini" @click="deleteTarefa(item)"></el-button>
                            </el-tooltip>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>

<style lang="scss" scoped>
@import 'src/assets/scss/main.scss';

tr {
    td button.check-button {
        color: $color;
    }

    &.feita td {
        text-decoration: line-through;
        color: $color-light;
        button.check-button {
            color: $primary;
        }
    }
}
</style>
