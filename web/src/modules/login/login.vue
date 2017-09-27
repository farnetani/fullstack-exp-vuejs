<script>
import utils from '@/shared/utils'

export default {
  data() {
    return {
      form: {usuario: '', senha: ''},
      rules: {
        usuario: [{ required: true, message: 'Por favor digite um usuario!', trigger: 'blur' }],
        senha: [{ required: true, message: 'Por favor digite uma senha!', trigger: 'blur' }]
      }
    }
  },
  methods: {
    login() {
      this.$refs.formLogin.validate((valid) => {
        if (valid) {
          this.$store.dispatch('sessao/login', this.form).then(res => {
            const url = utils.getQueryParams('redirect') || '/'
            if (res) {
              this.$router.push(url)
            } else {
              this.$router.push('/login/continue?redirect=' + url)
            }
          })
        }
      })
    }
  }
}
</script>

<template>
  <el-card class="box-card">
    <div slot="header">
      <h5>Login</h5>
    </div>
    <el-form :model="form" :rules="rules" ref="formLogin" class="row">
      <el-form-item label="Usuario" prop="usuario" class="col-lg-12">
        <el-input placeholder="Digite seu usuario" v-model="form.usuario" />
      </el-form-item>
      <el-form-item label="Senha" prop="senha" class="col-lg-12">
        <el-input placeholder="Digite sua senha" type="password" v-model="form.senha" />
      </el-form-item>
      <div class="col-lg-12">
        <el-button type="primary" @click="login" class="btn-block">Entrar</el-button>
      </div>
    </el-form>
  </el-card>
</template>

<style lang="scss" scoped>

</style>
