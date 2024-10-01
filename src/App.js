import React from 'react';
import './App.css';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Signup from './Components/SignupForm';
import Login from './Components/LoginForm';
import ForgotPassword from './Components/ForgotPassword';

const App = () => {
  return (
    <div className="App">
      
    <BrowserRouter>
    
    <Routes>
      <Route path='/' element={<Signup></Signup>}></Route>
      <Route  path='/Login' element={<Login></Login>}></Route>
      <Route  path='/ForgotPassword' element={<ForgotPassword></ForgotPassword>}></Route>
    </Routes>
    </BrowserRouter>
      
    </div>
  );
};

export default App;
