import { StyleSheet } from "react-native";
import color from "./color";

const GlobalStyle = StyleSheet.create({
  mainText: {
    color: color.textMain,
  },

  // padding
  xsPadding: {
    padding: 10,
  },
  smPadding: {
    padding: 20,
  },
  mdPadding: {
    padding: 30,
  },
  lgPadding: {
    padding: 40,
  },
  // margin
  xsMargin: {
    margin: 5,
  },
  smMargin: {
    margin: 15,
  },
  mdMargin: {
    margin: 25,
  },
  lgMargin: {
    margin: 40,
  },

  center: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },

  horizontalFlex: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
  },

  horizontalButtonGroup: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 20,
  },

  // border radius
  xsBorderRadius: { borderRadius: 5 },
  smBorderRadius: { borderRadius: 15 },
  mdBorderRadius: { borderRadius: 25 },
  lgBorderRadius: { borderRadius: 35 },
  circleBorderRadius: { borderRadius: 50 },
});

export default GlobalStyle;
