import {
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    main
} from "assets/jss/nextjs-material-kit-pro.js";

import tooltipsStyle from "assets/jss/nextjs-material-kit-pro/tooltipsStyle.js";

const docsPageStyle = {
    main,
    mlAuto,
    mrAuto,
    ...tooltipsStyle,
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
    }
};

export default docsPageStyle;