<script>
export default {
  
}
</script>
<template>
  <div class="container">
    <div class="row mt-3">
      <div class="col-lg-4 col-md-6 ml-auto mr-auto">
        <div class="logo">
          <img src="../../assets/logo.png" alt="">
        </div>
        <router-view></router-view>
      </div>
    </div>
  </div>
</template>
<style lang="scss" scoped>
@import 'src/assets/scss/main.scss';
.logo {
  width: 100%;
  height: 100px;
  text-align: center;
  margin: 30px 0;
  img {
    height: 100%;
    width: auto;
    margin: 0 auto;
  }
}
</style>

