import { auth, firestore } from '../lib/firebase';
import { useEffect, useState } from 'react';
import { useAuthState } from 'react-firebase-hooks/auth';

// Custom hook to read  auth record and user profile doc
export function useUserData() {
  const [user, userLoading] = useAuthState(auth);
  const [userName, setUserName] = useState('---');
  const [userSurname, setUserSurname] = useState('---');
  const [userPhotoURL, setUserPhotoURL] = useState('https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png');
  

  useEffect(() => {
    // turn off realtime subscription
    let unsubscribe;

    if (user) {
      const ref = firestore.collection('users').doc(user.uid);
      unsubscribe = ref.onSnapshot((doc) => {
        setUserName(doc.data()?.name);
        setUserSurname(doc.data()?.surname);
        setUserPhotoURL(doc.data()?.photoURL);
      });
    } else {
      setUserName('---');
      setUserSurname('---');
      setUserPhotoURL('https://storage.googleapis.com/atc.epinetov.com/public/img/profile-pic-dummy.png');
    }

    return unsubscribe;
  }, [user]);

  return { user, userName, userSurname, userPhotoURL };
}