importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/7.6.0/firebase-messaging.js');

firebase.initializeApp({
    apiKey: "AIzaSyAxkWjXihJF1ER5PUzjS77xj18ffqfE0_4",
    authDomain: "optimaheat-7e68a.firebaseapp.com",
    databaseURL:"https://optimaheat-7e68a-default-rtdb.firebaseio.com/",
    projectId: "optimaheat-7e68a",
    storageBucket: "optimaheat-7e68a.appspot.com",
    messagingSenderId: "680917848969",
    appId: "1:680917848969:web:a7abe69a55482f7fc30758"
});

const messaging = firebase.messaging();