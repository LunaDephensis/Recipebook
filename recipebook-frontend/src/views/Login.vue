<template>
  <section class="login">
    <div class="mainContent">
      <div class="bannerText">
        <h2 class="logo">Recipe Book</h2>
        <h3>Online recepttár, <span>Neked!</span></h3>
        <p class="lor">Lorem ipsum dolor sit amet consectetur adipisicing elit. Dicta aliquid fuga rem nesciunt ratione commodi reprehenderit voluptas culpa. Quas iure ipsam molestiae sunt fugit.</p>
      </div>
      <div class="loginBox" v-if="isRegistered">
        <h3>Lépj be!</h3>
        <span class="errorMessage" v-if="isloginError">Hibás felhasználónév vagy jelszó!</span>
        <input type="text" v-model="username" @keyup.enter="login()" placeholder="Felhasználónév">
        <input type="password" v-model="password" @keyup.enter="login()" placeholder="Jelszó">
        <button class="loginBtn" @click="login()">Belépés</button>
        <p>Még nem regisztráltál? <span @click="loginPanelToggle()">Kattints ide!</span></p>
      </div>
      <div class="signUpBox" v-if="!isRegistered">
        <h3>Regisztrálj!</h3>
        <span class="errorMessage">{{signUpErrorMessage}}</span>
        <input type="text" v-model="signUpUsername" placeholder="Felhasználónév">
        <input type="email" v-model="signUpEmail" placeholder="Email">
        <div class="passwordBox">
          <input :type="passwordType" v-model="signUpPassword" placeholder="Jelszó">
          <ion-icon name="eye"
            :class="{active : isActivePasswordShowing}"
            @click="passwordShowing()">
          </ion-icon>
        </div>
        <button class="signUpBtn" @click="signUp()">Regisztráció</button>
        <p>Már regisztráltál? <span @click="loginPanelToggle()">Belépés!</span></p>
      </div>
    </div>
    <WaveFooter/>
  </section>
</template>

<script>
import WaveFooter from '../components/WaveFooter.vue'

export default {
  name: 'Login',
  components: {
    WaveFooter
  },
  data() {
    return {
      isRegistered: true,
      isActivePasswordShowing: false,
      isloginError: false,
      passwordType: 'password',
      username: undefined,
      password: undefined,
      signUpUsername: undefined,
      signUpEmail: undefined,
      signUpPassword: undefined,
      signUpErrorMessage: undefined
    }
  },
  methods: {
    loginPanelToggle() {
      this.isRegistered = !this.isRegistered
    },
    passwordShowing() {
      if(this.passwordType === 'password') {
        this.passwordType = 'text'
      }
      else {
        this.passwordType = 'password'
      }
      this.isActivePasswordShowing = !this.isActivePasswordShowing
    },
    login() {
      let userData = {
        username: this.username,
        password: this.password
      };
      fetch('http://localhost:3000/auth/login', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(userData)
      }).then((resp) => {
        if(resp.ok) {
          return resp.json();
        }
        else {
          throw Error(resp.status);
        }
      }).then((token) => {
        this.redirectToMyRecipes(token);
      }).catch(() => {
        this.isloginError = true;
      });
    },
    signUp() {
      if(this.signUpUsername && this.signUpPassword && this.signUpEmail) {
        let newUser = {
        username: this.signUpUsername,
        password: this.signUpPassword,
        email: this.signUpEmail
      };

      this.signUpErrorMessage = undefined;

      fetch('http://localhost:3000/auth/signup', {
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify(newUser)
      }).then((resp) => {
        if(resp.ok) {
          return resp.json();
        }
        else {
          throw Error(resp.status);
        }
      }).then((token) => {
        this.redirectToMyRecipes(token);
      }).catch(() => {
        this.signUpErrorMessage = "Foglalt felhasználónév vagy email cím!";
      });
      }
      else {
        this.signUpErrorMessage = "A mezők kitöltése kötelező!"
      }
    },
    redirectToMyRecipes(token) {
      localStorage.setItem('token', token);
        this.$router.push({path: '/myrecipes'});
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
      padding: 80px 100px;
      display: flex;
      justify-content: space-between;
      align-items: center;
      background: url(../../public/images/logmac6.png);
      background-position: center;
      background-repeat: no-repeat;
      background-size: cover;

      @include tablet {
        padding: 80px 30px;
      }

      @include tabletS {
        padding: 25px;
        margin-bottom: 100px;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        background: url(../../public/images/logmac6mobile.png);
        background-position: center;
        background-repeat: no-repeat;
        background-size: cover;
      }

      .bannerText {
        position: relative;
        width: 55%;
        max-width: 500px;
        height: 100%;
        display: flex;
        justify-content: flex-start;
        align-items: flex-start;
        align-self: flex-start;
        flex-direction: column;
        margin-top: 30px;

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
          margin-bottom: 25px;

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
          letter-spacing: 1px;
          margin-bottom: 10px;

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

          @include tabletS {
            text-align: center;
            margin-bottom: 30px;
          }

          @include mobile {
            font-size: 0.8em;
          }
        }
      }
    }

      .errorMessage {
        position: absolute;
        top: 85px;
        left: 0;
        width: 100%;
        text-align: center;
        font-size: 0.8em;
        color: $errorMessage;
      }

    .loginBox, .signUpBox {
      position: relative;
      height: 420px;
      width: 320px;
      display: flex;
      justify-content: flex-start;
      align-items: center;
      flex-direction: column;
      background: rgba(255, 255, 255, 0.9);
      border-radius: 15px;
      padding: 50px 25px;
      z-index: 10;

      @include tablet {
        margin-left: 25px;
      }

      @include tabletS {
        margin-left: 0;
        margin-bottom: 120px;
      }

      @include mobile {
        max-width: 100%;
      }

      h3 {
        text-transform: uppercase;
        font-size: 1.5em;
        letter-spacing: 1px;
        color: $black;
        margin-bottom: 25px;
        opacity: 0.8;

        @include mobile {
          font-size: 1.3em;
        }
      }

      input {
        position: relative;
        width: 100%;
        margin-bottom: 25px;
        font-size: 1.1em;
        font-weight: 500;
        color: $white;
        border: none;
        outline: none;
        border-radius: 15px;
        padding: 5px 15px;
        background: rgba(0,0,0,0.25);
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1),
                    0 -2px 8px rgba(0,0,0,0.05),
                    inset 0 -2px 8px rgba(255,255,255,0.2),
                    inset 0 5px 12px rgba(0, 0, 0, 0.1);

        &::placeholder {
          color: rgba(255, 255, 255, 0.7);
          font-weight: 400;
        }

        &:focus {
          background: rgba(0,0,0,0.4);
        }
      }

      .loginBtn, .signUpBtn {
        position: relative;
        width: 100%;
        margin-bottom: 20px;
        font-size: 1.1em;
        font-weight: 600;
        letter-spacing: 2px;
        border: none;
        outline: none;
        border-radius: 15px;
        padding: 5px 15px;
        background: $main1;
        color: $black;
        cursor: pointer;
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1),
                    0 -2px 8px rgba(0,0,0,0.05);

        &:hover {
          background: $main1hover;
          color: $white;
        }
      }

      p {
        font-size: 0.9em;
        color: $black;

        @include mobile {
          text-align: center;
        }

        span {
          font-weight: 600;
          font-size: 1.1em;
          color: $main2;
          cursor: pointer;
        }
      }
    }

    .signUpBox {
      .passwordBox {
        position: relative;
        width: 100%;
        margin-bottom: 25px;
        display: flex;
        justify-content: center;
        align-items: center;
        /*font-size: 1.1em;
        font-weight: 500;
        color: $white;*/
        border: none;
        outline: none;
        border-radius: 15px;
        background: rgba(0,0,0,0.25);
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1),
                    0 -2px 8px rgba(0,0,0,0.05),
                    inset 0 -2px 8px rgba(255,255,255,0.2),
                    inset 0 5px 12px rgba(0, 0, 0, 0.1);

        input {
          margin-bottom: 0;
          padding: 5px 15px;
          box-shadow: none;
          background: transparent;
        }

        ion-icon {
          margin: 0 15px;
          font-size: 1.3em;
          color: $white;
          opacity: 0.5;
          cursor: pointer;
          visibility: visible;

          &:hover {
            opacity: 1;
          }

          &.active {
            opacity: 1;
            visibility: visible;
            color: $main2;
          }
        }
      }
    }
  }

</style>
