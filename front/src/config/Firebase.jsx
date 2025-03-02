import { initializeApp } from "firebase/app";

import PropTypes from 'prop-types';
import toast from "react-hot-toast";
import {getAuth,createUserWithEmailAndPassword,signInWithEmailAndPassword,signOut, GoogleAuthProvider,signInWithPopup} from "firebase/auth"
import { createContext, useContext } from "react";

const firebaseConfig = {
    apiKey: "AIzaSyArrzie4drZaK8L5yXViYO8bE9sk9gX6Og",
    authDomain: "finassistapp-e03e4.firebaseapp.com",
    projectId: "finassistapp-e03e4",
    storageBucket: "finassistapp-e03e4.firebasestorage.app",
    messagingSenderId: "648723102937",
    appId: "1:648723102937:web:0455320e35a79c6da392c8",
    databaseURL: "https://finassistapp-e03e4-default-rtdb.asia-southeast1.firebasedatabase.app/",
  };
  
  // Initialize Firebase
  export const app = initializeApp(firebaseConfig);

  const FirebaseContext= createContext(null)
  export const auth= getAuth(app)
  const google= new GoogleAuthProvider()

  export const useFirebase = ()=> useContext(FirebaseContext)

export const FirebaseProvider= (props)=>{

    const signupWithEmailAndPassword=async(email,password)=>{
        try{
         await createUserWithEmailAndPassword(auth,email,password)
         toast.success('Successfully registered!');

        }
        catch(err){
            toast.error(err.message);
            // toast.error(err.code);
        }
    }
    const signinWithEmailAndPassword=async(email,password)=>{
        try{
            await signInWithEmailAndPassword(auth,email,password)
            toast.success('Successfully logged!');
   
           }
           catch(err){
               toast.error(err.message);
           }
    }
    const signinWithGoogle=async()=>{
        try{
            await signInWithPopup(auth,google)
            toast.success('Successfully logged');
   
           }
           catch(err){
               toast.error(err.message);
           }
    }
    const signout=async()=>{
        try{
            await signOut(auth)
            toast.success('Successfully signed out!');
   
           }
           catch(err){
               toast.error(err.message);
           }
    }

    // const onauthStateChanged=()=>{
    //     onAuthStateChanged(auth,(user)=>{
    //         if(user){
    //             navigate('/main')
    //             console.log("User in")
    //         }
    //         else{
    //             navigate('/signin')
    //             console.log('User out')
    //         }
    //     })
    // }

     // Correct onAuthStateChanged function
//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (user) => {
//       if (user) {
//         navigate("/main");
//         console.log("User in");
//       } else {
//         navigate("/signin");
//         console.log("User out");
//       }
//     });

//     return () => unsubscribe(); // Cleanup listener
//   }, [navigate]);

       return(

       

        <FirebaseContext.Provider value={{signupWithEmailAndPassword, signinWithEmailAndPassword,signout,signinWithGoogle}}>
            {props.children}
        </FirebaseContext.Provider>
       )
}

FirebaseProvider.propTypes = {
    children: PropTypes.node.isRequired, 
            
  };
  