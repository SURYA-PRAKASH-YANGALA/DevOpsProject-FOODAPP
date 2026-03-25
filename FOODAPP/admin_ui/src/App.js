import React, { useState } from "react";
import Login from "./components/AdminLogin";
import Dashboard from "./components/AdminDashboard";

function App() {
  const [page, setPage] = useState(() => {
    // If already logged in, go straight to dashboard
    const admin = localStorage.getItem("admin");
    return admin ? "dashboard" : "login";
  });

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
    </>
  );
}

export default App;