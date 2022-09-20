<template>
    <section class="newRecipePage">
        <Popup v-if="isActivePopup"
        @closePopup="closePopup()"
        :popupTitle = "popupTitle" :popupMessage = "popupMessage"/>
        <Navigation/>
        <div class="mainContent">
            <h2 class="mainTitle">Új recept létrehozása</h2>
            <RecipeEditor @changeFilterList="actualChoosedFilterIds = $event"
                            @changeRecipe="newRecipe = $event" picture = "grill.jpg"
                            @uploadImage="recipeImage = $event"/>
            <div class="submitButtons">
                <button class="submitBtn" @click="saveNewRecipe()">Mentés</button>
                <button class="cancelBtn" @click="cancel()">Mégse</button>
            </div>
        </div>
        <WaveFooter/>
    </section>
</template>

<script>
    import WaveFooter from '../components/WaveFooter.vue'
    import Navigation from '../components/Navigation.vue'
    import RecipeEditor from '../components/RecipeEditor.vue'
    import Popup from '../components/Popup.vue'

export default {
    name: 'NewRecipe',
    components: {
        WaveFooter, Navigation, RecipeEditor, Popup
    },
    data() {
        return {
            newRecipe: {},
            actualChoosedFilterIds: [],
            recipeImage: undefined,
            isActivePopup: false,
            popupTitle: 'A mezők kitöltése kötelező!',
            popupMessage: 'Új recept létrehozásához töltsd ki az összes mezőt és adj hozzá képet.'
        }
    },
    methods: {
        openPopup() {
            this.isActivePopup = true
            document.documentElement.style.overflow = "hidden";
        },
        closePopup() {
            this.isActivePopup = false
            document.documentElement.style.overflow = "auto";
        },
        async uploadImage(recipeId) {
            let token = localStorage.getItem('token');
            let formData = new FormData()
            formData.append('recipeImage', this.recipeImage)
            formData.append('recipeId', recipeId)
            console.log(this.recipeImage)
            await fetch('http://localhost:3000/recipes/uploadimage', {
                method: 'POST',
                headers: {
                            /*'Content-Type': 'multipart/form-data',*/
                            'Authorization': 'Bearer ' + token,
                            'Accept': 'application/json'
                        },
                body: formData
            })

        },
        saveNewRecipe() {
            if(this.newRecipe.recipeTitle &&
                this.newRecipe.recipeTime &&
                this.newRecipe.elkeszites &&
                this.recipeImage &&
                this.newRecipe.ingredientsList.length > 0) {
                    this.$store.commit('startLoading')
                    let token = localStorage.getItem('token');
                    fetch('http://localhost:3000/recipes/recipe', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Authorization': 'Bearer ' + token
                        },
                        body: JSON.stringify({
                            newRecipe: this.newRecipe,
                            newRecipeTags: this.actualChoosedFilterIds
                        })
                    }).then((resp) => {
                        return resp.json()
                        /*this.$store.commit('stopLoading')
                        if(resp.ok) {
                            this.$router.push({path: '/myrecipes'});
                        }*/
                    }).then( async (recipeData) => {
                        await this.uploadImage(recipeData.recipeId)
                        this.$store.commit('stopLoading')
                        this.$router.push({path: '/myrecipes'})
                    })
            }
            else {
                this.openPopup()
            }
        },
        cancel() {
            this.$router.push({path: '/myrecipes'});
        }
    }
}
</script>

<style lang="scss" scoped>

.newRecipePage {
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
        padding: 90px 80px;
        padding-bottom: 250px;
        background: $white;

        @include tablet {
                padding: 90px 30px;
                padding-bottom: 250px;
            }

            @include tabletS {
                padding: 90px 25px;
                padding-bottom: 345px;
            }

            @include mobile {
                padding: 90px 20px;
                padding-bottom: 360px;
            }

        .mainTitle {
            color: $black;
            margin: 30px 0;
            letter-spacing: 1px;
            text-transform: uppercase;

            @include mobile {
                font-size: 1.3em;
            }
        }

        .submitButtons {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;

            button {
                border: none;
                outline: none;
                font-size: 1.2em;
                font-weight: 600;
                padding: 5px 25px;
                border-radius: 5px;
                cursor: pointer;
                transition: 0.3s ease-in-out;

                &:hover {
                    transform: scale(1.1);
                }
            }

            .submitBtn {
               margin-right: 20px;
               color: $main1;
               background: $black;
            }

            .cancelBtn {
                color: $black;
                background: $main1;
            }
        }
    }
}

</style>