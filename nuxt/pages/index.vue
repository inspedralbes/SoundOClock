<template>
    <div class="container">
        <div class="starfield">
            <Star v-for="(star, index) in stars" :key="index" :top="star.top" :left="star.left" :delay="star.delay" />
        </div>
        <div class="blank-space"></div>
        <div class="title">
            <h1>VOTA LA CANÇÓ</h1>
            <h2>SENSE DIFICULTAT</h2>
        </div>
        <p>Registra't o inicia sessió per començar</p>
        <button>
            <span>Inicia sessió amb</span>
            <svg xmlns="http://www.w3.org/2000/svg" height="24" viewBox="0 0 24 24" width="24">
                <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4" />
                <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853" />
                <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05" />
                <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335" />
                <path d="M1 1h22v22H1z" fill="none" />
            </svg>
        </button>
        <div class="circle"></div>
        <div class="circle min"></div>
    </div>
</template>

<script>
export default {
    data() {
        return {
            stars: []
        }
    },
    mounted() {
        for (let i = 0; i < 50; i++) {
            this.stars.push({
                top: Math.random() * window.innerHeight,
                left: Math.random() * window.innerWidth,
                delay: Math.random() * 100,
            });
        }
    }
};

</script>

<style lang="scss" scoped>
.container {
    display: flex;
    flex-direction: column;
    position: relative;
    align-items: center;
    height: 100vh;
    overflow: hidden;

    .blank-space {
        height: 10%;
    }

    .title {
        color: #ffffff;
        text-align: center;
        font-size: 32px;
        font-weight: bold;
        margin: 1rem 0;

        h2 {
            font-weight: normal;
            font-size: 26px;
            background: linear-gradient(to bottom, #FCFBFD, #83AEE4);
            -webkit-background-clip: text;
            -webkit-text-fill-color: transparent;
        }
    }

    p {
        color: #ffffff;
        margin-top: 12px;
        font-family: 'SF Pro Display', sans-serif;
    }

    button {
        display: flex;
        justify-content: center;
        align-items: center;
        padding: 10px 20px;
        color: white;
        background-color: black;
        font-weight: bold;
        cursor: pointer;
        margin-top: 20px;

        box-sizing: border-box;

        border: 2px solid rgba(255, 255, 255, 0.49);
        box-shadow: 0px 4px 4px rgba(0, 0, 0, 0.25);
        border-radius: 20px;

        span {
            margin-right: 10px;
        }
    }

    .circle {
        width: 300%;
        height: 66%;
        position: absolute;
        background: rgb(0, 0, 0);
        border-radius: 50%;
        bottom: -10rem;
        z-index: 99;
    }

    .circle.min {
        box-shadow: 0px 0px 152px 60px rgba(255, 255, 255, 0.44);
        width: 52%;
        height: 50%;
        bottom: -4rem;
        z-index: 98;
        background-color: red;
    }

    .starfield {
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        overflow: hidden;
        z-index: -1;
    }
}
</style>