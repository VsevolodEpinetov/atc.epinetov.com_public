import React, { useState } from "react";
// used for making the prop types of this component
import PropTypes from "prop-types";
import { makeStyles } from '@material-ui/core/styles';
import clsx from 'clsx';

// core components
import Button from "components/CustomButtons/Button.js";
import CircularProgress from '@material-ui/core/CircularProgress';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';
import { green } from '@material-ui/core/colors';

import { auth, storage, STATE_CHANGED, firestore } from '../lib/firebase';
import { useDocumentData } from 'react-firebase-hooks/firestore'

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}



const useStyles = makeStyles((theme) => ({
  root: {
    display: 'flex',
    alignItems: 'center',
  },
  wrapper: {
    margin: theme.spacing(1),
    position: 'relative',
  },
  buttonSuccess: {
    backgroundColor: green[500],
    '&:hover': {
      backgroundColor: green[700],
    },
  },
  fabProgress: {
    color: green[500],
    position: 'absolute',
    top: -6,
    left: -6,
    zIndex: 1,
  },
  buttonProgress: {
    color: green[500],
    position: 'absolute',
    top: '50%',
    left: '50%',
    marginTop: -12,
    marginLeft: -12,
  },
  textGreen: {
    color: '#4caf50',
    fontWeight: '700',
    marginTop: '10px',
  }
}));

export default function AvatarUpload(props) {
  const classes = useStyles();

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

  const [file, setFile] = React.useState(null);
  const [imagePreviewUrl, setImagePreviewUrl] = React.useState(props.currentPicture);

  const [uploading, setUploading] = useState(false);
  const [success, setSuccess] = useState(false);

  const userRef = firestore.collection('users').doc(auth.currentUser.uid);
  const [info, infoLoading] = useDocumentData(userRef);

  const buttonClassname = clsx({
    [classes.buttonSuccess]: success,
  });

  let fileInput = React.createRef();

  const handleImageChange = e => {
    e.preventDefault();
    let reader = new FileReader();
    let file = e.target.files[0];
    reader.onloadend = () => {
      setFile(file);
      setImagePreviewUrl(reader.result);
    };
    reader.readAsDataURL(file);
  };

  // eslint-disable-next-line
  const uploadFile = e => {
    e.preventDefault();
    setSuccess(false);
    setUploading(true);
    const extension = file.type.split('/')[1];

    // Makes reference to the storage bucket location
    const ref = storage.ref(`uploads/${auth.currentUser.uid}/avatar.${extension}`);
    setUploading(true);

    // Starts the upload
    const task = ref.put(file);
    let alreadyDidThat = false;

    // Listen to updates to upload task
    task.on(STATE_CHANGED, (snapshot) => {


      task
        .then((d) => ref.getDownloadURL())
        .then((url) => {
          setUploading(false);
          setSuccess(true);

          if (!alreadyDidThat) {
            console.log('hey')
            alreadyDidThat = true;
            let userObj = info;
            userObj.photoURL = url;
            firestore
              .collection('users')
              .doc(auth.currentUser.uid)
              .set(userObj)
              .catch(function (error) {
                setMessageError(error.message);
                setOpenError(true);
              })
              .then(() => {
                setMessageSuccess('Аватар успешно обновлен');
                setOpenSuccess(true);
              })
          }
        })
        .catch(function (error) {
          let message = 'Что-то пошло не так. Выбери другой файл'
          if (error.code === 'storage/unauthorized') message = 'Похоже, что выбранный тобой файл либо не является изображением, либо превышает 5Мб. Выбери другую картинку'
          //console.log(error.message);
          setMessageError(message);
          setOpenError(true);
          setImagePreviewUrl(props.currentPicture);
          setFile(null)
          setUploading(false)
        })
    })

  };

  const handleClick = () => {
    fileInput.current.click();
  };


  const handleRemove = () => {
    setFile(null);
    setImagePreviewUrl(props.currentPicture);
    fileInput.current.value = null;
  };

  let { addButtonProps, changeButtonProps, removeButtonProps } = props;
  return (
    <div className="fileinput text-center" style={{ marginBottom: '0' }}>
      <input type="file" onChange={handleImageChange} ref={fileInput} accept="image/x-png,image/gif,image/jpeg" />
      <div>
        <img src={imagePreviewUrl} alt="..." style={{ width: '100%' }} />
      </div>
      <div>
        {file === null ? (
          <>
            <Button {...addButtonProps} onClick={() => handleClick()} color='info' style={{ marginTop: '15px', marginBottom: '0' }}>
              Выбрать аватар
            </Button>
            <p style={{ fontSize: '10px' }}>Требования: изображение не больше 2Мб. Рекомендуемый размер - 320х320.</p>
          </>
        ) : (
          <span>
            {!success &&
              (
                <div className={classes.wrapper}>
                  <Button
                    variant="contained"
                    color='success'
                    className={buttonClassname}
                    disabled={uploading}
                    {...changeButtonProps}
                    onClick={uploadFile}
                    justIcon
                    style={{ marginRight: '10px' }}
                  >
                    🔥
                  </Button>
                  {uploading && <CircularProgress size={24} className={classes.buttonProgress} />}
                  <Button
                    {...removeButtonProps}
                    onClick={() => handleRemove()}
                    color='warning'
                    justIcon
                  >
                    ❌
                  </Button>
                </div>
              )
            }
            {success && (
              <span>
                <p className={classes.textGreen}>Аватар успешно обновлен!</p>
              </span>
            )}
          </span>
        )}
        {

        }
      </div>

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
    </div>
  );
}

AvatarUpload.propTypes = {
  addButtonProps: PropTypes.object,
  changeButtonProps: PropTypes.object,
  removeButtonProps: PropTypes.object
};
