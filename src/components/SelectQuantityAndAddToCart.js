"use client";

import { useState } from "react";
import { useWixClient } from "../hooks/useWixClient";
import { useCartStore } from "../hooks/useCartStore";

const SelectQuantityAndAddToCart = ({ productId, variantId, stockNumber }) => {
  // Local state to manage quantity, initialized to 1
  const [quantity, setQuantity] = useState(1);

  // Function to handle quantity changes
  const handleQuantity = (type) => {
    // Increase quantity if the type is "increase" and quantity is less than stockNumber
    if (type === "increase" && quantity < stockNumber) {
      setQuantity((prev) => prev + 1);
    }

    // Decrease quantity if the type is "decrease" and quantity is greater than 1
    if (type === "decrease" && quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  // Getting the wixClient instance from useWixClient hook
  const wixClient = useWixClient();

  // Getting the addItem function from the cart store
  const { addItem } = useCartStore();

  return (
    <div className="flex flex-col gap-4">
      <h4 className="font-semibold">Choose a Quantity</h4>
      <div className="flex flex-col sm:flex-row gap-8 justify-between">
        <div className="flex items-center gap-4">
          <div className="bg-gray-100 py-2 px-4 rounded-3xl flex items-center justify-between w-32">
            <button
              className="text-xl cursor-pointer"
              onClick={() => handleQuantity("decrease")}
            >
              -
            </button>
            {quantity}
            <button
              className="text-xl cursor-pointer"
              onClick={() => handleQuantity("increase")}
            >
              +
            </button>
          </div>
          {stockNumber > 0 ? (
            <div className="text-xs">
              Only <span className="text-orange-500">{stockNumber} Items</span>{" "}
              left!
              <br /> {`Dont't`} miss it
            </div>
          ) : (
            <div className="text-sm text-gray-500">Product is out of stock</div>
          )}
        </div>
        <button
          onClick={() => addItem(wixClient, productId, variantId, quantity)}
          className="w-full sm:w-36 text-sm rounded-md ring-1 hover:ring-[#0c0c0c] bg-[#0c0c0c] text-[#fbfbfb] py-2 px-4 hover:bg-[#fbfbfb] hover:text-[#0c0c0c] transition-all duration-700 disabled:cursor-not-allowed disabled:bg-pink-200 disabled:text-[#fbfbfb] disabled:ring-none"
        >
          ADD TO CART
        </button>
      </div>
    </div>
  );
};

export default SelectQuantityAndAddToCart;
