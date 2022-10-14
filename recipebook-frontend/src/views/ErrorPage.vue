<template>
    <section class="errorPage">
        <div class="imgBox">
            <img src="../../public/sorry.png" alt="sad emoji">
        </div>
        <div class="textBox">
            <h1>Hoppá!</h1>
            <h2>Úgy tűnik, valami hiba történt a művelet végrehajtása során.</h2>
            <router-link class="backBtn" to="/myrecipes"><ion-icon name="arrow-back-outline"></ion-icon> Vissza a főoldalra!</router-link>
        </div>
    </section>
</template>

<style lang="scss" scoped>
    .errorPage {
        position: relative;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $white;
        padding: 6.25em;

        @include tablet {
            flex-direction: column;
            padding: 3.1em 1.9em;
            padding-top: 2em;
        }

        .imgBox {
            position: relative;
            max-width: 15.6em;
            margin-right: 6.25em;

            @include tablet {
                margin-right: 0;
                max-width: 9.3em;
                margin-bottom: 1.5em;
            }

            img {
                position: relative;
                width: 100%;
                height: 100%;
            }
        }

        .textBox {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            text-align: center;
            max-width: 37.5em;

            @include tablet {
                width: 100%;
                max-width: 100%;
            }

            h1 {
                color: $main1hover;
                font-size: 3em;
                margin-bottom: 0.8em;

                @include tablet {
                    font-size: 2em;
                    font-weight: 800;
                    text-transform: uppercase;
                    letter-spacing: 0.06em;
                    margin-bottom: 0.5em;
                }
            }

            h2 {
                color: $black;
                font-size: 1.5em;
                margin-bottom: 3.1em;

                @include tablet {
                    font-size: 1.1em;
                    margin-bottom: 2em;
                }
            }

            .backBtn {
                text-decoration: none;
                font-size: 1.2em;
                font-weight: 600;
                padding: 0.5em 1.9em;
                border-radius: 0.5em;
                color: $main1;
                background: $black;
                cursor: pointer;
                transition: 0.3s ease-in-out;
                display: flex;
                justify-content: center;
                align-items: center;

                ion-icon {
                    margin-right: 0.8em;
                    font-size: 1.3em;
                }

                &:hover {
                    transform: scale(1.1);
                }

                @include tablet {
                    font-size: 0.9em;
                    padding: 0.4em 1.7em;
                    
                    &:hover {
                        transform: none;
                    }
                }
            }
        }
    }
</style>