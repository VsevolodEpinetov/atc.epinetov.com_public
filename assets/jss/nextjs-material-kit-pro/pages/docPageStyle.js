import {
  container,
  title,
  main,
  grayColor,
  mainRaised
} from "assets/jss/nextjs-material-kit-pro.js";

const docPageStyle = {
  container: {
    ...container,
    zIndex: "2"
  },
  textCenter: {
    textAlign: "center"
  },
  title: {
    ...title,
    color: grayColor[5]
  },
  subtitle: {
    color: grayColor[5]
  },
  main: {
    ...main,
    ...mainRaised,
    margin: "-150px 60px 0px",
  },
  block: {
    color: "inherit",
    padding: "0.9375rem",
    fontWeight: "500",
    fontSize: "12px",
    textTransform: "uppercase",
    borderRadius: "3px",
    textDecoration: "none",
    position: "relative",
    display: "block"
  },
  inlineBlock: {
    display: "inline-block",
    padding: "0px",
    width: "auto"
  },
  list: {
    marginBottom: "0",
    padding: "0",
    marginTop: "0"
  },
  left: {
    float: "left!important",
    display: "block"
  },
  right: {
    padding: "15px 0",
    margin: "0",
    float: "right"
  },
  icon: {
    width: "18px",
    height: "18px",
    top: "3px",
    position: "relative"
  },
  section: {
    paddingBottom: "0",
    backgroundPosition: "50%",
    backgroundSize: "cover",
    padding: "70px 0",
    "& p": {
      fontSize: "1rem",
      lineHeight: "1.5em",
      color: grayColor[15],
      marginBottom: "30px"
    }
  }
};
  
  export default docPageStyle;
  