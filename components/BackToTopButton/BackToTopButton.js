/* eslint-disable */
import React from "react";
// nodejs library to set properties for components

import { BsChevronUp } from 'react-icons/bs';
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/nextjs-material-kit-pro/components/backToTopButtonStyle.js";

import smoothScroll from "components/SmoothScroll/SmoothScroll.js"

const useStyles = makeStyles(styles);

export default function BackToTopButton (props) {
  const classes = useStyles();

  React.useEffect(() => {
    var href = window.location.href.substring(
      window.location.href.lastIndexOf("#") + 1
    );
    if (window.location.href.lastIndexOf("#") > 0) {
      document.getElementById(href).scrollIntoView();
    }
    window.addEventListener("scroll", updateView);
    updateView();
    return function cleanup() {
      window.removeEventListener("scroll", updateView);
    };
  });

  const updateView = () => {
    var documentBody = document.getElementById("document-body");
    var button = document.getElementById("button-to-top");

    if (
      documentBody.offsetTop -
      window.innerHeight / 2 <
      window.pageYOffset &&
      documentBody.offsetTop +
      documentBody.scrollHeight -
      window.innerHeight / 2 >
      window.pageYOffset
    ) {
      button.classList.remove("is-hidden");
    } else {
      button.classList.add("is-hidden");
    }
  };

    return (
      <a
        href="#start"
        onClick={e => {
          e.preventDefault();
          smoothScroll("start");
        }}
      >
        <div className={classes.backToTopButtonWrapper} id="button-to-top">
          <span className={classes.backToTopButtonStyle}><BsChevronUp /></span>
        </div>
      </a>
    );
}
