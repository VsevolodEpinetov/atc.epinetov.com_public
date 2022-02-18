/*eslint-disable*/
import React, { useEffect, useContext, useState } from "react";
import classNames from "classnames";
// @material-ui/core components
import { makeStyles } from "@material-ui/core/styles";
// core components
import Header from "components/Header/Header.js";
import HeaderLinks from "components/Header/HeaderLinks.js";
import GridContainer from "components/Grid/GridContainer.js";
import GridItem from "components/Grid/GridItem.js";
import Button from "components/CustomButtons/Button.js";
import Footer from "components/Footer/Footer.js";
import TextField from '@material-ui/core/TextField';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControl from '@material-ui/core/FormControl';
import Select from '@material-ui/core/Select';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import UserCard from "../components/UserCard";
import AvatarUpload from '../components/AvatarUpload';

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

import style from "assets/jss/nextjs-material-kit-pro/pages/aircraftPageStyle.js";
//import profilePageStyle from "assets/jss/nextjs-material-kit-pro/pages/profilePageStyle.js";

import { convertTimestampToDate } from '../lib/date';

// auth
import AuthCheck from '../components/AuthCheck';
import { auth, firestore } from '../lib/firebase';
import { useDocumentData, useCollectionData, useCollection } from 'react-firebase-hooks/firestore'
import { UserContext } from '../lib/context';


import Done from "@material-ui/icons/Done";
import DoneAll from "@material-ui/icons/DoneAll";
import Close from "@material-ui/icons/Close";
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { urlObjectKeys } from "next/dist/next-server/lib/utils";

const useStyles = makeStyles(style);

export default function ProfilePage({ userData }) {
  const classes = useStyles();

  const { user, userPhotoURL } = useContext(UserContext);

  return (
    <div>
      <Header
        links={<HeaderLinks dropdownHoverColor="dark" />}
        color="transparent"
      />
      <div className={classes.projects}>
        <div className={classes.container}>
          <GridContainer>


            <AuthCheck>
              <GridItem
                xs={12} sm={12} md={4}
              >
                <UserCard 
                  uid={user?.uid} 
                  backToProfileButton 
                  disableAvatarUpload={userPhotoURL != 'https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png'}
                />
              </GridItem>
              <GridItem
                xs={12} sm={12} md={8}
              >
                <FormChangeProfile uid={user?.uid} />
                <Button color='danger' fullWidth style={{ marginTop: '-15px' }}
                  onClick={async () => {
                    await firebase.auth().signOut();
                    window.location.href = '/';
                  }}
                >
                  Выйти
                </Button>
              </GridItem>
            </AuthCheck>

          </GridContainer>
        </div>
      </div>
      <Footer />
    </div >
  );
}

function FormChangeProfile({ uid }) {
  const [workplace, setWorkplace] = React.useState('');
  const [workplaceIsValid, setWorkplaceIsValid] = React.useState(false);
  const [position, setPosition] = React.useState('');
  const [positionIsValid, setPositionIsValid] = React.useState(false);
  const [photoURL, setPhotoURL] = React.useState('https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png');

  const [errors, setErrors] = React.useState({
    workplace: true,
    position: true,
    name: false,
    surname: false
  });

  const handleWorkplaceChange = (event) => {
    setWorkplace(event.target.value);
    setWorkplaceIsValid(true);
  };

  const handlePositionChange = (event) => {
    setPosition(event.target.value);
    setPositionIsValid(true);
  };


  const ref = firestore.collection('users').doc(auth.currentUser.uid);
  const [info, infoLoading] = useDocumentData(ref);



  const [openError, setOpenError] = React.useState(false);
  const [messageError, setMessageError] = React.useState('');
  const handleCloseError = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenError(false);
  };


  const [openSuccess, setOpenSuccess] = React.useState(false);
  const [messageSuccess, setMessageSuccess] = React.useState('');
  const handleCloseSuccess = (event, reason) => {
    if (reason === 'clickaway') {
      return;
    }
    setOpenSuccess(false);
  };

  const [nameValue, setNameValue] = useState('');
  const [nameIsValid, setNameIsValid] = useState(false);

  const [surnameValue, setSurnameValue] = useState('');
  const [surnameIsValid, setSurnameIsValid] = useState(false);

  const onChangeName = (e) => {
    let val = e.target.value;
    if (e.target.value.length > 0)
      val = e.target.value[0].toUpperCase() + e.target.value.substring(1).toLowerCase();

    const re = /^(?=[а-яА-Я]{0,15}$)/;

    if (re.test(val)) {
      setNameValue(val);
      if (val.length < 2) setNameIsValid(false);
      else setNameIsValid(true);
    }
  };


  const onChangeSurname = (e) => {
    let val = e.target.value;
    if (e.target.value.length > 0)
      val = e.target.value[0].toUpperCase() + e.target.value.substring(1).toLowerCase();

    const re = /^(?=[а-яА-Я]{0,20}$)/;

    if (re.test(val)) {
      setSurnameValue(val);
      if (val.length < 2) setSurnameIsValid(false);
      else setSurnameIsValid(true);
    }
  };

  let dataSet = false;

  useEffect(() => {
    if (!dataSet) {
      const reName = /^(?=[а-яА-Я]{0,15}$)/;
      const reSurname = /^(?=[а-яА-Я]{0,20}$)/;

      if (reName.test(info?.name)) {
        setNameValue(info?.name);
        if (info?.name.length < 2) setNameIsValid(false);
        else setNameIsValid(true);
      }

      if (reSurname.test(info?.surname)) {
        setSurnameValue(info?.surname);
        if (info?.surname.length < 2) setSurnameIsValid(false);
        else setSurnameIsValid(true);
      }

      setWorkplace(info?.workingAt)
      if (info?.workingAt.length > 4) setWorkplaceIsValid(true)

      setPosition(info?.workingPosition)
      if (info?.workingPosition.length > 4) setPositionIsValid(true)

      setPhotoURL(info?.photoURL)

      dataSet = true;
    }
  }, [info]);

  return (
    <>
      {info &&
        (
          <>
            <h3>Данные профиля</h3>
            <p>Здесь ты можешь поменять данные профиля. Имей в виду, что сделать это можно только один раз.</p>
            <GridContainer>
              <GridItem
                xs={12} sm={12} md={6}
                style={{ marginBottom: '20px' }}
              >
                <TextField
                  disabled={info.locked}
                  id="name-text-field"
                  label="Имя"
                  value={nameValue}
                  fullWidth
                  onChange={onChangeName}
                />
              </GridItem>
              <GridItem
                xs={12} sm={12} md={6}
                style={{ marginBottom: '20px' }}
              >
                <TextField
                  disabled={info.locked}
                  id="surname-text-field"
                  label="Фамилия"
                  value={surnameValue}
                  fullWidth
                  onChange={onChangeSurname}
                />
              </GridItem>
              <GridItem
                xs={12} sm={12} md={6}
                style={{ marginBottom: '20px' }}
              >
                <FormControl fullWidth>
                  <InputLabel id="workplace-select-label">Место работы</InputLabel>
                  <Select
                    labelId="workplace-select-label"
                    id="workplace-select"
                    defaultValue={info.workingAt}
                    value={workplace}
                    onChange={handleWorkplaceChange}
                    fullWidth
                    disabled={info.locked}
                  >
                    <MenuItem value='moscow'>МЦ АУВД</MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem
                xs={12} sm={12} md={6}
                style={{ marginBottom: '20px' }}
              >
                <FormControl fullWidth>
                  <InputLabel id="position-select-label">Должность</InputLabel>
                  <Select
                    labelId="position-select-label"
                    id="position-select"
                    defaultValue={info.workingPosition}
                    value={position}
                    onChange={handlePositionChange}
                    fullWidth
                    disabled={info.locked}
                  >
                    <MenuItem value='trainee'>Диспетчер-стажёр</MenuItem>
                    <MenuItem value='controller'>Диспетчер РЛУ и ПК</MenuItem>
                    <MenuItem value='coach'>Диспетчер-инструктор</MenuItem>
                  </Select>
                </FormControl>
              </GridItem>
              <GridItem
                xs={12} sm={12} md={12}
                style={{ marginBottom: '20px' }}
              >
                <Button
                  color='success'
                  fullWidth
                  style={{ marginTop: '20px' }}
                  disabled={info.locked || !nameIsValid || !surnameIsValid || !workplaceIsValid || !positionIsValid}
                  onClick={async (e) => {
                    e.preventDefault();
                    let userObj = {
                      name: document.getElementById('name-text-field').value,
                      surname: document.getElementById('surname-text-field').value,
                      workingAt: workplace,
                      workingPosition: position,
                      photoURL: photoURL,
                      locked: true
                    }
                    await firestore
                      .collection('users')
                      .doc(uid)
                      .set(userObj)
                      .catch(function (error) {
                        setMessageError(error.message);
                        setOpenError(true);
                      })
                      .then(() => {
                        setMessageSuccess('Данные успешно сохранены');
                        setOpenSuccess(true);
                      })
                  }}
                >
                  Сохранить
                </Button>
              </GridItem>
            </GridContainer>

            <Snackbar open={openError} autoHideDuration={6000} onClose={handleCloseError}>
              <Alert onClose={handleCloseError} severity="error">
                {messageError}
              </Alert>
            </Snackbar>
            <Snackbar open={openSuccess} autoHideDuration={6000} onClose={handleCloseSuccess}>
              <Alert onClose={handleCloseSuccess} severity="success">
                {messageSuccess}
              </Alert>
            </Snackbar>
          </>
        )}
    </>
  )
}