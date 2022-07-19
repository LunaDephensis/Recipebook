<template>
    <div class="filterMenu">
        <span class="filterBtn" :class="{active : isActiveFilterList}"
            @click="filterListToggle()">
            Adj hozzá címkét <ion-icon name="add"></ion-icon>
        </span>
        <ul v-if="isActiveFilterList" class="filterList">
            <li v-for="listItem in actualFilterList"
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
    data() {
        return {
            isActiveFilterList: false,
            filterList: []
        }
    },
    methods: {
        filterListToggle() {
            this.isActiveFilterList = !this.isActiveFilterList
        },
        filterChoosing(actualItem) {
           let actualFilter =  this.filterList.find((listItem) => {
                return actualItem.id === listItem.id
            })
            actualFilter.choosed = !actualFilter.choosed
        },
        filterChoosingAndToggle(actualItem) {
            this.filterChoosing(actualItem)
            this.filterListToggle()
        },
        async getUserTags() {
            let token = localStorage.getItem('token');
            let resp = await fetch(`http://localhost:3000/tags`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': 'Bearer ' + token
                }
            });
            let tags = await resp.json();
            return tags;
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
        }
    },
    async created() {
        let tagsResp = await this.getUserTags()
        this.filterList = tagsResp.map((tag) => {
            tag.choosed = false
            return tag
        });
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