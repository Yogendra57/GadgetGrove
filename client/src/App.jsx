import { useState } from "react";

import Navbar from "./components/Navbar";
import Login from "./components/Login";
import Register from "./components/Register";
import ProductList from "./components/ProductList";
import Product from "./components/Product";
import Card from "./components/Card";
import Profile from "./components/Profile";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import ProductDisplay from "./components/ProductDisplay";
import Style from "./components/Style";
import Cart from "./components/Cart";
import PlaceOrderPage from "./components/PlaceOrderPage";
import AddAddressPage from "./components/AddressPage";
import SavedAddressesPage from "./components/SavedAddressPage";
import EditAddressPage from "./components/EditAddressPage";
import WishlistPage from "./components/WishlistPage";
import ProfilePage from "./components/ProfilePage";
import LogoutPage from "./components/LogoutPage";
import SignupPage from "./components/SignupPage";
import ForgotPasswordPage from "./components/ForgotPasswordPage";
import HomePage from "./components/HomePage";
import OrderSuccessPage from "./components/OrderSuccessPage";
import OrderHistoryPage from "./components/OrderHistoryPage";
import OrderDetailsPage from "./components/OrderDetailsPage";
import DashboardPage from "./admin/DashboardPage";
import AddProductPage from "./admin/AddProductPage";
import AdminProductListPage from "./admin/AdminProductListPage";
import EditProductPage from "./admin/EditProductPage";
import AdminOrderListPage from "./admin/AdminOrderListPage";
import AdminCustomerPage from "./admin/AdminCustomerPage";
import AdminOrderDetailPage from "./admin/AdminOrderDetailPage";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from 'react-toastify';
function App() {
  return (
    <>
      <BrowserRouter>
            <ToastContainer
        position="top-right"
        autoClose={4000} // Automatically close after 4 seconds (4000ms)
        hideProgressBar={false}
        newestOnTop={true}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light" // or "dark" or "colored"
      />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/login" element={<Login />}></Route>
          <Route path="/products" element={<ProductList />}></Route>
          <Route path="/products/:id" element={<ProductDisplay />} />
          <Route path="/register" element={<Register />}></Route>
          <Route path="/style" element={<Style />}></Route>
          <Route path="/cart" element={<Cart />} />
          <Route path="/checkout" element={<PlaceOrderPage />} />
          <Route path="/address" element={<AddAddressPage />}></Route>
          <Route path="/order/success/:id" element={<OrderSuccessPage />} />
          <Route
            path="/saved-addresses"
            element={<SavedAddressesPage />}
          ></Route>
          <Route path="/edit-address/:id" element={<EditAddressPage />}></Route>
          <Route path="/wishlist" element={<WishlistPage />}></Route>
          <Route path="/profile" element={<ProfilePage />}></Route>
          <Route path="/logout" element={<LogoutPage />}></Route>
          <Route path="/signup" element={<SignupPage />}></Route>
          <Route path="/forgot-password" element={<ForgotPasswordPage />} />
          <Route path='/orders' element={<OrderHistoryPage/>}/>
          <Route path='/orders/:id' element={<OrderDetailsPage/>}/>
          <Route path="/admin/dashboard" element={<DashboardPage/>} />
          <Route path='/admin/add-product' element={<AddProductPage/>} />
          <Route path='/admin/products' element={<AdminProductListPage/>} />
          <Route path='/admin/product/:id/edit' element={<EditProductPage/>}/>
          <Route path='/admin/orders' element={<AdminOrderListPage/>}/>
          <Route path='/admin/customers' element={<AdminCustomerPage/>}/>
          <Route path='/admin/orders/:id' element={<AdminOrderDetailPage/>}/>
        </Routes>
      </BrowserRouter>
    </>
  );
}

export default App;
