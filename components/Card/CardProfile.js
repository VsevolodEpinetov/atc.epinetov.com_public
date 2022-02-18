import React from "react";
// nodejs library that concatenates classes
import classNames from "classnames";
// nodejs library to set properties for components
import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// @material-ui/icons
// core components
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";

import styles from "assets/jss/nextjs-material-kit-pro/components/cardAvatarStyle.js";

import Settings from "@material-ui/icons/Settings";
import Person from "@material-ui/icons/Person";
import { BorderAll } from "@material-ui/icons";

const useStyles = makeStyles(styles);

const getWorkingPlaceInRussian = (workingAt) => {
  let result = '---';
  switch (workingAt) {
    case 'moscow':
      result = 'МЦ АУВД'
      break;
  }

  return result;
}

const getWorkingPositionInRussian = (workingPosition) => {
  let result = '---';
  switch (workingPosition) {
    case 'trainee':
      result = 'Диспетчер-стажёр'
      break;
    case 'coach':
      result = 'Диспетчер-инструктор'
      break;
    case 'controller':
      result = 'Диспетчер РЛУ и ПК'
      break;
  }

  return result;
}

export default function CardProfile(props) {
  const {
    children,
    className,
    plain,
    profile,
    testimonial,
    testimonialFooter,
    name,
    avatarURL,
    uid,
    workingAt,
    workingPosition,
    backToProfileButton,
    ...rest
  } = props;
  const classes = useStyles();
  return (
    <Card profile style={{ maxWidth: "360px" }}>
      <CardHeader image>
        <a onClick={e => e.preventDefault()} style={{ pointer: 'none' }}>
          <img
            src={avatarURL}
            alt="..."
          />
        </a>
        <div
          className={classes.coloredShadow}
          style={{
            backgroundImage: `url(${avatarURL})`,
            opacity: "1"
          }}
        />
      </CardHeader>
      <CardBody>
        <h3 className={classes.cardTitle} style={{ marginBottom: '0px' }}>{name}</h3>
        <p style={{ marginBottom: '20px', fontSize: '13px' }}>
          uid: {uid}
        </p>
        <p style={{ marginBottom: '0px' }}>Место работы</p>
        <h5 style={{ marginTop: '0px', marginBottom: '20px' }}>{getWorkingPlaceInRussian(workingAt)}</h5>
        <p style={{ marginBottom: '0px' }}>Должность</p>
        <h5 style={{ marginTop: '0px', marginBottom: '15px' }}>{getWorkingPositionInRussian(workingPosition)}</h5>
      </CardBody>
      <CardFooter profile className={classes.justifyContentCenter} style={{ justifyContent: 'center' }}>
        {backToProfileButton && (<Button href='/profile' color='primary'><Person /> К профилю</Button>)}
        {!backToProfileButton && (<Button href='/profileSettings' color='primary'><Settings /> Настройки</Button>)}
      </CardFooter>
    </Card>
  );
}

CardProfile.propTypes = {
  className: PropTypes.string,
  profile: PropTypes.bool,
  plain: PropTypes.bool,
  testimonial: PropTypes.bool,
  testimonialFooter: PropTypes.bool,
  name: PropTypes.string,
  uid: PropTypes.string,
  workingAt: PropTypes.string,
  workingPosition: PropTypes.string,
  backToProfileButton: PropTypes.bool
};
