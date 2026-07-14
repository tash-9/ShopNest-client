import { Route, Routes } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import ProtectedRoute from "./components/ProtectedRoute";
import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Shop from "./pages/Shop";
import ProductDetails from "./pages/ProductDetails";
import Cart from "./pages/Cart";
import About from "./pages/About";
import Contact from "./pages/Contact";
import NotFound from "./pages/NotFound";
import DashboardLayout from "./pages/dashboard/DashboardLayout";
import DashboardHome from "./pages/dashboard/DashboardHome";
import Profile from "./pages/dashboard/Profile";
import AddProduct from "./pages/dashboard/AddProduct";
import ManageProducts from "./pages/dashboard/ManageProducts";
import MyOrders from "./pages/dashboard/MyOrders";
import AllUsers from "./pages/dashboard/AllUsers";
import AllOrders from "./pages/dashboard/AllOrders";

export default function App() {
  return (
    <>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shop" element={<Shop />} />
        <Route path="/products/:id" element={<ProductDetails />} />
        <Route path="/about" element={<About />} />
        <Route path="/contact" element={<Contact />} />

        <Route
          path="/cart"
          element={
            <ProtectedRoute>
              <Cart />
            </ProtectedRoute>
          }
        />

        <Route
          path="/dashboard"
          element={
            <ProtectedRoute>
              <DashboardLayout />
            </ProtectedRoute>
          }
        >
          <Route index element={<DashboardHome />} />
          <Route path="profile" element={<Profile />} />
          <Route path="my-orders" element={<MyOrders />} />
          <Route path="products/add" element={<AddProduct />} />
          <Route path="products/manage" element={<ManageProducts />} />
          <Route
            path="all-users"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllUsers />
              </ProtectedRoute>
            }
          />
          <Route
            path="all-orders"
            element={
              <ProtectedRoute roles={["admin"]}>
                <AllOrders />
              </ProtectedRoute>
            }
          />
        </Route>

        <Route path="*" element={<NotFound />} />
      </Routes>
      <Footer />
    </>
  );
}
