import React from "react";
import Image from 'next/image'
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import styles from "assets/jss/nextjs-material-kit-pro/components/postImageStyle.js";

const useStyles = makeStyles(styles);

export default function PostImage(props) {
  const { description, src, width, height } = props;
  const classes = useStyles();
  return (
    <div className={classes.wrapper}>
      <Image
        src={src}
        width={width}
        height={height}
        layout='responsive'
      />
      { description &&
        <p className={classes.description}>
          {description}
        </p>
      }     
    </div>
  );
}

PostImage.propTypes = {
  description: PropTypes.string,
  src: PropTypes.string.isRequired,
  width: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired
};
