<template>
    <section class="notFound">
        <h1>404</h1>
        <h2>Page not found</h2>
    </section>
    
</template>

<style lang="scss" scoped>

    .notFound {
        position: relative;
        width: 100%;
        height: 100vh;
        background: $white;
        display: flex;
        justify-content: center;
        align-items: center;
        flex-direction: column;

        h1 {
            font-size: 6em;
            font-weight: 700;
            color: $black;
        }

        h2 {
            font-size: 3.5em;
            font-weight: 700;
            color: $black;
        }
    }
</style>