"use client";

import { useState } from "react";
import { useWixClient } from "../hooks/useWixClient";
import { LoginState } from "@wix/sdk";
import Cookies from "js-cookie";
import { useRouter } from "next/navigation";

const MODE = {
  LOGIN: "LOGIN",
  REGISTER: "REGISTER",
  RESET_PASSWORD: "RESET_PASSWORD",
  EMAIL_VERIFICATION: "EMAIL_VERIFICATION",
};

const CustomAuth = () => {
  const wixClient = useWixClient();

  const router = useRouter();

  const isLoggedIn = wixClient.auth.loggedIn();

  /*if (isLoggedIn) {
    router.push("/");
  }*/

  const [mode, setMode] = useState(MODE.LOGIN);

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [emailCode, setEmailCode] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");

  const formTitle =
    mode === MODE.LOGIN
      ? "Log in"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset Your Password"
      : "Verify Your Email";

  const buttonTitle =
    mode === MODE.LOGIN
      ? "Login"
      : mode === MODE.REGISTER
      ? "Register"
      : mode === MODE.RESET_PASSWORD
      ? "Reset"
      : "Verify";

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    let response;

    try {
      switch (mode) {
        case MODE.LOGIN:
          response = await wixClient.auth.login({
            email,
            password,
          });
          break;

        case MODE.REGISTER:
          response = await wixClient.auth.register({
            email,
            password,
            profile: { nickname: username },
          });

          setUsername("");
          setEmail("");
          setPassword("");
          break;

        case MODE.RESET_PASSWORD:
          response = await wixClient.auth.sendPasswordResetEmail(
            email,
            pathName
          );

          setMessage("Password reset email sent, Please check your e-mail");
          break;

        case MODE.EMAIL_VERIFICATION:
          response = await wixClient.auth.processVerification({
            verificationCode: emailCode,
          });
          break;
        default:
          break;
      }

      console.log(response);

      switch (response?.loginState) {
        case LoginState.SUCCESS:
          setMessage("Successful! You are being redirected.");

          const tokens = await wixClient.auth.getMemberTokensForDirectLogin(
            response.data.sessionToken
          );

          Cookies.set("refreshToken", JSON.stringify(tokens.refreshToken), {
            expires: 2,
          });

          wixClient.auth.setTokens(tokens);

          router.push("/");

          break;

        case LoginState.FAILURE:
          if (
            response.errorCode === "invalidEmail" ||
            response.errorCode === "invalidPassword"
          ) {
            setError("Invalid email or password");
          } else if (response.errorCode === "emailAlreadyExists") {
            setError("Email already exists!");
          } else if (response.errorCode === "resetPassword") {
            setError("You need to reset your password!");
          } else {
            setError("Something went wrong!");
          }

        case LoginState.EMAIL_VERIFICATION_REQUIRED:
          setMode(MODE.EMAIL_VERIFICATION);

        case LoginState.OWNER_APPROVAL_REQUIRED:
          setMessage("Your account is pending approval");

        default:
          break;
      }
    } catch (error) {
      console.log(error);
      setError("Something went wrong!");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className="flex flex-col gap-8" onSubmit={handleSubmit}>
      <h1 className="text-3xl font-semibold">{formTitle}</h1>
      {mode === MODE.REGISTER ? (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Username</label>
          <input
            type="text"
            name="username"
            placeholder="Your Username"
            className="text-sm px-3 py-2 rounded-sm bg-transparent ring-1 ring-[#0c0c0c]"
            onChange={(e) => setUsername(e.target.value)}
          />
        </div>
      ) : null}

      {mode !== MODE.EMAIL_VERIFICATION ? (
        <div className="flex flex-col gap-2">
          <label className="text-md text-gray-700">E-mail</label>
          <input
            type="text"
            name="email"
            placeholder="Your Email"
            className="text-sm px-3 py-2 rounded-sm bg-transparent ring-1 ring-[#0c0c0c]"
            onChange={(e) => setEmail(e.target.value)}
          />
        </div>
      ) : (
        <div className="flex flex-col gap-2">
          <label className="text-sm text-gray-700">Verification code</label>
          <input
            type="text"
            name="emailCode"
            placeholder="Enter Your Verification Code"
            className="text-sm px-3 py-2 rounded-sm bg-transparent ring-1 ring-[#0c0c0c]"
            onChange={(e) => setEmailCode(e.target.value)}
          />
        </div>
      )}

      {mode === MODE.LOGIN || mode === MODE.REGISTER ? (
        <div className="flex flex-col gap-2">
          <label className="text-md text-gray-700">Password</label>
          <input
            type="password"
            name="password"
            placeholder="Enter Your Password"
            className=" text-sm px-3 py-2 rounded-sm bg-transparent ring-1 ring-[#0c0c0c]"
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>
      ) : null}

      {mode === MODE.LOGIN && (
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.RESET_PASSWORD)}
        >
          Forgot Password
        </div>
      )}

      <button
        className="bg-[#0c0c0c] text-[#fbfbfb] text-sm px-2 py-3 rounded-sm disabled:bg-pink-200 disabled:cursor-not-allowed"
        type="submit"
      >
        {isLoading ? "Loading" : buttonTitle}
      </button>

      {error && <div className="text-red-600">{error}</div>}

      {mode === MODE.LOGIN && (
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.REGISTER)}
        >
          {"Don't"} have an account?
        </div>
      )}

      {mode === MODE.REGISTER && (
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.LOGIN)}
        >
          Have an account?
        </div>
      )}

      {mode === MODE.RESET_PASSWORD && (
        <div
          className="text-sm underline cursor-pointer"
          onClick={() => setMode(MODE.LOGIN)}
        >
          Go back to Login
        </div>
      )}

      {message && <div className="text-green-600 text-sm">{message}</div>}
    </form>
  );
};

export default CustomAuth;
