<script>
import { mapMutations } from 'vuex'

export default {
  methods: {
    setActive() {
      this.$store.commit('sessao/LASTACTIVE')
    }
  },
  created() {
    if(this.$store.getters['sessao/isLoggedIn']) 
    this.$store.dispatch('sessao/getUsuarioSessao')

    this.$store.subscribe(mutation => {
      if(mutation.type == 'sessao/LOGOUT') location.href = '/'
    })
  }
}
</script>

<template>
  <div id="app" @click="setActive" @keyup="setActive">
    <router-view></router-view>
  </div>
</template>

<style lang="scss">
@import 'src/assets/scss/main.scss';
@import "src/assets/scss/general.scss";
@import 'src/assets/scss/presets.scss';

#app {
  position: absolute;
  width: 100%;
  height: 100%;
}
</style>
