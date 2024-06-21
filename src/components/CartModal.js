"use client";

import Image from "next/image";

import { useCartStore } from "../hooks/useCartStore";
import { media } from "@wix/sdk";
import { useWixClient } from "../hooks/useWixClient";

const CartModal = () => {
  // Getting the wixClient instance from useWixClient hook
  const wixClient = useWixClient();

  // Getting the cart & removeItem function from the cart store
  const { cart, removeItem } = useCartStore();

  return (
    <div className="w-max absolute p-4 rounded-md shadow-custom bg-[#FBFBFB] top-12 right-0 flex flex-col z-[1000]">
      {!cart?.lineItems ? (
        <div className="">Cart is Empty</div>
      ) : (
        <>
          <h2 className="text-2xl mt-4 mb-5 ">Shopping Cart</h2>
          {/* Cart Items Wrapper */}
          <div className="flex flex-col gap-8">
            {/* Cart Item */}
            {cart.lineItems.map((item) => {
              return (
                <>
                  <div className="flex gap-4" key={item._id}>
                    {item.image && (
                      <Image
                        src={media.getScaledToFillImageUrl(
                          item.image,
                          100,
                          100,
                          {}
                        )}
                        alt="product in cart image"
                        width={100}
                        height={100}
                        className="object-cover rounded-md"
                      />
                    )}
                    <div className="flex flex-col gap-12 justify-between w-full">
                      {/* Top */}
                      <div className="">
                        {/* Title */}
                        <div className="flex items-center justify-between gap-8">
                          <h3 className="font-semibold">
                            {item.productName?.original}
                          </h3>
                          <div className="p-1 bg-gray-50 rounded-sm flex items-center gap-2">
                            {item.quantity && item.quantity > 1 && (
                              <div className="text-xs text-green-500">
                                {item.quantity} x
                              </div>
                            )}{" "}
                            ${item.price?.amount}
                          </div>
                        </div>
                        {/* Description */}
                        <div className="text-sm text-gray-500">
                          {item.availability?.status}
                        </div>
                      </div>
                      {/* Bottom*/}
                      <div className="w-full flex justify-between text-sm gap-14">
                        <span className="text-gray-500">
                          Qty. {item.quantity}
                        </span>
                        <span
                          className="text-blue-500 cursor-pointer"
                          onClick={() => removeItem(wixClient, item._id)}
                        >
                          Remove
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="">
                    <div className="flex items-center justify-between font-semibold">
                      <span className="">Subtotal</span>
                      <span className="">${cart.subtotal?.amount}</span>
                    </div>
                    <p className="text-gray-500 text-sm mt-2 mb-2">
                      Shipping and taxes calculated at checkout
                    </p>
                    <div className="flex justify-between text-sm mt-4">
                      <button className="rounded-md py-3 px-4 ring-1 ring-gray-300">
                        View Cart
                      </button>
                      <button className="rounded-md py-3 px-4 bg-black text-[#FBFBFB]">
                        Checkout
                      </button>
                    </div>
                  </div>
                </>
              );
            })}
          </div>
        </>
      )}
    </div>
  );
};

export default CartModal;
