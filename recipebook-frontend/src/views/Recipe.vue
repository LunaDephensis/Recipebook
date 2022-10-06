<template>
    <section class="recipePage">
        <div class="popUpBox" v-if="isActivePopup">
        <div class="popUp">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <h2 class="popUpTitle">Biztosan törlöd a receptet?</h2>
            <p class="popUpMessage">A művelet nem visszavonható. Ha nem szeretnéd törölni a receptet, kattints a "Mégse" gombra.</p>
            <div class="popUpButtons">
                <button class="popUpBtn deleteBtn" @click="deleteRecipe(recipe.id)">Törlés</button>
                <button class="popUpBtn cancelBtn" @click="popUpToggle()">Mégse</button>
            </div>
        </div>
    </div>
        <Navigation :recipesCount="totalRecipesCount"/>
        <div class="mainContent">
            <div class="editorMenu">
                <h2 class="recipeTitle">{{ recipe.title }}</h2>
                <div class="editor">
                    <button @click="redirectToRecipeEditor(recipe.id)"><ion-icon name="pencil-sharp"></ion-icon></button>
                    <button @click="popUpToggle()"><ion-icon name="trash-outline"></ion-icon></button>
                </div>
            </div>
            <div class="recipeInfo">
                <span class="time"><ion-icon name="hourglass"></ion-icon>{{ recipe.elkeszitesi_ido}} perc</span>
                <div class="recipeTags">
                    <span v-for="tag in tags" :key="tag.tag_id">{{ tag.title }}</span>
                </div>
            </div>
            <div class="recipeDetails">
                <div class="imgBox">
                    <img :src="createImageURL(recipe.picture)">
                </div>
                <div class="ingredients">
                    <div class="wave"></div>
                    <h3>Hozzávalók</h3>
                    <ul>
                        <li v-for="(ingredient, i) in ingredients" :key="i">{{ ingredient }}</li>
                    </ul>
                </div>
                <div class="elkeszites">
                    <h3>Elkészítés</h3>
                    <p v-for="(bekezdes, i) in elkeszitesBekezdesek" :key="i">{{bekezdes}}</p>
                </div>
            </div>
        </div>
        <WaveFooter/>
    </section>
</template>

<script>
    import WaveFooter from '../components/WaveFooter.vue'
    import Navigation from '../components/Navigation.vue'
    import {useCreateImage} from '../composables/createImage'
    import {useGetTotalRecipesCount} from '../composables/totalRecipesCounter'

    export default {
        name: 'Recipe',
        components: {
            WaveFooter, Navigation
        },
        setup() {
            let createImage = useCreateImage()
            let totalRecipesCounter = useGetTotalRecipesCount()
            return { ...createImage, ...totalRecipesCounter }
        },
        data() {
            return {
                recipe: {},
                tags: [],
                ingredients: [],
                elkeszitesBekezdesek: [],
                isActivePopup: false
            }
        },
        methods: {
            popUpToggle() {
                this.isActivePopup = !this.isActivePopup
            },
            redirectToRecipeEditor(id) {
                this.$router.push({path: `/recipe/edit/${id}`});
            },
            async getRecipe(id) {
                let token = localStorage.getItem('token');
                let resp = await fetch(`${process.env.BACKEND_URL}/recipes/singleRecipe?id=${id}`, {
                    method: 'GET',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                let recipeResp = await resp.json();
                return recipeResp;
            },
            async deleteRecipe(id) {
                console.log('frontend');
                let token = localStorage.getItem('token');
                let resp = await fetch(`${process.env.BACKEND_URL}/recipes/recipe?id=${id}`, {
                    method: 'DELETE',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    }
                });
                if(resp.ok) {
                    this.$router.push({path: `/myrecipes`});
                }
            }
        },
        async created() {
            this.$store.commit('startLoading')
            let recipeResp = await this.getRecipe(this.$route.params.id);
            this.recipe = recipeResp.recipe
            this.tags = recipeResp.tags
            this.ingredients = this.recipe.hozzavalok.split(',')
            this.elkeszitesBekezdesek = this.recipe.elkeszitesi_mod.split('\n').map((bekezdes) => {
                return bekezdes.trim()
            })
            this.$store.commit('stopLoading')
        }
    }
</script>

<style lang="scss" scoped>

    .recipePage {
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
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            padding: 5.6em 5em;
            padding-bottom: 250px;
            background: $white;

            @include tablet {
                padding: 5.6em 1.9em;
                padding-bottom: 250px;
            }

            @include tabletS {
                padding: 5.6em 1.5em;
                padding-bottom: 345px;
            }

            @include mobile {
                padding: 5.6em 1.25em;
                padding-bottom: 345px;
            }
        }

        .editorMenu {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            margin-bottom: 1.25em;

            @include mobile {
                align-items: flex-start;
            }

            .recipeTitle {
                font-size: 2.5em;
                font-weight: 600;
                color: $black;
                word-break: break-all;
                flex-wrap: wrap;

                @include tablet {
                    font-size: 2.2em;
                }

                @include tabletS {
                    margin-bottom: 0.3em;
                }

                @include mobile {
                    font-size: 1.8em;
                }
            }

            .editor {
                position: relative;
                display: flex;
                justify-content: center;
                align-items: center;

                @include mobile {
                    flex-direction: column;
                }

                button {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 0.5em;
                    border: none;
                    outline: none;
                    border-radius: 50%;
                    background: rgba(0,0,0,0.7);
                    color: $main1;
                    cursor: pointer;
                    margin-left: 0.9em;
                    opacity: 0.9;
                    z-index: 100;

                    &:hover {
                        opacity: 1;
                    }

                    @include mobile {
                        margin-left: 0.6em;
                    }

                    &:nth-child(1) {
                        @include mobile {
                            margin-bottom: 0.6em;
                        }
                    }

                    ion-icon {
                        font-size: 1.5em;
                        --ionicon-stroke-width: 40px;
                        z-index: 9;
                    }
                }
            }
        }

        .recipeInfo {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            margin-bottom: 1.25em;

            .time {
                font-size: 1em;
                font-weight: 500;
                color: $black;
                background: $main2light;
                padding: 0.2em 0.5em;
                border-radius: 0.5em;
                margin-right: 0.6em;
                display: flex;
                justify-content: center;
                align-items: center;

                @include mobile {
                    font-size: 0.9em;
                }

                ion-icon {
                    margin-right: 0.25em;
                    margin-bottom: 0.12em;
                    --ionicon-stroke-width: 55px;
                }
            }

            .recipeTags {
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;

                span {
                    font-size: 1em;
                    font-weight: 500;
                    color: $black;
                    background: $main1light;
                    padding: 0.2em 0.5em;
                    border-radius: 0.5em;
                    margin-right: 0.3em;

                    @include mobile {
                        font-size: 0.9em;
                    }
                }
            }
        }

        .recipeDetails {
            position: relative;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            grid-template-rows: auto auto;
            column-gap: 1.9em;

            @include tablet {
                column-gap: 1.5em;
            }

            @include tabletS {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
                column-gap: 0;
            }

            .imgBox {
                position: relative;
                grid-column: 1/3;
                grid-row: 1/2;
                min-width: 500px;
                width: 100%;
                max-width: 700px;
                min-height: 360px;
                height: 100%;
                max-height: 460px;
                margin-bottom: 1.5em;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 0.5em;
                overflow: hidden;

                @include tablet {
                    min-width: 250px;
                    min-height: 180px;
                }

                @include tabletS {
                    min-width: 100%;
                    min-height: 100%;
                }

                img {
                    position: relative;
                    width: 100%;
                    height: 100%;
                }
            }

            .ingredients {
                position: relative;
                grid-column: 3/4;
                grid-row: 1/3;
                justify-self: center;
                align-self: start;
                background: $main1;
                width: 100%;
                max-width: 100%;
                padding: 0.6em 1.9em 1.9em;
                margin-top: 2.5em;
                border-bottom-right-radius: 0.4em;
                border-bottom-left-radius: 0.4em;

                @include tabletS {
                    background: $white;
                    margin-top: 0;
                    padding: 0 0 1.5em;
                }

                .wave {
                    position: absolute;
                    top: -45px;
                    left: 0;
                    width: 100%;
                    height: 50px;
                    background: url(../../public/images/wave3.png);
                    background-size: 180% 50px;
                    background-repeat: no-repeat;
                    overflow: hidden;

                    @include tabletS {
                        display: none;
                    }
                }

                h3 {
                    color: $black;
                    font-size: 1.8em;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    margin-bottom: 1.25em;

                    @include tablet {
                        font-size: 1.6em;
                    }

                    @include tabletS {
                        color: $main1hover;
                        font-size: 2em;
                    }

                    @include mobile {
                        font-size: 1.5em;
                        font-weight: 800;
                    }
                }

                ul {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: flex-start;
                    flex-direction: column;

                    @include tabletS {
                        padding-left: 2.2em;
                    }

                    li {
                        position: relative;
                        list-style: none;
                        color: $black;
                        width: 100%;
                        padding: 0.3em 0;
                        font-weight: 500;
                        margin-left: 1em;

                        @include tabletS {
                            font-size: 1.2em;
                        }

                        @include mobile {
                            font-size: 1.1em;
                        }

                        &::before {
                            content: '\2022';
                            color: $blackborder;
                            display: inline-block;
                            font-size: 1.3em;
                            width: 1em;
                            margin-left: -1em;

                            @include tabletS {
                                color: $main1hover;
                            }
                        }
                    }
                }
            }
            
            .elkeszites {
                position: relative;
                grid-column: 1/3;
                grid-row: 2/3;
                padding: 1.25em 0;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;

                h3 {
                    color: $black;
                    font-size: 1.8em;
                    font-weight: 600;
                    letter-spacing: 0.06em;
                    margin-bottom: 1.25em;

                    @include tablet {
                        font-size: 1.6em;
                    }

                    @include tabletS {
                        font-size: 2em;
                        color: $main2;
                    }

                    @include mobile {
                        font-size: 1.5em;
                        font-weight: 800;
                    }
                }

                p {
                    color: $black;
                    margin-bottom: 0.75em;
                }
            }
        }

        .popUpBox {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100vh;
        display: flex;
        justify-content: center;
        align-items: center;
        background: $blackborder;
        z-index: 1000000;
        }

        .popUp {
            position: relative;
            width: 37.5em;
            min-height: 15.6em;
            height: auto;
            background: $white;
            border-radius: 1.1em;
            display: flex;
            justify-content: flex-start;
            align-items: center;
            flex-direction: column;
            padding: 1.5em 1.25em;

            @include tabletS {
                max-width: 100%;
                margin: 0 1.25em;
            }

            ion-icon {
                font-size: 2.5em;
                color: $errorMessage;
                margin-bottom: 0.6em;
            }

            h2 {
                color: $errorMessage;
                font-weight: 600;
                margin-bottom: 0.9em;
                text-align: center;

                @include mobile {
                    font-size: 1.2em;
                }
            }

            .popUpMessage {
                color: $black;
                font-weight: 500;
                line-height: 1.1em;
                text-align: center;

                @include mobile {
                    font-size: 0.9em;
                }
            }

            .popUpButtons {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: center;
                margin: 1.25em 0;

                @include mobile {
                    flex-direction: column;
                }
            }

            .popUpBtn {
                font-size: 1.6em;
                font-weight: 600;
                letter-spacing: 0.12em;
                padding: 0.5em 1.5em;
                border: none;
                border-radius: 0.6em;
                background: $main1;
                color: $black;
                cursor: pointer;

                &:hover {
                    background: $main1hover;
                    color: $white;
                }

                @include mobile {
                    font-size: 1.5em;
                }

                &.deleteBtn {
                    margin-right: 1.25em;
                    color: $main1;
                    background: $black;

                    @include mobile {
                        margin-right: 0;
                        margin-bottom: 1.25em;
                    }

                    &:hover {
                        color: $main1hover;
                        background: #222;
                    }
                }

                &.cancelBtn {
                    color: $black;
                    background: $main1;

                    &:hover {
                        color: $white;
                        background: $main1hover;
                    }
                }
            }
        }
    }

</style>