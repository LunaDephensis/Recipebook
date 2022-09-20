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
        width: 198px;
        .filterBtn {
            height: 33px;
            width: 198px;
            font-size: 0.9em;
            padding: 6px 25px;
            background: $main2light;
            color: $black;
            font-weight: 600;
            border: none;
            outline: none;
            border-radius: 25px;
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
                margin-left: 8px;
                color: $black;
                --ionicon-stroke-width: 55px;
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
            top: 33px;
            left: 0;
            width: 100%;
            background: $black;
            border-bottom-left-radius: 25px;
            border-bottom-right-radius: 25px;
            overflow: hidden;
            z-index: 101;

            li {
                list-style: none;
                padding: 5px 20px;
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