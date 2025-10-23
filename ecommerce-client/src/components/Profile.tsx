"use client";
import { jwtDecode } from "jwt-decode";
import { useState, useEffect } from "react";

export default function Profile() {
  const serverUrl = process.env.SERVER_URL;
  const { getToken } = useAuth();
  const user = useUser();

  const [profileData, setProfileData] = useState(null);

  useEffect(() => {
    console.log(user);
    // Get the Clerk JWT token
    getToken()
      .then((token) => {
        console.log(token);
        console.log(
          "################################################################"
        );
        console.log(jwtDecode(token));
      })
      .catch((error) => {
        console.error("Error getting token:", error);
      });
  }, [serverUrl, getToken]);

  return (
    <div>
      <h1>Profile</h1>
      {profileData ? (
        <pre>{JSON.stringify(profileData, null, 2)}</pre>
      ) : (
        <p>Loading profile data...</p>
      )}
    </div>
  );
}
