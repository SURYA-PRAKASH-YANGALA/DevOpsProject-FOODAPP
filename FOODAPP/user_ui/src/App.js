import React, { useState } from "react";
import Login from "./components/UserLogin";
import Dashboard from "./components/UserDashboard";

function App() {
  const [page, setPage] = useState(() => {
    // If already logged in, skip login page
    const user = localStorage.getItem("user");
    return user ? "dashboard" : "login";
  });

  return (
    <>
      {page === "login" && <Login setPage={setPage} />}
      {page === "dashboard" && <Dashboard setPage={setPage} />}
    </>
  );
}

export default App;