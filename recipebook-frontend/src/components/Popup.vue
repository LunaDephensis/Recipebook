<template>
    <div class="popUpBox">
        <div class="popUp">
            <ion-icon name="alert-circle-outline"></ion-icon>
            <h2 class="popUpTitle">{{ popupTitle }}</h2>
            <p class="popUpMessage">{{ popupMessage }}</p>
            <button class="popUpBtn" @click="$emit('closePopup')">OK</button>
        </div>
    </div>
</template>

<script>
export default {
    name: 'Popup',
    props: ['popupTitle', 'popupMessage'],
    emits: ['closePopup']
}
</script>

<style lang="scss" scoped>

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
        width: 600px;
        min-height: 250px;
        height: auto;
        background: $white;
        border-radius: 18px;
        display: flex;
        justify-content: flex-start;
        align-items: center;
        flex-direction: column;
        padding: 25px 20px;

        @include tabletS {
            max-width: 100%;
            margin: 0 20px;
        }

        ion-icon {
            font-size: 2.5em;
            color: $errorMessage;
            margin-bottom: 10px;
        }

        h2 {
            color: $errorMessage;
            font-weight: 600;
            margin-bottom: 15px;
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

        .popUpBtn {
            font-size: 1.8em;
            font-weight: 600;
            letter-spacing: 2px;
            padding: 8px 25px;
            border: none;
            border-radius: 10px;
            background: $main1;
            color: $black;
            cursor: pointer;
            margin: 20px 0;

            &:hover {
                background: $main1hover;
                color: $white;
            }

            @include mobile {
                font-size: 1.5em;
            }
        }
    }

</style>