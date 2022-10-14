<template>
    <div class="filterMenu">
        <span class="filterBtn" :class="{active : isActiveFilterList, disabled: disabledFilters}"
            @click="filterListToggle()">
            Adj hozzá címkét <ion-icon name="add"></ion-icon>
        </span>
        <ul v-if="isActiveFilterList" class="filterList">
            <li v-for="listItem in actualFilters"
            :key="listItem.id"
            @click="filterChoosingAndToggle(listItem)">
                {{ listItem.title }}
            </li>
        </ul>
    </div>
</template>

<script>
export default {
    name: 'FilterMenu',
    props: ['actualFilters', 'disabledFilters'],
    data() {
        return {
            isActiveFilterList: false
        }
    },
    methods: {
        filterListToggle() {
            if(!this.disabledFilters) {
                this.isActiveFilterList = !this.isActiveFilterList
            }
        },
        filterChoosingAndToggle(actualItem) {
            this.$emit('selectFilter', actualItem)
            this.filterListToggle()
        }

    }
}
</script>

<style lang="scss" scoped>
    .filterMenu {
        position: relative;
        width: 13.5em;
        .filterBtn {
            height: 2em;
            width: 100%;
            min-width: 13.5em;
            font-size: 1em;
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

            &.disabled {
                background: $disabledMenu;
                color: $white;

                ion-icon {
                    color: $white;
                }

                &:hover {
                    background: $disabledMenu;
                    color: $white;
                    cursor: auto;
                }
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
            
    }
</style>