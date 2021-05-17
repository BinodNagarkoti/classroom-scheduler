import firebase from 'firebase'


const firebaseConfig = {
    apiKey: "AIzaSyA-SezsO8Z9PApGfvcEynPtFZbuKXk0V3g",
    authDomain: "classroom-scheduler-af703.firebaseapp.com",
    projectId: "classroom-scheduler-af703",
    storageBucket: "classroom-scheduler-af703.appspot.com",
    messagingSenderId: "1047093565751",
    appId: "1:1047093565751:web:c49f912b76223dcde222b2"
  };

  firebase.initializeApp(firebaseConfig);

export default firebase