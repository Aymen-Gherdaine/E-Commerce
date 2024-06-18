"use client";

import { useRouter } from "next/navigation";
import { useWixClient } from "../hooks/useWixClient";

const Auth3rdParty = () => {
  // Initialize the router for navigation
  const router = useRouter();

  // Get the Wix client instance using the custom hook
  const wixClient = useWixClient();

  // Login With 3rd Party provider (wix)
  const loginWith3rdParty = async () => {
    // Generate OAuth data for the login request
    const loginRequestData = wixClient.auth.generateOAuthData(
      "http://localhost:3000" // Redirect URL after successful authentication
    );

    // Store the OAuth redirect data in local storage
    localStorage.setItem("oAuthRedirectData", JSON.stringify(loginRequestData));

    // Get the authentication URL from the Wix client
    const { authUrl } = await wixClient.auth.getAuthUrl(loginRequestData);

    // Redirect the user to the authentication URL
    router.push(authUrl);
  };

  return (
    <div className="">
      <button
        className="w-full bg-[#0c0c0c] text-sm text-[#fbfbfb] px-2 py-3 rounded-sm disabled:bg-pink-200 disabled:cursor-not-allowed"
        onClick={loginWith3rdParty}
      >
        Login with 3rd Party
      </button>
    </div>
  );
};

export default Auth3rdParty;
