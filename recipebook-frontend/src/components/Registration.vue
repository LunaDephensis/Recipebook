<template>
    <div class="signUpBox">
        <h3>Regisztrálj!</h3>
        <span class="errorMessage">{{errorMessage}}</span>
        <input name="username" type="text" v-model="username" placeholder="Felhasználónév">
        <input name="email" type="email" v-model="email" placeholder="Email">
        <div class="passwordBox">
          <input name="password" :type="passwordType" v-model="password" placeholder="Jelszó">
          <ion-icon name="eye"
            :class="{active : passwordType === 'text'}"
            @click="passwordShowing()">
          </ion-icon>
        </div>
        <button class="signUpBtn" @click="signUp()">Regisztráció</button>
        <p>Már regisztráltál? <span @click="$emit('loginToggle')">Belépés!</span></p>
    </div>
</template>

<script>
export default {
    name: 'Registration',
    emits: ['loginToggle'],
    data() {
        return {
            passwordType: 'password',
            username: undefined,
            email: undefined,
            password: undefined,
            errorMessage: undefined
        }
    },
    methods: {
        passwordShowing() {
            if(this.passwordType === 'password') {
                this.passwordType = 'text'
            }
            else {
                this.passwordType = 'password'
            }
        },
        async signUp() {
            if(!this.username || !this.password || !this.email) {
                this.errorMessage = "A mezők kitöltése kötelező!"
                return
            }

            let newUser = {
                username: this.username,
                password: this.password,
                email: this.email
            };

            this.errorMessage = undefined;

            let resp = await fetch(`${process.env.BACKEND_URL}/auth/signup`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(newUser)
            });
            if(resp.ok) {
                let token = await resp.json();
                this.redirectToMyRecipes(token);
            }
            else {
                this.errorMessage = "Foglalt felhasználónév vagy email cím!";
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

.signUpBox {
    position: relative;
    height: 26em;
    width: 20em;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    background: rgba(255, 255, 255, 0.9);
    border-radius: 0.9em;
    padding: 3em 1.5em;
    z-index: 10;

    @include tablet {
        margin-left: 0;
        font-size: 24px;
    }

    @include tabletS {
        margin-left: 0;
        margin-bottom: 120px;
    }

    @include mobile {
        max-width: 100%;
        font-size: 16px;
    }


    h3 {
        text-transform: uppercase;
        font-size: 1.5em;
        letter-spacing: 0.08em;
        color: $black;
        margin-bottom: 1.5em;
        opacity: 0.8;

        @include mobile {
          font-size: 1.3em;
        }
    }

    .inputBox {
        position: relative;
        width: 100%;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
    }

    input {
        position: relative;
        width: 100%;
        margin-bottom: 1.5em;
        font-size: 1.1em;
        font-weight: 500;
        color: $white;
        border: none;
        outline: none;
        border-radius: 0.9em;
        padding: 0.3em 0.9em;
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

    .signUpBtn {
        position: relative;
        width: 100%;
        margin-bottom: 1.25em;
        font-size: 1.1em;
        font-weight: 600;
        letter-spacing: 0.13em;
        border: none;
        outline: none;
        border-radius: 0.9em;
        padding: 0.3em 0.9em;
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

    .errorMessage {
        top: 7em;
        @include errorMessage;
    }

    .passwordBox {
        position: relative;
        width: 100%;
        margin-bottom: 1.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        border: none;
        outline: none;
        border-radius: 0.9em;
        background: rgba(0,0,0,0.25);
        box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1),
                    0 -2px 8px rgba(0,0,0,0.05),
                    inset 0 -2px 8px rgba(255,255,255,0.2),
                    inset 0 5px 12px rgba(0, 0, 0, 0.1);

        input {
          margin-bottom: 0;
          padding: 0.3em 0.9em;
          box-shadow: none;
          background: transparent;
        }

        ion-icon {
          margin: 0 0.9em;
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

</style>