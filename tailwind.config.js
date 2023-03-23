/* eslint-disable @typescript-eslint/no-var-requires */

const defaultTheme = require("tailwindcss/defaultTheme");
const transitionsProps = defaultTheme.transitionProperty;

/** @type {import('tailwindcss').Config} */
module.exports = {
  future: {
    hoverOnlyWhenSupported: true,
  },
  content: ["./src/{routes,components}/*.{js,ts,jsx,tsx}", "./src/root.tsx"],
  theme: {
    extend: {
      spacing: {
        6.5: "1.625rem",
        18: "4.5rem",
        29: "7.25rem",
        41: "10.25rem",
      },
      transitionProperty: {
        "colors-transform": [
          transitionsProps.colors,
          transitionsProps.transform,
        ].join(","),
      },
      gridTemplateColumns: {
        details: "1fr min-content minmax(0, 1fr)",
      },
    },
    colors: {
      black: "hsl(0, 0%, 0%)",
      gray: "hsl(0, 0%, 19%)",
      white: "hsl(0, 0%, 100%)",
    },
    fontFamily: {
      sans: ["Inter", "Inter-fallback"],
    },
    fontSize: {
      h1: [
        "calc(200rem/16)",
        { lineHeight: "calc(200rem/16)", letterSpacing: "calc(-5rem/16)" },
      ],
      "h1-middle": [
        "calc(175rem/16)",
        { lineHeight: "calc(175rem/16)", letterSpacing: "calc(-4.38rem/16)" },
      ],
      "h1-thin": [
        "calc(100rem/16)",
        { lineHeight: "calc(100rem/16)", letterSpacing: "calc(-2.5rem/16)" },
      ],
      h2: ["calc(56rem/16)", { lineHeight: "calc(68rem/16)" }],
      "h2-thin": ["calc(20rem/16)"],
      "h2-medium": ["calc(40rem/16)"],
      h3: [
        "calc(24rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "calc(4.8rem/16)" },
      ],
      h4: [
        "calc(20rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "calc(4rem/16)" },
      ],
      "h4-thin": [
        "calc(15rem/16)",
        { lineHeight: "calc(25rem/16)", letterSpacing: "calc(3rem/16)" },
      ],
      h5: ["calc(18rem/16)", { lineHeight: "calc(28rem/16)" }],
      h6: [
        "calc(15rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "calc(3rem/16)" },
      ],
      "h6-thin": [
        "calc(10rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "calc(2rem/16)" },
      ],
      body: ["calc(18rem/16)", { lineHeight: "calc(28rem/16)" }],
      "body-thin": ["calc(12rem/16)", { lineHeight: "calc(22rem/16)" }],
      sub: [
        "calc(40rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "normal" },
      ],
      "sub-thin": [
        "calc(15rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "normal" },
      ],
      button: [
        "calc(16rem/16)",
        { lineHeight: "calc(28rem/16)", letterSpacing: "calc(5rem/16)" },
      ],
      "button-thin": [
        "calc(12rem/16)",
        { lineHeight: "calc(14rem/16)", letterSpacing: "calc(3.75rem/16)" },
      ],
    },
    screens: {
      tablet: "768px",
      desktop: "1440px",
    },
  },
  plugins: [require("tailwindcss-logical")],
};
