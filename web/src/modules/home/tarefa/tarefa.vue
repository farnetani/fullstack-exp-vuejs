<script>
import novaTarefa from './novaTarefa.vue'
import listaTarefas from './listaTarefas.vue'

export default {
    components: { novaTarefa, listaTarefas },
    created() {
        this.$store.dispatch('tarefa/listTarefas')
    }
}
</script>

<template>
    <div class="col-lg-6 col-md-8 ml-auto mr-auto">
        <nova-tarefa></nova-tarefa>
        <lista-tarefas></lista-tarefas>
    </div>
</template>
