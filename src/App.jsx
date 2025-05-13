
import { useState, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import { AuthProvider } from "./contexts/AuthContext";
import { DataProvider } from "./contexts/DataContext";

import MainLayout from "./layouts/MainLayout";
import AuthLayout from "./layouts/AuthLayout";


import Login from "./pages/auth/Login";
import Register from "./pages/auth/Register";


import AdminDashboard from "./pages/dashboards/AdminDashboard";
import StoreOwnerDashboard from "./pages/dashboards/StoreOwnerDashboard";
import UserDashboard from "./pages/dashboards/UserDashboard";


import ManageUsers from "./pages/admin/ManageUsers";
import ManageStores from "./pages/admin/ManageStores";
import AddUser from "./pages/admin/AddUser";
import AddStore from "./pages/admin/AddStore";


import StoreList from "./pages/stores/StoreList";
import StoreDetails from "./pages/stores/StoreDetails";


import ChangePassword from "./pages/profile/ChangePassword";
import UserProfile from "./pages/profile/UserProfile";


import NotFound from "./pages/NotFound";


const ProtectedRoute = ({ element, allowedRoles }) => {
  const isAuthenticated = localStorage.getItem("isAuthenticated") === "true";
  const userRole = localStorage.getItem("userRole");
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  if (allowedRoles && !allowedRoles.includes(userRole)) {
  
    if (userRole === "admin") {
      return <Navigate to="/dashboard/admin" />;
    } else if (userRole === "store_owner") {
      return <Navigate to="/dashboard/store-owner" />;
    } else {
      return <Navigate to="/dashboard/user" />;
    }
  }
  
  return element;
};


const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <DataProvider>
          <BrowserRouter>
            <TooltipProvider>
              <Routes>
                {/* Auth Routes */}
                <Route path="/" element={<AuthLayout />}>
                  <Route index element={<Navigate to="/login" />} />
                  <Route path="login" element={<Login />} />
                  <Route path="register" element={<Register />} />
                </Route>

                {/* Main App Routes */}
                <Route path="/" element={<MainLayout />}>
                  {/* Admin Routes */}
                  <Route path="dashboard/admin" element={
                    <ProtectedRoute element={<AdminDashboard />} allowedRoles={["admin"]} />
                  } />
                  <Route path="admin/users" element={
                    <ProtectedRoute element={<ManageUsers />} allowedRoles={["admin"]} />
                  } />
                  <Route path="admin/stores" element={
                    <ProtectedRoute element={<ManageStores />} allowedRoles={["admin"]} />
                  } />
                  <Route path="admin/add-user" element={
                    <ProtectedRoute element={<AddUser />} allowedRoles={["admin"]} />
                  } />
                  <Route path="admin/add-store" element={
                    <ProtectedRoute element={<AddStore />} allowedRoles={["admin"]} />
                  } />

                  {/* Store Owner Routes */}
                  <Route path="dashboard/store-owner" element={
                    <ProtectedRoute element={<StoreOwnerDashboard />} allowedRoles={["store_owner"]} />
                  } />

                  {/* User Routes */}
                  <Route path="dashboard/user" element={
                    <ProtectedRoute element={<UserDashboard />} allowedRoles={["user"]} />
                  } />
                  <Route path="stores" element={
                    <ProtectedRoute element={<StoreList />} allowedRoles={["user", "admin"]} />
                  } />
                  <Route path="stores/:id" element={
                    <ProtectedRoute element={<StoreDetails />} allowedRoles={["user", "admin"]} />
                  } />

                  {/* Common Routes */}
                  <Route path="profile" element={
                    <ProtectedRoute element={<UserProfile />} allowedRoles={["admin", "store_owner", "user"]} />
                  } />
                  <Route path="change-password" element={
                    <ProtectedRoute element={<ChangePassword />} allowedRoles={["admin", "store_owner", "user"]} />
                  } />
                </Route>

                {/* 404 Route */}
                <Route path="*" element={<NotFound />} />
              </Routes>
              <Toaster />
              <Sonner />
            </TooltipProvider>
          </BrowserRouter>
        </DataProvider>
      </AuthProvider>
    </QueryClientProvider>
  );
};

export default App;
