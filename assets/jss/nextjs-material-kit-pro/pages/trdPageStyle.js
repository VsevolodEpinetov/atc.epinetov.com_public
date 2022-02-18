import {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  main
} from "assets/jss/nextjs-material-kit-pro.js";

const docsPageStyle = {
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
  root: {
    height: "auto",
    flexGrow: 1,
    maxWidth: 400,
  }
};

export default docsPageStyle;