// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyCtInGt87_ZY1Vi1B8VsNSXPO52Wae5mN4",
  authDomain: "airbnb-image-e85da.firebaseapp.com",
  projectId: "airbnb-image-e85da",
  storageBucket: "airbnb-image-e85da.appspot.com",
  messagingSenderId: "339493479186",
  appId: "1:339493479186:web:357a82096aa564693789cb",
  measurementId: "G-K9P7YWDFM6",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export default app;
