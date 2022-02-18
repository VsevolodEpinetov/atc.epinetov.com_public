import {
    container,
    mlAuto,
    mrAuto,
    title,
    description,
    main
  } from "assets/jss/nextjs-material-kit-pro.js";
  
  const aipStyle = {
    main,
    mlAuto,
    mrAuto,
    container: {
        ...container,
        zIndex: 1
    },
    title,
    description: {
        ...description,
        marginBottom: '1.6em'
    }
  };
  
  export default aipStyle;
  