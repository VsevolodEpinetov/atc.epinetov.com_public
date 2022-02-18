import {
  container,
  title,
  main,
  whiteColor,
  mainRaised,
} from "assets/jss/nextjs-material-kit-pro.js";

const indexPageStyle = {
  main: {
    ...main
    /*overflow: "hidden"*/
  },
  mainRaised,
  container: {
    ...container,
    zIndex: 1
  },
  title: {
    ...title,
    color: whiteColor
  },
  cardTitleWhite: {
    fontWeight: "400",
    fontSize: "2.2em"
  }
};

export default indexPageStyle;
