import { useState } from "react";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login";
import Dashboard from "./pages/Dashboard";
import Tables from "./pages/Tables";
import Orders from "./pages/Orders";
import Menu from "./pages/Menu";
import Payment from "./pages/Payment";
import PaymentSuccess from "./pages/PaymentSuccess";
import Navbar from "./components/Navbar";

function ProtectedLayout({ user, setUser, children }) {
  if (!user) return <Navigate to="/login" />;
  return (
      <>
        <Navbar user={user} setUser={setUser} />
        <main>{children}</main>
      </>
  );
}

export default function App() {
  const [user, setUser] = useState(null);

  return (
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={user ? <Navigate to="/dashboard" /> : <Login setUser={setUser} />} />
          <Route path="/" element={<Navigate to={user ? "/dashboard" : "/login"} />} />

          <Route path="/dashboard" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <Dashboard />
            </ProtectedLayout>
          } />

          <Route path="/tables" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <Tables />
            </ProtectedLayout>
          } />

          <Route path="/orders" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <Orders />
            </ProtectedLayout>
          } />

          <Route path="/payment/:orderId" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <Payment />
            </ProtectedLayout>
          } />

          <Route path="/payment-success" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <PaymentSuccess />
            </ProtectedLayout>
          } />

          <Route path="/menu" element={
            <ProtectedLayout user={user} setUser={setUser}>
              <Menu />
            </ProtectedLayout>
          } />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
  );
}
