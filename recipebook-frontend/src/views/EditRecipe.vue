<template>
    <section class="editRecipePage">
        <Popup v-if="isActivePopup"
        @closePopup="closePopup()"
        :popupTitle = "popupTitle" :popupMessage = "popupMessage"/>
        <Navigation/>
        <div class="mainContent">
            <h2 class="mainTitle">Recept módosítása</h2>
            <RecipeEditor v-if="isLoaded"
                        @changeFilterList="refreshFilters($event)" 
                        @changeRecipe="refreshRecipe($event)"
                        @uploadImage="refreshImage($event)"
                        :recipeTitle="recipeTitle" :recipeTime="recipeTime" :ingredients="ingredients" :elkeszites="elkeszites" :picture="picture" :tagIds="actualChoosedFilterIds"/>
            <div class="submitButtons">
                <button class="submitBtn" @click="updateRecipe()">Módosítás</button>
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
import { toRaw } from '@vue/reactivity'

export default {
    name: 'EditRecipe',
    components: {
        WaveFooter, Navigation, RecipeEditor, Popup
    },
    data() {
        return {
            actualChoosedFilterIds: [],
            recipeId: undefined,
            recipeTitle: '',
            recipeTime: undefined,
            elkeszites: '',
            ingredients: [],
            picture: 'grill.jpg',
            actualRecipe: {},
            isLoaded: false,
            recipeImage: undefined,
            isModified: false,
            isActivePopup: false,
            popupTitle: "A mezők kitöltése kötelező!",
            popupMessage: "Kérlek ellenőrizd, hogy minden adatot megadtál -e!"
        }
    },
    methods: {
        refreshRecipe(changedRecipe) {
            this.actualRecipe = changedRecipe;
            this.isModified = true;
        },
        refreshImage(changedImage) {
            this.recipeImage = changedImage;
            this.isModified = true;
        },
        refreshFilters(changedFilter) {
            this.actualChoosedFilterIds = changedFilter;
            this.isModified = true;
        },
        openPopup() {
            this.isActivePopup = true;
            document.documentElement.style.overflow = "hidden";
        },
        closePopup() {
            this.isActivePopup = false;
            document.documentElement.style.overflow = "auto";
        },
        async getRecipe(id) {
            let resp = await fetch(`${process.env.VUE_APP_BACKEND_URL}/recipes/singleRecipe?id=${id}`, {
                method: 'GET',
                credentials: 'include'
            });
            if(resp.ok) {
                let recipeResp = await resp.json();
                return recipeResp;
            }
            else {
                throw new Error('Hiba az recept adatainak betöltése során.');
            }
        },
        redirectToRecipePage(id) {
            this.$router.push({path: `/recipe/${id}`});
        },
        async uploadImage(recipeId) {
            let formData = new FormData();
            formData.append('recipeImage', this.recipeImage);
            formData.append('recipeId', recipeId);
            let resp = await fetch(`${process.env.VUE_APP_BACKEND_URL}/recipes/uploadimage`, {
                method: 'POST',
                headers: {
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: formData
            });
            if(!resp.ok) {
                throw new Error('Hiba a kép feltöltésekor.');
            }
        },
        async updateRecipe() {
            if(!this.isModified) {
                this.redirectToRecipePage(this.recipeId);
                return;
            }
            if(this.isModified &&
                this.actualRecipe.recipeTitle &&
                this.actualRecipe.recipeTime &&
                this.actualRecipe.elkeszites &&
                this.actualRecipe.ingredientsList.length > 0) {
                    this.$store.commit('startLoading');
                    let resp = await fetch(`${process.env.VUE_APP_BACKEND_URL}/recipes/recipe`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json'
                        },
                        credentials: 'include',
                        body: JSON.stringify({
                            recipe: {recipeId: this.recipeId, ...this.actualRecipe},
                            tags: this.actualChoosedFilterIds
                        })
                    });
                    if(resp.ok) {
                        try {
                            if(this.recipeImage){
                                await this.uploadImage(this.recipeId);
                            }
                            this.redirectToRecipePage(this.recipeId); 
                        }
                        catch(ex) {
                            this.$router.push({path: '/error'});
                        }
                    }
                    else {
                        this.$router.push({path: '/error'});
                    }
                    this.$store.commit('stopLoading');
            }
            else {
                this.openPopup();
            }
        },
        cancel() {
            this.redirectToRecipePage(this.recipeId);
        }
    },
    async created() {
        this.$store.commit('startLoading');
        try {
            let recipeResp = await this.getRecipe(this.$route.params.id);
            this.recipeId = recipeResp.recipe.id;
            this.recipeTitle = recipeResp.recipe.title;
            this.recipeTime = recipeResp.recipe.elkeszitesi_ido;
            this.elkeszites = recipeResp.recipe.elkeszitesi_mod;
            this.ingredients = recipeResp.recipe.hozzavalok.split(',');
            this.picture = recipeResp.recipe.picture;
            this.actualChoosedFilterIds = recipeResp.tags.map((tag) => {
                return tag.tag_id;
            });
            this.isLoaded = true;
        }
        catch(ex) {
            this.$router.push({path: '/error'});
        }
        this.$store.commit('stopLoading');
    }
}
</script>

<style lang="scss" scoped>

.editRecipePage {
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
                padding-bottom: 400px;
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