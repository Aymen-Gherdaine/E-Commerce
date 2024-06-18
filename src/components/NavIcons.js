"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import CartModal from "./CartModal";
import { useWixClient } from "../hooks/useWixClient";
import Cookies from "js-cookie";

const NaveIcons = () => {
  const wixClient = useWixClient();

  const router = useRouter();

  // State to open and close profile and cart modal
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);

  // State
  const [isLoading, setIsLoading] = useState(false);

  // function that handle if the user is loggedin or not
  const handleProfile = () => {
    // Checking if the user is logged in from user browser cookies
    const userTokenFromCookies = Cookies.get("refreshToken");

    if (!userTokenFromCookies) {
      router.push("/login");
    } else {
      setIsProfileOpen((prev) => !prev);
    }
  };

  // function that handle the cart modal
  const cartHandler = () => {
    setIsCartOpen((prev) => !prev);
  };

  // Function that handle the logout
  const handleLogout = async () => {
    setIsLoading(true);

    Cookies.remove("refreshToken");

    const { logoutUrl } = await wixClient.auth.logout(window.location.href);

    setIsLoading(false);

    setIsProfileOpen(false);

    router.push("/login");
  };

  return (
    <div className="flex items-center gap-4 xl:gap-6 relative">
      <div onClick={handleProfile}>
        <Image
          src="/profile.png"
          alt="profile icon"
          width={22}
          height={22}
          className="cursor-pointer"
        />
        {isProfileOpen && (
          <div className="absolute p-4 rounded-lg top-12 -left-10 bg-[#FBFBFB] text-md shadow-custom z-[1000]">
            <Link href="/">Profile</Link>
            <div className="mt-2 cursor-pointer" onClick={handleLogout}>
              {isLoading ? "Logging out" : "Logout"}
            </div>
          </div>
        )}
      </div>

      <Image
        src="/notification.png"
        alt="notification icon"
        width={22}
        height={22}
        className="cursor-pointer"
      />
      <div className="relative">
        <Image
          src="/cart.png"
          alt="cart icon"
          width={22}
          height={22}
          className="cursor-pointer"
          onClick={cartHandler}
        />
        <span className="absolute bg-red-600 text-[#FBFBFB] -top-4 -right-4 w-6 h-6 rounded-full flex justify-center items-center">
          2
        </span>
      </div>
      {isCartOpen && <CartModal />}
    </div>
  );
};

export default NaveIcons;
