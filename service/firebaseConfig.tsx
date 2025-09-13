// Importações Firebase
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { 
  getFirestore, 
  collection, 
  addDoc, 
  getDocs, 
  doc, 
  updateDoc, 
  deleteDoc 
} from "firebase/firestore";

// Se for React Native e quiser persistência de Auth
// import AsyncStorage from '@react-native-async-storage/async-storage';
// import { initializeAuth, getReactNativePersistence } from 'firebase/auth/react-native';

// Configuração do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyCowFMV3i-dlM1Y04B4vajmCt9iNLb9YGo",
  authDomain: "cp4-mobile-pt2.firebaseapp.com",
  projectId: "cp4-mobile-pt2",
  storageBucket: "cp4-mobile-pt2.appspot.com",
  messagingSenderId: "46627919080",
  appId: "1:46627919080:web:ac5de1946fcc396fa5655d",
  measurementId: "G-N99GTQZM5M"
};

// Inicializa Firebase
const app = initializeApp(firebaseConfig);

// Inicializa Firestore
const db = getFirestore(app);

// Inicializa Auth
const auth = getAuth(app);

// Se for React Native e quiser persistência:
// const auth = initializeAuth(app, {
//   persistence: getReactNativePersistence(AsyncStorage),
// });

export { auth, db, collection, addDoc, getDocs, doc, updateDoc, deleteDoc };
