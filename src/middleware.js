import { OAuthStrategy, createClient } from "@wix/sdk";
import { NextRequest, NextResponse } from "next/server";

export const middleware = async (request) => {
  // The "request" is The incoming request object from [NextRequest].
  // Get cookies from the incoming request
  const cookies = request.cookies;

  // Prepare the response object to pass the request to the next middleware or endpoint
  const response = NextResponse.next();

  // Check if the "refreshToken" cookie is already set
  if (cookies.get("refreshToken")) {
    // If the refresh token exists, pass the request
    return response;
  }

  // Create a new Wix client instance with OAuth strategy
  const wixClient = createClient({
    auth: OAuthStrategy({
      clientId: process.env.NEXT_PUBLIC_WIX_CLIENT_ID,
    }),
  });

  // Generate visitor tokens using the Wix client
  const tokens = await wixClient.auth.generateVisitorTokens();

  // Set the "refreshToken" cookie in the response with a max age of 30 days
  response.cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
    maxAge: 60 * 60 * 24 * 30,
  });

  return response;
};
