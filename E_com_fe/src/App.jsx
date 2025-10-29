import React from "react";
import { Routes, Route, Navigate } from "react-router-dom";
import Navbar from "./components/layout/Navbar";
import Home from "./components/layout/Home";
import Login from "./components/auth/Login";
import Signup from "./components/auth/Signup";
import AdminLogin from "./components/auth/AdminLogin";
import UserHome from "./components/user/UserHome";
import NewArrival from "./components/layout/NewArrival";
import Product from "./components/user/Product";
import Cart from "./components/user/Cart";
import Wishlist from "./components/user/Wishlist";
import AdminHome from "./components/admin/AdminHome";
import AddProduct from "./components/admin/AddProduct";
import ManageProduct from "./components/admin/ManageProduct";
import UpdateProduct from "./components/admin/UpdateProduct";
import Footer from "./components/layout/Footer";
import "./App.css";

function App() {
  const user = JSON.parse(localStorage.getItem("user"));

  const isAuthenticated = (requiredRole) => {
    return user && user.role === requiredRole;
  };

  return (
    <>
      <Navbar />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Signup />} />
        <Route path="/admin/login" element={<AdminLogin />} />
        <Route path="/new-arrivals" element={<NewArrival />} />

        {/* User Routes */}
        <Route
          path="/user/home"
          element={isAuthenticated("CUSTOMER") ? <UserHome /> : <Navigate to="/login" />}
        />
        
        <Route
          path="/user/products"
          element={isAuthenticated("CUSTOMER") ? <Product /> : <Navigate to="/login" />}
        />
        <Route
          path="/user/cart"
          element={isAuthenticated("CUSTOMER") ? <Cart /> : <Navigate to="/login" />}
        />
        <Route
          path="/user/wishlist"
          element={isAuthenticated("CUSTOMER") ? <Wishlist /> : <Navigate to="/login" />}
        />

        {/* Admin Routes */}
        <Route
          path="/admin/home"
          element={isAuthenticated("ADMIN") ? <AdminHome /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/products/add"
          element={isAuthenticated("ADMIN") ? <AddProduct /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/products/manage"
          element={isAuthenticated("ADMIN") ? <ManageProduct /> : <Navigate to="/admin/login" />}
        />
        <Route
          path="/admin/products/update/:id"
          element={isAuthenticated("ADMIN") ? <UpdateProduct /> : <Navigate to="/admin/login" />}
        />

        {/* Public Routes */}
        <Route path="*" element={<Navigate to="/" />} />
      </Routes>
      <Footer />
    </>
  );
}

export default App;
