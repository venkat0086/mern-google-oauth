// import logo from "./logo.svg";
import React, { useEffect, useState } from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import axios from "axios";
import "./App.css";
import Login from "./Components/Login";
import Home from "./Components/Home";

function App() {
  const [user, setUser] = useState(null);

  const getUser = async () => {
    try {
      const url = `${process.env.REACT_APP_API_URL}/auth/login/success`;
      const { data } = await axios.get(url, { withCredentials: true });
      setUser(data);
      console.log(data.user);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    getUser();
  }, []);
  return (
    <div className="App">
      <Routes>
        <Route
          exact
          path="/"
          element={
            user ? <Home userDetails={user} /> : <Navigate to="/login" />
          }
        />
        <Route
          exact
          path="/login"
          element={user ? <Navigate to="/" /> : <Login />}
        />
        {/* <Route
          path="/signup"
          element={user ? <Navigate to="/" /> : <Signup />}
        /> */}
      </Routes>
    </div>
  );
}

export default App;
