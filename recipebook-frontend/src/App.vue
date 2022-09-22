<template>
  <div>
     <PageLoader v-if="isLoading"/>
    <router-view/>
  </div>
</template>

<script>

import PageLoader from './components/PageLoader.vue'

export default {
  components: {
    PageLoader
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

  @include large {
    font-size: 22px;
  }
 
 @include tablet {
   font-size: 22px;
 }

 @include mobile {
   font-size: 16px;
 }
}

* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: 'Poppins', sans-serif;
}



</style>
