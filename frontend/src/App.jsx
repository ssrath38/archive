import { Provider } from "react-redux";
import { BrowserRouter, Route, Routes } from "react-router";
import { Toaster } from "sonner";
import AdminLayout from "./components/Admin/AdminLayout.jsx";
import EditProductPage from "./components/Admin/EditProductPage.jsx";
import OrderManagement from "./components/Admin/OrderManagement.jsx";
import ProductManagement from "./components/Admin/ProductManagement.jsx";
import UserManagement from "./components/Admin/UserManagement.jsx";
import Checkout from "./components/Cart/Checkout.jsx";
import ProtectedRoute from "./components/Common/ProtectedRoute.jsx";
import UserLayout from "./components/Layout/UserLayout.jsx";
import ProductDetails from "./components/Products/ProductDetails.jsx";
import AdminHomePage from "./pages/AdminHomePage.jsx";
import CollectionPage from "./pages/CollectionPage.jsx";
import Home from "./pages/Home.jsx";
import Login from "./pages/Login.jsx";
import MyOrdersPage from "./pages/MyOrdersPage.jsx";
import OrderConfirmationPage from "./pages/OrderConfirmationPage.jsx";
import OrderDetailsPage from "./pages/OrderDetailsPage.jsx";
import Profile from "./pages/Profile.jsx";
import Register from "./pages/Register.jsx";
import store from "./redux/store.js";

export default function App() {
  return (
    <Provider store={store}>
      <BrowserRouter>
        <Toaster position="top-right" />
        <Routes>
          {/* User Layout */}
          <Route path="/" element={<UserLayout />}>
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="profile" element={<Profile />} />
            <Route path="collection/:collection" element={<CollectionPage />} />
            <Route path="product/:id" element={<ProductDetails />} />
            <Route path="checkout" element={<Checkout />} />
            <Route
              path="order-confirmation"
              element={<OrderConfirmationPage />}
            />
            <Route path="order/:id" element={<OrderDetailsPage />} />
            <Route path="my-orders" element={<MyOrdersPage />} />
          </Route>
          {/* Admin Layout */}
          <Route
            path="/admin"
            element={
              <ProtectedRoute role="admin">
                <AdminLayout />
              </ProtectedRoute>
            }
          >
            <Route index element={<AdminHomePage />} />
            <Route path="users" element={<UserManagement />} />
            <Route path="products" element={<ProductManagement />} />
            <Route path="products/:id/edit" element={<EditProductPage />} />
            <Route path="orders" element={<OrderManagement />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </Provider>
  );
}
