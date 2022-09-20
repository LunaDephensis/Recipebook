<template>
  <div>
     <Loader v-if="isLoading"/>
    <router-view/>
  </div>
 
</template>

<script>

import Loader from './components/Loader.vue'

export default {
  components: {
    Loader
  },
  computed: {
    isLoading() {
      return this.$store.getters.isLoading
    }
  }
}
</script>

<style lang="scss">

@import url('https://fonts.googleapis.com/css2?family=Fredericka+the+Great&display=swap');
@import url('https://fonts.googleapis.com/css2?family=Poppins:wght@100;200;300;400;500;600;700;800;900&display=swap');

#app {
  /*font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;*/
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}



</style>
