import Typography from "typography";

const typography = new Typography({
  baseFontSize: "18px",
  baseLineHeight: 1.45,
  bodyFontFamily: ["Raleway", "sans-serif"],
  headerFontFamily: ["Raleway", "sans-serif"],
});

// Hot reload typography in development.
// if (process.env.NODE_ENV !== "production") {
typography.injectStyles();
// }

export default typography;
export const rhythm = (typography as any).rhythm;
export const scale = (typography as any).scale;
