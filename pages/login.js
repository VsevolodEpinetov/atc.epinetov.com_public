/*eslint-disable*/
import React, { useState, useEffect, useContext } from "react";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
import InputAdornment from "@material-ui/core/InputAdornment";
import Icon from "@material-ui/core/Icon";
// @material-ui/icons
import Email from "@material-ui/icons/Email";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import Footer from "components/Footer/Footer.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Card from "components/Card/Card.js";
import CardBody from "components/Card/CardBody.js";
import CardHeader from "components/Card/CardHeader.js";
import CustomInput from "components/CustomInput/CustomInput.js";
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import CircularProgress from '@material-ui/core/CircularProgress';

import loginPageStyle from "assets/jss/nextjs-material-kit-pro/pages/loginPageStyle.js";

const useStyles = makeStyles(loginPageStyle);

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

import { auth, firestore, googleAuthProvider } from '../lib/firebase';
import { UserContext } from '../lib/context'


export default function LoginPage({ }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const { user, userName } = useContext(UserContext);

  const [open, setOpen] = React.useState(false);
  const [message, setMessage] = React.useState('');
  const classes = useStyles();


  const handleClose = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }

    setOpen(false);
  };

  return (
    <div>
      <Header
        absolute
        color="white"
        links={<HeaderLinks dropdownHoverColor="info" />}
      />
      <div
        className={classes.pageHeader}
        style={{
          backgroundImage: "url(https://storage.googleapis.com/atc.epinetov.com/public/img/bg-login-page.webp)",
          backgroundSize: "cover",
          backgroundPosition: "top center"
        }}
      >
        <div className={classes.container}>
          <GridContainer justify="center">
            <GridItem xs={12} sm={8} md={4}>
              <Card>
                {!user && (
                  <form className={classes.form}>
                    <CardHeader
                      color="primary"
                      signup
                      className={classes.cardHeader}
                    >
                      <h4 className={classes.cardTitle}>Вход/регистрация</h4>
                    </CardHeader>
                    <p className={classes.description + " " + classes.textCenter}>
                      Регистрироваться тоже тут, если что.<br/> Для сброса пароля напиши мне в <a href='https://t.me/epinetov' target="_blank">телегу</a>.
                    </p>
                    <CardBody signup>
                      <CustomInput
                        id="email"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          placeholder: "Почта",
                          type: "email",
                          startAdornment: (
                            <InputAdornment position="start">
                              <Email className={classes.inputIconsColor} />
                            </InputAdornment>
                          )
                        }}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                      <CustomInput
                        id="pass"
                        formControlProps={{
                          fullWidth: true
                        }}
                        inputProps={{
                          placeholder: "Пароль",
                          type: "password",
                          startAdornment: (
                            <InputAdornment position="start">
                              <Icon className={classes.inputIconsColor}>
                                lock_utline
                              </Icon>
                            </InputAdornment>
                          ),
                          autoComplete: "off"
                        }}
                        onChange={(e) => setPassword(e.target.value)}
                      />
                    </CardBody>
                    <div className={classes.textCenter}>
                      <Button simple color="primary" size="lg" disabled={email === '' || password === ''}
                        onClick={async () => {
                          await auth
                            .signInWithEmailAndPassword(email, password)
                            .then(function () {
                              window.location.href = '/'
                            })
                            .catch(function (error) {
                              setMessage(error.message);
                              setOpen(true);
                            })
                        }}>
                        Пустите
                      </Button>
                      <Button simple color="primary" size="lg" disabled={email === '' || password === ''}
                        onClick={async () => {
                          await auth
                            .createUserWithEmailAndPassword(email, password)
                            .then(async function (userData) {
                              let userObj = {
                                name: '---',
                                surname: '---',
                                workingAt: '---',
                                workingPosition: '---',
                                photoURL: 'https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png',
                                locked: false
                              }
                              await firestore
                                .collection('users')
                                .doc(userData.user.uid)
                                .set(userObj)
                                .catch(function (error) {
                                  setMessage(error.message);
                                  setOpen(true);
                                })
                                .then(() => {
                                  window.location.href = '/'
                                })
                            })
                            .catch(function (error) {
                              setMessage(error.message);
                              setOpen(true);
                            })
                        }}>
                        Зарегистрируйте
                      </Button>
                    </div>
                  </form>
                )}
                {user && (
                  <>
                    <Button simple color="primary" size="lg" href='/profile'>
                      В профиль
                    </Button>
                  </>
                )}
              </Card>
            </GridItem>
          </GridContainer>
          <Snackbar open={open} autoHideDuration={6000} onClose={handleClose}>
            <Alert onClose={handleClose} severity="error">
              {message}
            </Alert>
          </Snackbar>
        </div>
        <Footer
          className={classes.footer}
        />
      </div>
    </div>
  );
}