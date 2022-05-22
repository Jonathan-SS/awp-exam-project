module.exports = {
  content: ["./app/**/*.{jsx,tsx}"],
  theme: {
    extend: {
      height: {
        "100vh": "100vh",
      },
    },
  },
  plugins: [
    function ({ addVariant }) {
      addVariant("h1", "& h1");
      addVariant("h2", "& h2");
      addVariant("h3", "& h3");
      addVariant("h4", "& h4");
      addVariant("h5", "& h5");
      addVariant("p", "& p");
      addVariant("img", "& img");
    },
  ],
};
