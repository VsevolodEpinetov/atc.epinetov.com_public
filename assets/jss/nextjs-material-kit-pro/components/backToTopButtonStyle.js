import {
    whiteColor
} from "assets/jss/nextjs-material-kit-pro.js";
  
const backToTopButtonStyle = {
  button: {
    position: "fixed",
    width: "100%",
    bottom: "20px",
    alignItems: "center",
    height: "20px",
    justifyContent: "center",
    zIndex: "1000",
    cursor: "pointer",
    animation: "fadeIn 0.3s",
    transition: "opacity 0.4s",
    opacity: "0.5",
    "&:hover": {
      opacity: "1"
    }
  },
  backToTopButtonWrapper: {
    position: "fixed",
    top: "90%",
    bottom: "auto",
    transform: "",
    zIndex: "4",
    right: "10%",
    width: "3em",
    height: "3em",
    borderRadius: "50%",
    border: "1px solid #ececec",
    boxShadow: "0px 0px 20px 0px rgba(0, 0, 0, 0.25)",
    background: "#fff",
    paddingTop: "0.88em",
    textAlign: "center",
    transition: "transform 0.5s, opacity 0.5s",
    opacity: "1",
    "&:hover": {
      transform: "translate3d(0, -5px, 0)"
    }
  }
};
  
  export default backToTopButtonStyle;
  