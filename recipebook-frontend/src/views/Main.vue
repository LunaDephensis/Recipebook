<template>
  <section class="login">
    <div class="mainContent">
      <div class="bannerText">
        <h2 class="logo">Recipe Book</h2>
        <h3>Online recepttár, <span>Neked!</span></h3>
        <p class="lor">A Recipe Book segít, hogy bárhol, bármikor könnyedén elérhesd kedvenc receptjeidet. A régi, jól bevált fogásokhoz bármikor hozzáadhatod legújabb ötleteidet, vagy kedved szerint módosíthatod őket, hogy receptgyűjteményed mindig naprakész maradjon.</p>
      </div>
      <Login v-if="isRegistered" @registrationToggle="loginPanelToggle()"/>
      <Registration v-if="!isRegistered" @loginToggle="loginPanelToggle()"/>
    </div>
    <WaveFooter/>
  </section>
</template>

<script>
import WaveFooter from '../components/WaveFooter.vue'
import Login from '../components/Login.vue'
import Registration from '../components/Registration.vue'

export default {
  name: 'Main',
  components: {
    WaveFooter, Login, Registration
  },
  data() {
    return {
      isRegistered: true,
    }
  },
  methods: {
    loginPanelToggle() {
      this.isRegistered = !this.isRegistered
    }
  }
}
</script>

<style lang="scss" scoped>

  section.login {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;

    .mainContent {
      position: relative;
      width: 100%;
      min-height: 100vh;
      padding: 5em 6.25em;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: url(../../public/images/logmac6.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      @include tablet {
        flex-direction: column;
        padding: 5em 1.8em;
        background: url(../../public/images/logmac6mobile.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      @include tabletS {
        padding: 3em 1em;
        margin-bottom: 100px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
      }

      .bannerText {
        position: relative;
        width: 55%;
        max-width: 32em;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        align-self: flex-start;
        flex-direction: column;
        margin-top: 1.8em;

        @include tablet {
          width: 100%;
          max-width: 100%;
          height: auto;
          justify-content: center;
          align-items: center;
          align-self: center;
          margin-top: 0;
          margin-bottom: 1em;
          padding: 0 1.2em;
        }
        

        @include tabletS {
          margin-top: 0;
          width: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          align-self: center;
          flex-direction: column;
        }

        .logo {
          font-size: 4.5em;
          color: $white;
          font-family: 'Fredericka the Great', cursive;
          font-weight: 500;
          margin-bottom: 0.7em;

          @include tablet {
            font-size: 3em;
          }

          @include mobile {
            font-size: 2.5em;
            font-weight: 400;
          }
        }

        h3 {
          color: $white;
          font-weight: 400;
          font-size: 1em;
          letter-spacing: 0.1em;
          margin-bottom: 0.6em;

          @include mobile {
            font-size: 0.9em;
          }

          span {
            color: $main2;
            font-weight: 600;
            text-transform: uppercase;
          }
        }

        .lor {
          color: $white;
          font-size: 0.9em;

          @include tablet {
            text-align: center;
          }

          @include tabletS {
            margin-bottom: 1.8em;
          }

          @include mobile {
            font-size: 0.8em;
          }
        }
      }
    } 
  }

</style>
