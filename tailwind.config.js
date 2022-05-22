module.exports = {
  content: ["./app/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "100vh": "100vh",
      },
      "max-height": {
        calc: "calc(100vh - 64px)",
      },
    },
    plugins: [
      function ({ addVariant }) {
        addVariant("h1", "& h1");
        addVariant("h2", "& h2");
        addVariant("h3", "& h3");
        addVariant("p", "& p");
        addVariant("img", "& img");
        addVariant("tool-tip", "& :hover .tooltiptext");
      },
    ],
  },
};
