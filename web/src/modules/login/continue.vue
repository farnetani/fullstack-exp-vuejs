<script>
import { mapState } from 'vuex'
import utils from '@/shared/utils'

export default {
  data() {
    return {
      urlRedirect: utils.getQueryParams('redirect') || '/'
    }
  },
  computed: mapState({
    bloqueado: state => state.sessao.bloqueado,
    sessao: state => state.sessao.sessaoBloqueando
  }),
  created() {
    if (!this.bloqueado) {
      this.$router.push('/login?redirect=' + this.urlRedirect)
    }
  },
  methods: {
    remove() {
      this.$store.dispatch('sessao/remBloqueioLogin').then(res => {
        if (res) this.$router.push('/login?redirect=' + this.urlRedirect)
      })
    },
    login() {
      this.$store.dispatch('sessao/continueLogin').then(res => {
        if (res) this.$router.push(this.urlRedirect)
      })
    }
  }
}
</script>
<template>
  <el-card class="box-card">
    <div slot="header" class="text-danger">
      <h5>Identificamos outro sessão ativa desse usuário.</h5>
    </div>
    <div class="item">
      <strong>{{ sessao.agent.device }}</strong>
      {{ sessao.agent.os.name }} {{ sessao.agent.os.version }} - IP:
      <strong>{{ sessao.agent.ip }}</strong>
    </div>
    <div class="item">
      Navegador:
      <strong> {{ sessao.agent.browser.name }} </strong>
    </div>
    <div class="row mt-2">
      <div class="col-12">
        <p class="text-bold">Como deseja prosseguir?</p>
      </div>
    </div>
    <div class="row">
      <div class="col-sm-6">
        <el-button type="primary" class="btn-block" @click="login">Entrar</el-button>
      </div>
      <div class="col-sm-6">
        <el-button class="btn-block" @click="remove">Voltar</el-button>
      </div>
    </div>
  </el-card>
</template>
<style lang="scss" scoped>
@import 'src/assets/scss/main.scss';
.box-card {
  .item {
    padding: 5px 0;
    font-size: 14px;
  }
}
</style>