import {
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    primaryColor,
    infoColor,
    successColor,
    warningColor,
    dangerColor,
    grayColor
  } from "assets/jss/nextjs-material-kit-pro.js";

  import modalStyle from "assets/jss/nextjs-material-kit-pro/modalStyle.js";
  
  const aircraftStyles = theme => ({
    primaryText: {
      "&, & *": {
        color: primaryColor[0],
        display: "inline-block"
      }
    },
    infoText: {
      "&, & *": {
        color: infoColor[0],
        display: "inline-block"
      }
    },
    successText: {
      "&, & *": {
        color: successColor[0],
        display: "inline-block"
      }
    },
    warningText: {
      "&, & *": {
        color: warningColor[0],
        display: "inline-block"
      }
    },
    inputRootCustomClasses: {
      margin: "0!important"
    },
    formControl: {
      [theme.breakpoints.down("md")]: {
        color: grayColor[0],
      },
      margin: "0 !important",
      paddingTop: "15px",
      paddingBottom: "7px"
    },
    dangerText: {
      "&, & *": {
        color: dangerColor[0],
        display: "inline-block"
      }
    },
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    gridContainer: {},
    gridItem: {},
    ...modalStyle(theme),
    textCenter: {
      textAlign: "center"
    },
    imageHolder: {
      backgroundPosition: "50% 50% !important",
      backgroundSize: "cover !important"
    }
  });
  
  export default aircraftStyles;
  