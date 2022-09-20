<template>
<div class="loaderBox">
    <div class="loader"></div>
</div>
</template>

<style lang="scss" scoped>

.loaderBox {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
    background: $white;
    z-index: 1000000;

    .loader {
        display: inline-block;
        width: 80px;
        height: 80px;

        &::after {
            content: " ";
            display: block;
            width: 64px;
            height: 64px;
            margin: 8px;
            border-radius: 50%;
            border: 6px solid $black;
            border-color: $black transparent $black transparent;
            animation: loader 1.2s linear infinite;
        }
    }
}



@keyframes loader {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }

}

</style>