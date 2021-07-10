export const defaultTheme = {
	id: 'default',
    hue: 220,
    background: "#f3f3f3",
    primary: {
        light: "hsl(220, 50%, 70%)",
        ".": "hsl(220, 50%, 50%)",
        dark: "hsl(220, 50%, 30%)",
    },
    text: {
        primary: "rgb(0,0,0)",
        secondary: "rgb(0,0,0,.80)",

        on: {
            primary: "rgb(255, 255, 255)",
        }
    },

    nav: {
        background: "hsl(220, 50%, 60%)",
        border: "hsl(220, 50%, 20%)",
        link: {
            color: "hsl(220, 20%, 10%)",
            hover: {
                color: "rgb(255,255,255)",
                background: "hsl(220, 50%, 30%)"
            },
            active:{
                color: "hsla(220, 50%, 20%)",
                background: "hsla(220, 50%, 80%, .5)"
            }
        }
    },

    control: {
        border: "hsla(220, 50%, 20%, 0.5)",
        background: "hsl(220, 50%, 90%)",
        text: "#3b3b3b",
        hover: "hsl(220, 50%, 85%)",
        outline: "hsla(220, 50%, 30%, .25)",
        radius: .25,

        error:{
            border: "rgba(255,128,0,.5)",
            background: "rgba(255, 128, 0, .125)",
            outline: "rgba(255, 128, 9, .25)",
            hover: "rgba(255, 128, 0, .14)",
        },

        disabled: {
            text: "rgba(0,0,0,.4)",
            background: "rgba(0,0,0,.25)",
            border: "rgba(0,0,0,.6)",
        }
    }
}
