import {
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    main,
    whiteColor,
    hexToRgb
} from "assets/jss/nextjs-material-kit-pro.js";

const postsPageStyle = {
    main,
    mlAuto,
    mrAuto,
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
    imgCard: {
        width: "100%",
        borderRadius: "calc(.25rem - 1px)"
    },
    imgCardOverlay: {
        position: "absolute",
        top: "0",
        right: "0",
        bottom: "0",
        left: "0",
        padding: "1.25rem"
    },
    cardCategoryWhite: {
        marginTop: "10px",
        color: "rgba(" + hexToRgb(whiteColor) + ", 0.7)"
    },
    cardDescriptionWhite: {
        color: "rgba(" + hexToRgb(whiteColor) + ", 0.8)"
    }
};

export default postsPageStyle;