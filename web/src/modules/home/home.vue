<script>
import { mapGetters } from 'vuex'
import { mapActions } from 'vuex'

import AppTarefa from './tarefa/tarefa.vue'

export default {
  components: { AppTarefa },
  computed: mapGetters({
    usuario: 'sessao/sessaoUsuario'
  }),
  methods: {
    logout() {
      this.$store.dispatch('sessao/logout')
    }
  }
}
</script>

<template>
  <div class="container">
    <div class="row">
      <div class="col-12 text-right">
        <strong>{{ usuario.nome }}</strong>
        <el-button type="text" @click="logout">Logout</el-button>
      </div>
    </div>
    <div class="row mt-3">
      <app-tarefa class="col-lg-6 col-md-8 ml-auto mr-auto"></app-tarefa>
    </div>
  </div>
</template>

<style lang="scss" scoped>
@import 'src/assets/scss/main.scss';

.bg-purple {
  background: #d3dce6;
}

tr.done {
  td {
    text-decoration: line-through;
    color: $color-light;
  }
}
</style>
