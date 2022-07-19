<template>
    <nav>
            <h3 class="logo">Recipe Book</h3>
            <ul class="desktopMenu">
                <li><router-link to="/newrecipe" class="newRecipeBtn"><ion-icon name="add-outline"></ion-icon> Új Recept</router-link></li>
                <li><a href="#" class="profileBtn"><ion-icon name="person"></ion-icon></a></li>
                <li><a href="#" class="logoutBtn" @click="logout()">Kilépés</a></li>
            </ul>
            <div class="mobileMenuBtn" @click="mobileMenuToggle()">
                <ion-icon name="menu-outline" v-if="!isActiveMobileMenu"></ion-icon>
                <ion-icon name="close-outline" v-if="isActiveMobileMenu"></ion-icon>
            </div>
            <ul class="mobileMenu" :class="{active: isActiveMobileMenu}">
                <li><a href="#"><ion-icon name="add-outline"></ion-icon> Új Recept</a></li>
                <li @click="scrollTo('bannerAndSearch')"><a><ion-icon name="search"></ion-icon> Receptek keresése</a></li>
                <li @click="scrollTo('lastRecipes')" v-if="recipesCount > 3"><a><ion-icon name="timer-outline"></ion-icon> Legutóbbi receptjeid</a></li>
                <li @click="scrollTo('allRecipes')"><a ><ion-icon name="fast-food-outline"></ion-icon> Összes recepted</a></li>
                <li><a href="#"><ion-icon name="person"></ion-icon> Profil</a></li>
                <li><a href="#" @click="logout()"><ion-icon name="log-out-outline"></ion-icon> Kilépés</a></li>
            </ul>
        </nav>
</template>

<script>
export default {
    name: 'Navigation',
    props: ['recipesCount'],
    data() {
        return {
            isActiveMobileMenu: false
        }
    },
    methods: {
        mobileMenuToggle() {
            this.isActiveMobileMenu = !this.isActiveMobileMenu
        },
        scrollTo(point) {
            this.isActiveMobileMenu = false;
            this.$router.push({name: 'MyRecipes', hash: `#${point}`})
        },
        logout() {
            localStorage.removeItem('token')
            this.$router.push({path: '/'});
        }
    }
}
</script>

<style lang="scss" scoped>

nav {
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 80px;
    padding: 0 80px;
    display: flex;
    justify-content: space-between;
    align-items: center;
    background: rgba(255, 255, 255, 0.95);
    z-index: 1000;
    box-shadow: 0 0 25px 6px rgba(0, 0, 0, 0.1);

    @include tablet {
        padding: 0 30px;
    }

    @include tabletS {
        padding: 0 25px;
    }

    @include mobile {
        padding: 0 20px;
    }

    .logo {
        font-family: 'Fredericka the Great', cursive;
        color: $black;
        font-size: 2em;
        font-weight: 500;
        cursor: pointer;

        @include mobile {
            font-size: 1.6em;
            font-weight: 400;
        }
    }

    .desktopMenu {
        position: relative;
        display: flex;

        @include tabletS {
            display: none;
        }

        li {
            list-style: none;
            margin-left: 20px;

            @include tabletS {
                margin-left: 10px;
            }

            a {
                text-decoration: none;
                color: $black;

                &.newRecipeBtn {
                    font-size: 0.9em;
                    position: relative;
                    padding: 6px 25px;
                    background: $main1;
                    color: $black;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    border: none;
                    outline: none;
                    border-radius: 25px;
                    box-shadow: 0 5px 12px rgba(0, 0, 0, 0.1),
                                0 -2px 8px rgba(0,0,0,0.05);
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    margin-right: 20px;

                    @include tabletS {
                        font-size: 0.8em;
                        padding: 4px 15px;
                        margin-right: 10px;
                    }

                    ion-icon {
                        font-size: 1.1em;
                        text-transform: none;
                        margin-right: 2px;
                        color: $black;
                         --ionicon-stroke-width: 55px;
                    }

                    &:hover {
                        background: $main1hover;
                        color: $white;

                        ion-icon {
                            color: $white;
                        }
                    }
                }

                &.logoutBtn {
                   font-size: 0.9em;
                    position: relative;
                    padding: 6px 22px;
                    color: $black;
                    text-transform: uppercase;
                    letter-spacing: 1px;
                    font-weight: 600;
                    border: none;
                    outline: none;
                    border-radius: 25px;
                    cursor: pointer;
                    display: flex;
                    justify-content: center;
                    align-items: center;

                   &:hover {
                       background: rgba(0,0,0,0.7);
                       color: $main1;

                       @include tablet {
                           opacity: 1;
                       }
                   }

                   @include tablet {
                       background: rgba(0,0,0,0.7);
                       color: $main1;
                       opacity: 0.9;
                   }

                   /*@include tabletS {
                        font-size: 0.8em;
                        padding: 4px 15px;
                   }*/

                }

                &.profileBtn {
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    padding: 8px;
                    border-radius: 50%;

                    &:hover {
                       background: rgba(0,0,0,0.7);
                       color: $main1;

                       @include tablet {
                           opacity: 1;
                       }
                   }

                   @include tablet {
                       background: rgba(0,0,0,0.7);
                       color: $main1;
                       opacity: 0.9;
                   }

                   /*@include tabletS {
                        font-size: 0.9em;
                        padding: 6px;
                   }*/
                }
            }
        }
    }

    .mobileMenuBtn {
        display: none;
        @include tabletS {
            display: flex;
            cursor: pointer;

            ion-icon {
                font-size: 2em;
                color: $black;
            }
        }
    }
    .mobileMenu {
        position: absolute;
        top: 80px;
        right: -710px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        width: 60%;
        height: calc(100vh - 80px);
        background: rgba(255, 255, 255, 0.95);
        box-shadow: -25px 6px 25px -10px rgba(0, 0, 0, 0.1);
        transition: 0.4s ease-in-out;
        opacity: 0;

        li {
                list-style: none;
                position: relative;
                width: 100%;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                padding: 12px 0;
                padding-left: 60px;
                cursor: pointer;

                @include mobile {
                    padding-left: 30px;
                }

                a {
                    text-decoration: none;
                    color: $black;
                    font-weight: 500;
                    display: flex;
                    justify-content: center;
                    align-items: center;
                    font-size: 1.1em;

                    ion-icon {
                        margin-right: 10px;
                        --ionicon-stroke-width: 55px;
                        font-size: 1.2em;
                    }
                }
            }

        @include tabletS {
            &.active {
                position: absolute;
                top: 80px;
                right: 0;
                display: flex;
                justify-content: flex-start;
                align-items: center;
                flex-direction: column;
                width: 60%;
                height: calc(100vh - 80px);
                background: rgba(255, 255, 255, 0.95);
                box-shadow: -25px 6px 25px -10px rgba(0, 0, 0, 0.1);
                z-index: 10;
                opacity: 1;

                @include mobile {
                    width: 100%;
                }
            }
        }

        
    }
}

</style>