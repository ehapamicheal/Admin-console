import { useState, useEffect } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import SideBar from "./components/SideBar";
import Header from "./components/Header";
import Home from './pages/home/Home';
import ProductManagement from './pages/product-management/ProductManagement';
import Login from "./pages/auth/login/Login";
import Preloader from "./components/Preloader"; 
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import UserManagement from "./pages/user-management/UserManagement";
import FulfilmentCentre from "./pages/fulfilment-centre/FulfilmentCentre";
import ScrollToTop from "./components/ScrollToTop";


const App = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true); 


  useEffect(() => {
    if (sessionStorage.getItem("access_token")) {
      setIsLoggedIn(true); 
      setLoading(false); 
    } else {
      setLoading(false); 
    }
  }, []);




  return (

    <BrowserRouter>
      <ScrollToTop />
      {loading ? (
        <Preloader />
      ) : (
        <div>
          {isLoggedIn ? (
            <>
              <SideBar isOpen={isOpen} setIsOpen={setIsOpen} />
              <div className="right_section bg-gray-bg">
                <Header setIsOpen={setIsOpen} setIsLoggedIn={setIsLoggedIn} />
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/product-management" element={<ProductManagement />} />
                  <Route path="/user-management" element={<UserManagement />} />
                  <Route path="/fulfilment-centre" element={<FulfilmentCentre />} />
                  <Route path="*" element={<Navigate to="/" />} />
                </Routes>
              </div>
            </>
          ) : (
            <Routes>
              <Route path="/login" element={<Login setIsLoggedIn={setIsLoggedIn} />} />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
          )}
          <ToastContainer position="top-right" autoClose={3000} />
        </div>
      )}
    </BrowserRouter>

  );
};

export default App;