import {
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    main
} from "assets/jss/nextjs-material-kit-pro.js";

import tooltipsStyle from "assets/jss/nextjs-material-kit-pro/tooltipsStyle.js";
import customSelectStyle from "assets/jss/nextjs-material-kit-pro/customSelectStyle.js";

const citiesPageStyle = {
    main,
    mlAuto,
    mrAuto,
    ...tooltipsStyle,
    ...customSelectStyle,
    container: {
        ...container,
        zIndex: "2"
    },
    title,
    description: {
        ...description,
        marginBottom: '1.6em'
    },
    textCenter: {
        textAlign: "center"
    },
    textRed: {
      color: "red !important"
    },
    textGreen: {
      color: "green !important"
    },
    textCenter: {
      textAlign: "center"
    },
    textRight: {
      textAlign: "right"
    },
    floatRight: {
      float: "right"
    }
};

export default citiesPageStyle;