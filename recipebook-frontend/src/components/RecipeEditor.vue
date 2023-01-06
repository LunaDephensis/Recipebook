<template>
        <div class="recipeForm">
                <div class="titleAndTime">
                    <span class="titleBox">
                        <h3>Recept címe</h3>
                        <input v-model="recipe.recipeTitle" type="text" maxlength="80">
                    </span>
                    <span class="timeBox">
                        <h3>Elkészítési idő</h3>
                        <span><input v-model="recipe.recipeTime" type="number" min="1" @keypress="isNumber($event)"> perc</span>
                        </span>
                </div>
                <div class="tagSettings">
                    <h3>Címke hozzárendelése</h3>
                    <p>Minden recepthez maximum 2 címke adható hozzá.</p>
                    <FilterMenu :actualFilters="actualFilterList"
                                :disabledFilters="actualChoosedFilters.length === 2"
                                @selectFilter="filterChoosing($event)"/>
                    <div class="filtered">
                        <span v-for="choosedFilter in actualChoosedFilters"
                        :key="choosedFilter.id"
                        @click="filterChoosing(choosedFilter)">
                            {{ choosedFilter.title }}
                            <ion-icon name="close"></ion-icon>
                        </span>
                    </div>
                    <div class="createFilter">
                        <div class="createFilterInfo">
                            <h3>Új címke</h3>
                            <p>Címke létrehozásához írd a mezőbe a címke nevét majd kattints a plusz gombra. Ezután már kiválaszthatod a fenti listából.</p>
                        </div>
                        <div class="inputBox">
                            <input type="text" v-model="newTagInputValue" placeholder="Új címke neve..." maxlength="10">
                            <ion-icon @click="createNewTag()" name="add-circle"></ion-icon>
                        </div>
                    </div>
                </div>
                <div class="addPicture">
                    <h3>Kép hozzáadása</h3>
                    <input type="file" @change="uploadImage($event)">
                </div>
                <div class="addIngredients">
                    <div class="wave"></div>
                    <h3>Hozzávalók</h3>
                    <p>Adj meg új hozzávalót majd kattints a plusz gombra vagy nyomj Enter-t.</p>
                    <div class="inputBox">
                        <input type="text" placeholder="Új hozzávaló..." maxlength="80"
                        :disabled="recipe.ingredientsList.length === 40"
                        v-model="newIngredientInputValue"
                        @keyup.enter="addIngredient()">
                        <ion-icon @click="addIngredient()" name="add-circle"></ion-icon>
                    </div>
                    <ul>
                        <li v-for="(ingredient, i) in recipe.ingredientsList" :key="i">
                            {{ ingredient }}
                            <ion-icon @click="deleteIngredient(i)" name="remove-circle"></ion-icon>
                        </li>
                    </ul> 
                </div>
                <div class="addElkeszites">
                    <h3>Elkészítési mód</h3>
                    <textarea v-model="recipe.elkeszites"
                        placeholder="Ide írd az elkészítési módot. Az új bekedésekhez nyomj Enter-t." maxlength="4000">
                    </textarea>
                </div>
            </div>
</template>

<script>

import FilterMenu from '../components/FilterMenu.vue';

export default {
    name: 'RecipeEditor',
    props: {
        recipeTitle: String,
        recipeTime: String,
        ingredients: {type: Array, default: []},
        elkeszites: String,
        picture: String,
        tagIds: {type: Array, default: []}
    },
    emits: ['changeFilterList', 'changeRecipe', 'uploadImage'],
    components: {
        FilterMenu
    },
    data() {
        return {
            newIngredientInputValue: '',
            newTagInputValue: '',
            tagsResp: [],
            recipe: {
                recipeTitle: this.recipeTitle,
                recipeTime: this.recipeTime,
                ingredientsList: JSON.parse(JSON.stringify(this.ingredients)),
                elkeszites: this.elkeszites,
                picture: this.picture
            },
            tagIdList: JSON.parse(JSON.stringify(this.tagIds))
        }
    },
    methods: {
        uploadImage(event) {
            let file = event.target.files[0];
            this.$emit('uploadImage', file);
            this.emitRecipe();
        },
        isNumber(event) {
            let validNumbers = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9'];
            if(!validNumbers.includes(event.key)) {
                event.preventDefault();
            }
        },
        filterChoosing(actualItem) {
           let actualFilter =  this.filterList.find((listItem) => {
                return actualItem.id === listItem.id;
            })
            actualFilter.choosed = !actualFilter.choosed;
            let choosedFilterIds = this.actualChoosedFilters.map((choosedTag) => {
                return choosedTag.id;
            })
            this.$emit('changeFilterList', choosedFilterIds);
            this.emitRecipe();
            
        },
        async getUserTags() {
            let token = localStorage.getItem('token');
            let resp = await fetch(`${process.env.BACKEND_URL}/tags`, {
                method: 'GET',
                headers: {
                    'Authorization': 'Bearer ' + token
                }
            });
            if(resp.ok) {
                let tags = await resp.json();
                return tags;
            }
            else {
                throw new Error('Hiba a tag-ek betöltésekor.');
            }
        },
        deleteIngredient(i) {
            this.recipe.ingredientsList.splice(i, 1);
        },
        addIngredient() {
            if(this.newIngredientInputValue) {
                this.recipe.ingredientsList.push(this.newIngredientInputValue);
                this.newIngredientInputValue = '';
            }
        },
        async createNewTag() {
            if(this.newTagInputValue !== '') {
                let token = localStorage.getItem('token');
                let resp = await fetch(`${process.env.BACKEND_URL}/tags/newtag`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                        'Authorization': 'Bearer ' + token
                    },
                    body: JSON.stringify({tagname: this.newTagInputValue})
                });
                if(resp.ok) {
                    try {
                        this.tagsResp = await this.getUserTags();
                        this.newTagInputValue = '';
                    }
                    catch(ex) {
                        this.$router.push({path: '/error'});
                    }
                }
                else {
                    this.$router.push({path: '/error'});
                }
            }
        },
        emitRecipe() {
            this.$emit('changeRecipe', this.recipe);
        }
    },
    watch: {
        recipe: {
            handler() {
                this.emitRecipe();
            },
            deep: true
        }
    },
    computed: {
        actualFilterList() {
            return this.filterList.filter((item) => {
                return item.choosed === false;
            })
        },
        actualChoosedFilters() {
            return this.filterList.filter((item) => {
                return item.choosed === true;
            });
        },
        filterList() {
            return this.tagsResp.map((tag) => {
                if(!!this.tagIdList && this.tagIdList.includes(tag.id)) {
                    tag.choosed = true;
                }
                else {
                    tag.choosed = false;
                }
                return tag;
            });
        }
    },
    async created() {
        try {
            this.tagsResp = await this.getUserTags();
        }
        catch(ex) {
            this.$router.push({path: '/error'});
        }
    }
}
</script>

<style lang="scss" scoped>
.recipeForm {
            position: relative;
            width: 100%;
            display: grid;
            grid-template-columns: repeat(3, minmax(0, 1fr));
            grid-template-rows: 14em auto 5.5em auto;
            column-gap: 30px;
            margin-bottom: 30px;

            @include tablet {
                display: flex;
                justify-content: center;
                align-items: center;
                flex-direction: column;
            }

            .titleAndTime {
                position: relative;
                grid-column: 1/2;
                grid-row: 1/2;
                width: 100%;
                display: flex;
                justify-content: center;
                align-items: flex-start;
                flex-direction: column;
                background: $black;
                color: $main1;
                padding: 25px;
                border-radius: 8px;
                margin-bottom: 25px;

                @include tablet {
                    padding: 35px;
                    margin-bottom: 35px;
                }

                @include mobile {
                    padding: 20px;
                }

                .titleBox, .timeBox {
                    margin-bottom: 20px;

                    h3 {
                        font-weight: 600;
                        margin-bottom: 5px;
                    }

                    input {
                        border: none;
                        outline: none;
                        border-radius: 15px;
                        padding: 4px 10px;
                        color: $black;
                        font-weight: 600;
                        font-size: 1em;
                        background: rgba(255, 255, 255, 0.5);

                        &:hover, &:focus {
                            background: rgba(255, 255, 255, 0.7);
                        }
                    }
                }

                .titleBox {
                    position: relative;
                    width: 100%;
                    input {
                        width: 100%;
                    }
                }

                .timeBox {
                    span {
                        font-weight: 600;

                        input {
                            max-width: 80px;
                            margin-right: 5px;
                        }
                    }
                }
            }

            .tagSettings {
                position: relative;
                grid-column: 2/3;
                grid-row: 1/3;
                background: $main1;
                padding: 25px;
                border-radius: 8px;
                width: 100%;

                @include tablet {
                    margin-bottom: 35px;
                    padding: 35px;
                }

                @include mobile {
                    padding: 20px;
                }

                h3 {
                    font-weight: 600;
                    color: $black;
                    margin-bottom: 3px;
                }

                p {
                    color: $black;
                    font-size: 0.8em;
                    margin-bottom: 10px;
                }

                .filtered {
                    margin: 20px 0;
                    position: relative;
                    display: flex;
                    justify-content: flex-start;
                    align-items: center;

                    span {
                        position: relative;
                        font-size: 0.8em;
                        font-weight: 600;
                        background: rgba(255, 255, 255, 0.4);
                        color: $black;
                        padding: 3px 8px;
                        border-radius: 8px;
                        margin: 0 2px;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        ion-icon {
                            margin-left: 3px;
                            cursor: pointer;
                            padding: 3px;
                            border-radius: 50%;
                            background: rgba(255, 255, 255, 0.5);

                            &:hover {
                                background: $white;
                            }
                        }
                    }
                }

                .createFilter {

                    @include tablet {
                        position: relative;
                        width: 100%;
                    }

                    .inputBox {
                        position: relative;
                        width: 100%;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        input {
                            border: none;
                            outline: none;
                            background: rgba(255, 255, 255, 0.4);
                            font-size: 0.9em;
                            font-weight: 600;
                            padding: 3px 15px;
                            color: $black;
                            border-radius: 20px;
                            max-width: calc(100% - 42px);

                            &::placeholder {
                                color: $blackborder;
                                font-weight: 400;
                            }

                            @include tablet {
                                width: 100%;
                            }

                        }

                        ion-icon {
                            margin: 0 5px;
                            font-size: 2em;
                            color: $black;
                            cursor: pointer;
                        }
                    }
                }
            }
            .addPicture {
                position: relative;
                grid-column: 1/3;
                grid-row: 3/4;
                margin-bottom: 25px;
                width: 100%;

                @include tablet {
                    position: relative;
                    width: 100%;
                    margin-bottom: 35px;
                    background: rgba(51, 51, 51, 0.9);
                    padding: 30px;
                    border-radius: 6px;
                }

                @include mobile {
                    padding: 20px;
                }

                h3 {
                    font-weight: 600;
                    color: $black;
                    margin-bottom: 5px;
                    color: $white;

                    @include tablet {
                        margin-bottom: 10px;
                        color: $white;
                    }
                }

                input {
                    overflow: hidden;
                    white-space: nowrap;
                    text-overflow: ellipsis;
                    width: 100%;
                }

                input {
                    @include tablet {
                        color: $white;
                    }

                    @include mobile {
                        font-size: 0.8em;
                    }
                }

                input::file-selector-button {
                    height: 33px;
                    width: 198px;
                    font-size: 1.1em;
                    padding: 6px 25px;
                    background: $main2light;
                    color: $black;
                    font-weight: 600;
                    border: none;
                    outline: none;
                    border-radius: 25px;
                    cursor: pointer;

                    &:hover {
                        background: $main2;
                        color: $white;
                    }

                    @include mobile {
                        font-size: 0.9em;
                        width: 135px;
                        padding: 6px 15px;
                    }
                }
            }
            .addIngredients {
                position: relative;
                grid-column: 3/4;
                grid-row: 1/5;
                justify-self: center;
                align-self: start;
                background: $main1;
                width: 100%;
                max-width: 100%;
                max-height: 48.4em;
                padding: 10px 30px 30px;
                margin-top: 40px;
                border-bottom-right-radius: 6px;
                border-bottom-left-radius: 6px;

                @include tablet {
                    border-top-left-radius: 6px;
                    border-top-right-radius: 6px;
                    padding: 30px;
                    margin-top: 0;
                    margin-bottom: 35px;
                    max-height: none;
                }

                @include mobile {
                    padding: 20px;
                }

                .wave {
                    position: absolute;
                    top: -45px;
                    left: 0;
                    width: 100%;
                    height: 50px;
                    background: url(../../public/images/wave3.png);
                    background-size: 750px 50px;
                    background-repeat: no-repeat;
                    overflow: hidden;

                    @include tablet {
                        display: none;
                    }
                }

                h3 {
                    color: $black;
                    font-weight: 600;
                    margin-bottom: 5px;
                    width: 100%;
                }

                p {
                    color: $black;
                    font-size: 0.8em;
                    margin-bottom: 20px;
                    width: 100%;
                }

                .inputBox {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-bottom: 20px;

                    input {
                        border: none;
                        outline: none;
                        background: rgba(255, 255, 255, 0.4);
                        font-size: 0.9em;
                        font-weight: 600;
                        padding: 3px 15px;
                        color: $black;
                        border-radius: 20px;
                        max-width: calc(100% - 42px);

                        &::placeholder {
                            color: $blackborder;
                            font-weight: 400;
                        }

                        @include tablet {
                            width: 100%;
                        }

                        &:disabled {
                            opacity: 0.5;
                        }
                    }

                    ion-icon {
                        margin: 0 5px;
                        font-size: 2em;
                        color: $black;
                        cursor: pointer;
                    }
                }

                ul {
                    position: relative;
                    width: 100%;
                    display: flex;
                    justify-content: flex-start;
                    align-items: flex-start;
                    flex-direction: column;
                    padding-left: 20px;
                    max-height: 35.9em;
                    overflow-y: auto;
                    overflow-x: hidden;

                    @include tablet {
                        max-height: none;
                        overflow: visible;
                    }

                    @include tabletS {
                        padding-left: 20px;
                    }

                    @include mobile {
                        padding-left: 10px;
                    }

                    li {
                        position: relative;
                        list-style: none;
                        color: $black;
                        width: 100%;
                        padding: 0.3em 0;
                        font-weight: 500;
                        margin-left: 0.5em;
                        display: flex;
                        justify-content: flex-end;
                        flex-direction: row-reverse;
                        align-items: center;

                        @include tablet {
                            font-size: 0.8em;
                        }

                        @include mobile {
                            font-size: 1em;
                            padding-right: 20px;
                        }

                        //Nézd meg, hogy neked jól néz -e így ki, és ha igen, törlöm a beforet

                        /*&::before {
                            content: '\2022';
                            color: $blackborder;
                            display: inline-block;
                            font-size: 1.3em;
                            width: 1em;
                            margin-left: -1em;
                        }*/

                        ion-icon {
                            min-width: 1.3em;
                            font-size: 1.3em;
                            margin-right: 0.3em;
                            color: $black;
                            cursor: pointer;
                        }
                    }
                }
            }
            .addElkeszites {
                position: relative;
                grid-column: 1/3;
                grid-row: 4/5;

                @include tablet {
                    width: 100%;
                }

                h3 {
                    font-weight: 600;
                    color: $black;
                    margin-bottom: 5px;

                    @include tablet {
                        margin-left: 5px;
                    }
                }

                textarea {
                    width: 100%;
                    height: 300px;
                    background: $main1;
                    border: none;
                    outline: none;
                    border-radius: 8px;
                    padding: 10px 20px;
                    color: $black;
                    font-size: 0.9em;
                    resize: none;

                    &::placeholder {
                        color: $blackborder;
                    }
                }
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
</style>