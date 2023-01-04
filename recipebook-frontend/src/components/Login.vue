<template>
    <div class="loginBox">
        <h3>Lépj be!</h3>
        <div class="inputBox">
            <span class="errorMessage">{{errorMessage}}</span>
            <input name="username" type="text" v-model="username" @keyup.enter="login()" placeholder="Felhasználónév">
            <input name="password" type="password" v-model="password" @keyup.enter="login()" placeholder="Jelszó">
            <button class="loginBtn" @click="login()">Belépés</button>
        </div>
        <p>Még nem regisztráltál? <span @click="$emit('registrationToggle')">Kattints ide!</span></p>
    </div>
</template>

<script>
export default {
    name: 'Login',
    emits: ['registrationToggle'],
    data() {
        return {
            username: undefined,
            password: undefined,
            errorMessage: undefined
        }
    },
    methods: {
        async login() {
            let userData = {
                username: this.username,
                password: this.password
            };
            let resp = await fetch(`${process.env.BACKEND_URL}/auth/login`, {
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify(userData)
            });
            switch(resp.status) {
                case 200: 
                    let token = await resp.json();
                    this.redirectToMyRecipes(token);
                    break;
                case 403:
                    this.errorMessage = "Hibás felhasználónév vagy jelszó!";
                    break;
                default: 
                    this.errorMessage = "Bejelentkezés sikertelen! Próbálja újra.";
                    break;
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

.loginBox {
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

    .loginBtn {
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
        top: 8em;
        @include errorMessage;
    }
}

</style>