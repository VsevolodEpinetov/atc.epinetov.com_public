import {
  container,
  mlAuto,
  mrAuto,
  title,
  description,
  main
} from "assets/jss/nextjs-material-kit-pro.js";

import customCheckboxRadioSwitch from "assets/jss/nextjs-material-kit-pro/customCheckboxRadioSwitchStyle.js";
import tooltipsStyle from "assets/jss/nextjs-material-kit-pro/tooltipsStyle.js";
import customSelectStyle from "assets/jss/nextjs-material-kit-pro/customSelectStyle.js";

const trdPageStyle = {
  main,
  mlAuto,
  mrAuto,
  ...tooltipsStyle,
  ...customSelectStyle,
  ...customCheckboxRadioSwitch,
  container: {
    ...container,
    zIndex: "2"
  },
  title,
  description: {
    ...description,
    marginBottom: '1.6em'
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
  textLeft: {
    textAlign: "left"
  },
  textRight: {
    textAlign: "right"
  },
  floatRight: {
    float: "right"
  },
  sliderRoot: {
    color: "#4caf50",
    height: 8
  },
  sliderThumb: {
    height: '24px !important',
    width: '24px !important',
    backgroundColor: '#fff',
    border: '2px solid currentColor',
    marginTop: '-8px !important',
    marginLeft: '-12 !important',
    '&:focus, &:hover, &:active': {
      boxShadow: 'inherit',
    },
  },
  sliderActive: {},
  sliderValueLabel: {
    left: 'calc(-50% + 4px)',
  },
  sliderTrack: {
    height: 8,
    borderRadius: 4,
  },
  sliderRail: {
    height: 8,
    borderRadius: 4,
  },
  sliderMarkLabel: {
    fontSize: '0.7rem'
  },
  mb3em: {
    marginBottom: '3em !important'
  }
};

export default trdPageStyle;