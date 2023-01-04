<template>
    <footer>
        <div class="wave"></div>
            <ul class="sci">
                <li><a href="#"><ion-icon name="logo-facebook"></ion-icon></a></li>
                <li><a href="#"><ion-icon name="logo-twitter"></ion-icon></a></li>
                <li><a href="#"><ion-icon name="logo-instagram"></ion-icon></a></li>
            </ul>
            <h4 class="codeBy">Code by <span>Zámbó Nikolett</span></h4>
            <div class="picfrom">
                <h5>pictures & icons from:</h5>
                <ul>
                    <li><a href="https://www.pexels.com/">https://www.pexels.com/</a></li>
                    <li><a href="https://ionic.io/"><ion-icon name="logo-ionic"></ion-icon> ionicons</a></li>
                </ul>
            </div>
    </footer>
</template>

<style lang="scss" scoped>
    footer {
        position: absolute;
        bottom: 0;
        left: 0;
        width: 100%;
        height: 100px;
        padding: 20px 80px;
        background: $main1;
        display: flex;
        justify-content: space-between;
        align-items: center;

        @include tablet {
            padding: 20px 30px;
        }

        @include tabletS {
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            height: auto;
            padding: 25px;
            margin-top: 100px;
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
        }

        .sci {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;

            @include tabletS {
                margin-bottom: 25px;
                order: 1;
            }

            li {
                list-style: none;
                margin: 0 5px;

                a {
                    text-decoration: none;

                    ion-icon {
                        color: $black;
                        font-size: 2em;
                        cursor: pointer;
                        opacity: 0.9;
                        transition: 0.3s;

                        &:hover {
                            transform: scale(1.1);
                            opacity: 1;
                        }
                    }
                }
            }
        }

        .codeBy {
            font-size: 0.7;
            font-weight: 400;
            color: $black;
            letter-spacing: 1px;

            span {
                font-weight: 600;
            }

            @include tabletS {
                font-size: 0.8em;
                margin-bottom: 20px;
                order: 3;
                text-align: center;
            }
        }

        .picfrom {
            position: relative;
            display: flex;
            justify-content: center;
            align-items: center;
            flex-direction: column;
            color: $black;

            @include tabletS {
                margin-bottom: 25px;
                order: 2;
            }

            h5 {
                font-weight: 600;
                margin-bottom: 5px;
                font-size: 0.7em;
            }

            ul {
                display: flex;
                justify-content: center;
                align-items: flex-end;
                flex-direction: column;

                @include tabletS {
                    align-items: center;
                }

                li {
                    list-style: none;
                    padding: 3px 0;

                    a {
                        text-decoration: none;
                        opacity: 0.85;
                        font-size: 0.7em;
                        color: $black;
                        cursor: pointer;
                        display: flex;
                        justify-content: center;
                        align-items: center;

                        &:hover {
                            opacity: 1;
                        }

                        ionicon {
                            font-size: 1em;
                            margin-right: 3px;
                        }
                    }
                }
            }
        }
    }
</style>