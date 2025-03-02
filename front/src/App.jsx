// import { app } from './config/firebase

// import './App.css'

import Home from "./pages/Home";
import Signup from "./pages/Signup";
import Login from "./pages/Login";
import FullDashboard from "./pages/FullDashboard";
import FullVisuals from "./pages/FullVisuals";
import { Routes, Route, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "./config/Firebase";
import { axiosIns1 } from "./config/axios";
import { useDispatch } from "react-redux";
import { setAuthUser, setUnAuthUser } from "./redux/userSlice";

function App() {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const storeUserInMongoDB = async (user) => {
    try {
      const res = await axiosIns1.post("/saveDetails", {
        uid: user.uid,
        email: user.email,
      });
      dispatch(setAuthUser(res.data.user));
    } catch (err) {
      console.log(err);
    }
  };
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        // <Navigate to='/main'/>
        console.log("User in");
        await storeUserInMongoDB(user);
        navigate("/dashboard");
      } else {
        navigate("/");
        // <Navigate to='/signin'/>
        console.log("User out");
        dispatch(setUnAuthUser());
      }
    });

    return () => unsubscribe(); // Cleanup
  }, [auth]);

  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/signup" element={<Signup />} />
      <Route path="/login" element={<Login />} />
      <Route path="/dashboard" element={<FullDashboard />} />
      <Route path="/visuals" element={<FullVisuals />} />
    </Routes>
  );
}

export default App;
