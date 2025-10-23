"use client"; // Required for useEffect in Next.js App Router

import { useEffect, useState } from "react";

export default function LogoutPage() {
  const [message, setMessage] = useState("Logging out...");

  useEffect(() => {
    async function logout() {
      try {
        const response = await fetch(
          "http://ecommerce232.runasp.net/api/Customers/logout",
          {
            method: "POST",
            credentials: "include", // Ensure cookies are included
          }
        );

        const data = await response.json();
        setMessage(data.message || "Logout successful");
      } catch (error) {
        console.error("Logout failed:", error);
        setMessage("Logout failed. Please try again.");
      }
    }

    logout();
  }, []);

  return <div>{message}</div>;
}
