import PropTypes from "prop-types";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";

import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CardFooter from "components/Card/CardFooter.js";
import Button from "components/CustomButtons/Button.js";
import Skeleton from '@material-ui/lab/Skeleton';

import AvatarUpload from "./AvatarUpload";

import styles from "assets/jss/nextjs-material-kit-pro/components/cardAvatarStyle.js";
const useStyles = makeStyles(styles);

import Settings from "@material-ui/icons/Settings";
import Person from "@material-ui/icons/Person";



import { auth, firestore } from '../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore'

export default function UserCard({ uid, backToProfileButton, disableAvatarUpload }) {

  const ref = firestore.collection('users').doc(auth.currentUser.uid);
  const [info, infoLoading] = useDocumentData(ref);

  const loading = true;

  const classes = useStyles();

  return (
    <>
      <Card profile style={{ maxWidth: "360px" }}>
        <CardHeader image>
          {info &&
            (<>
              {(!backToProfileButton || (backToProfileButton && disableAvatarUpload)) &&
                <a onClick={e => e.preventDefault()} style={{ pointer: 'none' }}>
                  <img
                    src={info.photoURL}
                    alt="..."
                    className={classes.avatar}
                  />
                </a>
              }
              {backToProfileButton && !disableAvatarUpload &&
                <AvatarUpload
                  currentPicture={info.photoURL}
                  uid={uid}
                />
              }
            </>)
          }
          {infoLoading &&
            (<>
              <a onClick={e => e.preventDefault()} style={{ pointer: 'none' }}>
                <Skeleton animation="wave" width={320} height={320} />
              </a>
              <div
                className={classes.coloredShadow}
                style={{
                  backgroundImage: `url(https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png)`,
                  opacity: "1"
                }}
              />
            </>)
          }
        </CardHeader>
        <CardBody>
          {info &&
            (
              <>
                <h3 className={classes.cardTitle} style={{ marginBottom: '0px' }}>{info.name} {info.surname}</h3>
                <p style={{ marginBottom: '20px', fontSize: '13px' }}>
                  uid: {uid}
                </p>
                <p style={{ marginBottom: '0px' }}>Место работы</p>
                <h5 style={{ marginTop: '0px', marginBottom: '20px' }}>{getWorkingPlaceInRussian(info.workingAt)}</h5>
                <p style={{ marginBottom: '0px' }}>Должность</p>
                <h5 style={{ marginTop: '0px', marginBottom: '15px' }}>{getWorkingPositionInRussian(info.workingPosition)}</h5>
              </>
            )
          }
          {infoLoading &&
            (
              <>
                <Skeleton animation="wave" width='100%' height={70} style={{ marginBottom: '0px' }} />
                <p style={{ marginBottom: '20px', fontSize: '13px' }}>
                  uid: <Skeleton animation="wave" style={{ display: 'inline-flex' }} width='60%' />
                </p>
                <p style={{ marginBottom: '0px' }}>Место работы</p>
                <Skeleton animation="wave" width='100%' height={40} style={{ marginTop: '0px', marginBottom: '20px' }} />
                <p style={{ marginBottom: '0px' }}>Должность</p>
                <Skeleton animation="wave" width='100%' height={40} style={{ marginTop: '0px', marginBottom: '15px' }} />
              </>
            )}
        </CardBody>
        <CardFooter profile className={classes.justifyContentCenter} style={{ justifyContent: 'center' }}>
          {backToProfileButton && (<Button href='/profile' color='primary'><Person /> К профилю</Button>)}
          {!backToProfileButton && (<Button href='/profileSettings' color='primary'><Settings /> Настройки</Button>)}
        </CardFooter>
      </Card>
    </>
  )

}




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