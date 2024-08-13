import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoutes({ children }) {
  const authToken = localStorage.getItem("authtoken");

  return authToken  ? children : <Navigate to="/login" />;
}

export default ProtectedRoutes;
