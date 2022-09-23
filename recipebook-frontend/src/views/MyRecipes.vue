<template>
    <section class="myrecipes">
        <Navigation :recipesCount="totalRecipesCount"/>
        <div class="bannerAndSearch" id="bannerAndSearch">
            <div class="searchAndFilter">
                <div class="searchBox">
                    <input type="text" class="searchInput" v-model="searchInputText">
                    <ion-icon name="search"></ion-icon>
                </div>
                <div class="filterBox">
                    <div class="filtered">
                        <span v-for="choosedFilter in actualChoosedFilters"
                        :key="choosedFilter.id"
                        @click="filterChoosing(choosedFilter)">
                            {{ choosedFilter.title }} 
                            <ion-icon name="close"></ion-icon>
                        </span>
                    </div>
                    <FilterMenu :actualFilters="actualFilterList"
                                @selectFilter="filterChoosing($event)"/>
                </div>
                <div class="timeFilter">
                    <span class="timeTitle"
                    :class="{active : isActiveTimeList}"
                    @click="timeListToggle()">Max. elkészítési idő: 
                        <span class="choosedTime">{{ actualChoosedTime }}</span>
                        <ion-icon name="chevron-down-outline"></ion-icon>
                    </span>
                    <ul v-if="isActiveTimeList" class="times">
                        <li class="time" @click="timeChoosingAndToggle(null)">nincs</li>
                        <li class="time" 
                        v-for="cookingTime in cookingTimes" :key="cookingTime"
                        @click="timeChoosingAndToggle(cookingTime)">{{ cookingTime }} perc</li>
                    </ul>
                </div>
                <button class="searchBtn"
                    @click="searchRecipes()">
                    Recept keresése
                </button>
            </div>
        </div>
        <div class="mainContent">
            <div class="wave"></div>
            <div class="lastRecipes" id="lastRecipes" v-if="totalRecipesCount > 3">
                <h2>Legutóbbi receptjeid</h2>
                <div class="recipes">
                    <div class="recipeCard" v-for="lastRecipe in lastRecipes" :key="lastRecipe.id"
                        @click="redirectToRecipePage(lastRecipe.id)">
                        <div class="imgBox">
                            <img :src="createImageURL(lastRecipe.picture)">
                        </div>
                        <div class="textBox">
                            <h3>{{ lastRecipe.title }}</h3>
                            <div class="infoBox">
                                <span class="recipeTime"><ion-icon name="hourglass"></ion-icon> {{ lastRecipe.elkeszitesi_ido }} perc</span>
                                <div class="recipeFilters">
                                    <span class="recipeFilter"
                                        v-for="tag in lastRecipe.tags" :key="tag.id">{{ tag.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="allRecipes" id="allRecipes">
                <h2>Összes recepted</h2>

                <div class="addNewRecipe" v-if="totalRecipesCount === 0">
                    <h3>A recepttárad most még üres</h3>
                    <p>Adj hozzá új recepteket, hogy később bárhonnan könnyedén elérhesd őket!</p>
                    <router-link to="/newrecipe" class="newRecipeBtn">Új recept hozzáadása</router-link>
                </div>
                
                <div class="recipes">
                    <TransitionGroup name="recipesTransition">
                    <div v-for="recipe in actualRecipes" :key="recipe.id" class="recipeCard"
                        @click="redirectToRecipePage(recipe.id)">
                        <div class="imgBox">
                            <img :src="createImageURL(recipe.picture)">
                        </div>
                        <div class="textBox">
                            <h3>{{ recipe.title }}</h3>
                            <div class="infoBox">
                                <span class="recipeTime"><ion-icon name="hourglass"></ion-icon> {{ recipe.elkeszitesi_ido }} perc</span>
                                <div class="recipeFilters">
                                    <span class="recipeFilter"
                                        v-for="tag in recipe.tags" :key="tag.id">{{ tag.title }}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                    </TransitionGroup>
                </div>
                
                <button class="tovabbiReceptekBtn" @click="nextPage()"
                    v-if="actualRecipesCount - actualRecipes.length > 0">
                        További receptek betöltése
                </button>
            </div> 
        </div>
        <WaveFooter/>
    </section>
</template>

<script>

import WaveFooter from '../components/WaveFooter.vue'
import Navigation from '../components/Navigation.vue'
import FilterMenu from '../components/FilterMenu.vue'
import {useCreateImage} from '../composables/createImage'
import {useGetTotalRecipesCount} from '../composables/totalRecipesCounter'

export default {
    name: 'MyRecipes',
    components: {
        WaveFooter, Navigation, FilterMenu
    },
    setup() {
        let createImage = useCreateImage()
        let totalRecipesCounter = useGetTotalRecipesCount()
        return { ...createImage, ...totalRecipesCounter }
    },
    data() {
        return {
            isActiveFilterList: false,
            isActiveTimeList: false,
            choosedTime: null,
            cookingTimes: [30, 60, 90, 120, 180],
            actualRecipes: [],
            lastRecipes: [],
            pageCounter: 0,
            actualRecipesCount: 0,
            filterList: [],
            searchInputText: undefined 
        }
    },
    methods: {
        filterChoosing(actualItem) {
           let actualFilter =  this.filterList.find((listItem) => {
                return actualItem.id === listItem.id
            })
            actualFilter.choosed = !actualFilter.choosed
        },
        timeListToggle() {
            this.isActiveTimeList = !this.isActiveTimeList
        },
        timeChoosingAndToggle(time) {
            this.choosedTime = time
            this.timeListToggle()
        },
        async getRecipes() {
            let token = localStorage.getItem('token');
            let recipeURL = this.createRecipesURL();
            let resp = await fetch(recipeURL, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let recipes = await resp.json();
            return recipes;
        },
        async nextPage() {
            this.pageCounter++
            let res = await this.getRecipes()
            let newPage = res.recipes
            this.actualRecipesCount = res.count
            this.actualRecipes.push(...newPage)
        },
        async getLastRecipes() {
            let token = localStorage.getItem('token');
            let resp = await fetch(`${process.env.BACKEND_URL}/recipes/lastrecipes`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let lastRecipes = await resp.json();
            return lastRecipes;
        },
        async getUserTags() {
            let token = localStorage.getItem('token');
            let resp = await fetch(`${process.env.BACKEND_URL}/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let tags = await resp.json();
            return tags;
        },
        async searchRecipes() {
            this.pageCounter = 0;
            let res = await this.getRecipes();
            this.actualRecipes = res.recipes
            this.actualRecipesCount = res.count
            this.$router.push({name: 'MyRecipes', hash: `#allRecipes`})
        },
        redirectToRecipePage(id) {
            this.$router.push({path: `/recipe/${id}`});
        },
        createRecipesURL() {
            let searchURL = `${process.env.BACKEND_URL}/recipes?page=${this.pageCounter}`;
            if(this.searchInputText) {
                searchURL += `&title=${this.searchInputText}`;
            }
            if(this.choosedTime !== null) {
                searchURL += `&time=${this.choosedTime}`;
            }
            let choosedTags = this.filterList.filter((tag) => {
                return tag.choosed;
            }).map((choosedTag) => {
                return choosedTag.id;
            });
            if(choosedTags) {
               let tags = choosedTags.join(',');
               searchURL += `&tags=${tags}`;
            }
            return searchURL;
        }

    },
    computed: {
        actualFilterList() {
            return this.filterList.filter((item) => {
                return item.choosed === false
            })
        },
        actualChoosedFilters() {
            return this.filterList.filter((item) => {
                return item.choosed === true
            })
        },
        actualChoosedTime() {
            if(this.choosedTime === null) {
                return 'nincs'
            }
            else {
                return this.choosedTime + ' perc'
            }
        }
    },
    async created() {
        this.$store.commit('startLoading')
        let res = await this.getRecipes()
        this.actualRecipes = res.recipes
        this.actualRecipesCount = res.count
        this.lastRecipes = await this.getLastRecipes()
        let tagsResp = await this.getUserTags()
        this.filterList = tagsResp.map((tag) => {
            tag.choosed = false
            return tag
        });
        this.$store.commit('stopLoading')
    }
}
</script>

<style lang="scss" scoped>

.myrecipes {
    position: relative;
    width: 100%;
    min-height: 100vh;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
}

.bannerAndSearch {
    position: relative;
    width: 100%;
    height: 36.9em;
    background: url(../../public/images/logmac6.png);
    background-position: center;
    background-repeat: no-repeat;
    background-size: cover;
    padding: 0 5em;
    padding-top: 5em;
    display: flex;
    justify-content: flex-start;
    align-items: center;

    @include tablet {
        padding: 0 1.9em;
    }

    @include tabletS {
        padding: 0 1.5em;
        justify-content: center;
    }

    .searchAndFilter {
        position: relative;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        width: 37.5em;
        max-width: 37.5em;

        @include tabletS {
            width: 100%;
            max-width: 36.25em;
        }

        .searchBox {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            padding: 0.5em 1.25em;
            border-radius: 0.6em;
            background: $white;
            margin-bottom: 1.5em;

            .searchInput {
                width: 100%;
                background: transparent;
                border: none;
                outline: none;
                color: $main2;
                font-weight: 500;
            }

            ion-icon {
                color: $black;
                opacity: 0.7;
                margin-left: 0.6em;
            }
        }

        .filterBox {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: flex-end;
            align-items: center;
            margin-bottom: 1.5em;

            @include mobile {
                flex-direction: column-reverse;
            }

            .filtered {
                position: relative;
                width: 100%;
                display: flex;
                justify-content: flex-end;
                align-items: center;
                flex-wrap: wrap;

                @include mobile {
                    justify-content: center;
                    margin-top: 0.9em;
                }

                span {
                    position: relative;
                    background: rgba(255, 255, 255, 0.8);
                    padding: 0.2em 0.5em;
                    margin: 0.06em 0;
                    border-radius: 0.5em;
                    margin-right: 0.3em;
                    font-size: 0.9em;
                    font-weight: 500;
                    color: $black;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2),
                                0 -2px 8px rgba(0,0,0,0.05);

                    ion-icon {
                        margin-left: 0.2em;
                        cursor: pointer;
                        padding: 0.2em;
                        border-radius: 50%;
                        background: rgba(255, 255, 255, 0.5);

                        &:hover {
                            background: $white;
                        }
                    }
                }
            }

            /*.filterMenu {
                position: relative;
                .filterBtn {
                    height: 2em;
                    width: 12.3em;
                    font-size: 0.9em;
                    padding: 0.4em 1.5em;
                    background: $main2light;
                    color: $black;
                    font-weight: 600;
                    border: none;
                    outline: none;
                    border-radius: 1.5em;
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2),
                                0 -2px 8px rgba(0,0,0,0.05);
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                    ion-icon {
                        font-size: 1.1em;
                        text-transform: none;
                        margin-left: 0.5em;
                        color: $black;
                        --ionicon-stroke-width: 3.4em;
                        transition: 0.3s;
                    }

                    &:hover {
                        background: $main2;
                        color: $white;

                        ion-icon {
                            color: $white;
                        }
                    }

                    &.active {
                        border-bottom-right-radius: 0;
                        border-bottom-left-radius: 0;

                        ion-icon {
                            transform: rotate(-45deg);
                        }
                    }
                }

                .filterList {
                    position: absolute;
                    top: 2em;
                    left: 0;
                    width: 100%;
                    background: $black;
                    border-bottom-left-radius: 1.5em;
                    border-bottom-right-radius: 1.5em;
                    overflow: hidden;
                    z-index: 101;

                    li {
                        list-style: none;
                        padding: 0.3em 1.25em;
                        cursor: pointer;
                        font-size: 0.9em;
                        font-weight: 600;
                        color: $white;

                        &:hover {
                            background: $main2light;
                            color: $black;
                        }
                    }
                }
            
            }*/
        }

        .timeFilter {
            position: relative;
            align-self: flex-end;
            margin-bottom: 1.5em;

            @include mobile {
                align-self: center;
            }

            .timeTitle {
                height: 2em;
                width: 17.5em;
                font-size: 0.9em;
                padding: 0.4em 0.9em;
                background: $main2light;
                color: $black;
                font-weight: 600;
                border: none;
                outline: none;
                border-radius: 1.5em;
                box-shadow: 0 5px 12px rgba(0, 0, 0, 0.2),
                            0 -2px 8px rgba(0,0,0,0.05);
                cursor: pointer;
                display: flex;
                justify-content: center;
                align-items: center;

                .choosedTime {
                    font-weight: 700;
                    margin: 0 0.3em;
                }

                ion-icon {
                    font-size: 1.1em;
                    text-transform: none;
                    margin-left: 0.5em;
                    color: $black;
                    --ionicon-stroke-width: 3.4em;
                    transition: 0.3s;
                }

                &:hover {
                        background: $main2;
                        color: $white;

                        ion-icon {
                            color: $white;
                        }
                    }

                    &.active {
                        border-bottom-right-radius: 0;
                        border-bottom-left-radius: 0;

                        ion-icon {
                            transform: rotate(90deg);
                        }
                    }
            }

            .times {
                position: absolute;
                top: 2em;
                left: 0;
                width: 100%;
                background: $black;
                border-bottom-left-radius: 1.5em;
                border-bottom-right-radius: 1.5em;
                overflow: hidden;
                z-index: 100;

                .time {
                    list-style: none;
                    padding: 0.3em 1.5em;
                    cursor: pointer;
                    font-size: 0.9em;
                    font-weight: 600;
                    color: $white;
                    text-align: center;

                    &:hover {
                        background: $main2light;
                        color: $black;
                    }
                }
            }
        }

        .searchBtn {
            position: relative;
            max-width: 25em;
            width: 100%;
            padding: 0.5em 0.9em;
            border-radius: 0.9em;
            border: none;
            font-size: 1.1em;
            font-weight: 500;
            background: $main1;
            color: $black;
            cursor: pointer;
            box-shadow: 0 3px 5px 5px rgba(0, 0, 0, 0.1);

            &:hover {
                background: $main1hover;
            }
        }
    }
}

.mainContent {
    position: relative;
    width: 100%;
    min-height: 100vh;
    background: $white;
    display: flex;
    justify-content: flex-start;
    align-items: center;
    flex-direction: column;
    padding: 3.1em 5em;
    padding-top: 0.6em;

    @include tablet {
        padding: 3.1em 3.1em;
        padding-top: 0.6em;
    }

    @include mobile {
        padding: 3.1em 1.25em;
        padding-top: 0.6em;
    }

    .wave {
      position: absolute;
      top: -100px;
      left: 0;
      width: 100%;
      height: 100px;
      background: url(../../public/images/wave3.png);
      background-size: 100% 100px;
      background-repeat: no-repeat;
      overflow: hidden;
      filter: brightness(0) invert(1);
    }
}

.lastRecipes {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    margin-bottom: 5em;

    h2 {
        color: $black;
        font-weight: 700;
        font-size: 1.5em;
        align-self: flex-start;
        margin-bottom: 1.5;
        text-transform: uppercase;
        letter-spacing: 0.06em;

        @include tabletS {
            align-self: center;
        }

        @include mobile {
            font-size: 1.2em;
        }
    }

    .recipes {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, calc(33% - 3.1em));
        justify-content: space-between;
        grid-gap: 3.1em;

        @include tablet {
            grid-template-columns: repeat(auto-fill, calc(50% - 1.9em));
            grid-gap: 1.9em;
        }

        @include tabletS {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 3.1em;
        }

        .recipeCard {
            .textBox {
                background: $main1;
                color: $black;
                box-shadow: 0 -10px 20px 0 rgba(0, 0, 0, 0.3);
            }
        }
    }
}

.recipesTransition-enter-active,
.recipesTransition-leave-active {
  transition: all 0.5s ease;
}
.recipesTransition-enter-from,
.recipesTransition-leave-to {
  opacity: 0;
  transform: translateX(-80px);
}

.allRecipes {
    position: relative;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    padding-bottom: 150px;

    @include tabletS {
        padding-bottom: 290px;
    }

    h2 {
        color: $black;
        font-weight: 700;
        font-size: 1.5em;
        align-self: flex-start;
        margin-bottom: 1.5em;
        text-transform: uppercase;
        letter-spacing: 0.06em;

        @include tabletS {
            align-self: center;
        }

        @include mobile {
            font-size: 1.2em;
        }
    }

    .addNewRecipe {
        position: relative;
        width: 100%;
        padding: 1.5em 1.9em;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;
        text-align: center;
        color: $main1;
        border: 0.5em solid $main1;
        border-radius: 1.25em;

        @include tabletS {
            padding: 0.9em 1.25em;
        }

        @include mobile {
            padding: 0.9em;
            border: 0.4em solid $main1;
        }

        h3 {
            text-transform: uppercase;
            margin-bottom: 0.6em;

            @include tabletS {
                font-size: 1.1em;
            }
        }

        p {
            margin-bottom: 1.25em;
        }

        .newRecipeBtn {
            font-size: 0.9em;
            position: relative;
            padding: 0.4em 1.5em;
            background: $main1;
            color: $black;
            text-transform: uppercase;
            text-decoration: none;
            letter-spacing: 0.06em;
            font-weight: 600;
            border: none;
            outline: none;
            border-radius: 1.5em;
            cursor: pointer;

            &:hover {
                background: $main1hover;
                color: $white;
            }

            @include tabletS {
                font-size: 0.8em;
                padding: 0.25em 0.9em;
            }
        }
    }

    .recipes {
        position: relative;
        width: 100%;
        display: grid;
        grid-template-columns: repeat(auto-fill, calc(33% - 3.1em));
        justify-content: space-between;
        grid-gap: 3.1em;
        margin-bottom: 3.1em;

        @include tablet {
            grid-template-columns: repeat(auto-fill, calc(50% - 1.9em));
            grid-gap: 1.9em;
        }

        @include tabletS {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-wrap: wrap;
            gap: 3.1em;
        }

    }

    .tovabbiReceptekBtn {
        position: relative;
        margin: 3.1em 0 1.5em 0;
        max-width: 25em;
        width: 100%;
        padding: 0.5em 0.9em;
        border-radius: 0.9em;
        border: none;
        font-size: 1.1em;
        font-weight: 500;
        background: $main1;
        color: $black;
        cursor: pointer;
        box-shadow: 0 3px 5px 5px rgba(0, 0, 0, 0.05);

        &:hover {
            background: $main1hover;
            color: $white;
        }

        @include tabletS {
            margin: 1.5em 0;
        }

        @include mobile {
            font-size: 0.9em;
            max-width: 21.9em;
        }
    }
}

.recipeCard {
    position: relative;
    width: 100%;
    height: 17.5em;
    display: flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    border-radius: 0.25em;
    color: white;
    overflow: hidden;
    cursor: pointer;

    @include tablet {
        width: 100%;
    }

    @include tabletS {
        width: 100%;
        max-width: 25em;
    }

    .imgBox {
        position: relative;
        width: 100%;
        height: 12.5em;
        display: flex;
        justify-content: center;
        align-items: center;
        overflow: hidden;

        img {
            position: absolute;
            top: 0;
            left: 0;
            width: 100%;
            height: 100%;
            object-fit: cover;
        }
    }

    .textBox {
        position: relative;
        width: 100%;
        height: 5em;
        background: $black;
        padding: 0.3em 1.25em;
        display: flex;
        justify-content: center;
        align-items: flex-start;
        flex-direction: column;
        box-shadow: 0 -10px 20px 0 rgba(255, 255, 255, 0.3);

        h3 {
            font-size: 1.1em;

            @include tablet {
                font-size: 0.9em;
            }
        }

        .infoBox {
            position: relative;
            width: 100%;
            display: flex;
            justify-content: space-between;
            align-items: center;

            .recipeTime {
                position: relative;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                font-size: 0.8em;

                ion-icon {
                    font-size: 1.2em;
                    margin-right: 0.2em;
                }
            }

            .recipeFilters {
                display: flex;
                justify-content: flex-end;
                align-items: flex-end;
                flex-wrap: wrap;
                .recipeFilter {
                    position: relative;
                    font-size: 0.8em;
                    font-weight: 500;
                    background: rgba(255, 255, 255, 0.4);
                    padding: 0.2em 0.5em;
                    border-radius: 0.5em;
                    margin: 0.06em 0.12em;

                    @include tablet {
                        font-size: 0.7em;
                        font-weight: 600;
                    }
                }
            }
        }
    }
}
</style>