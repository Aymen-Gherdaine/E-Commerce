import { create } from "zustand";

// Create a Zustand store to manage the cart state
export const useCartStore = create((set) => ({
  // Create a Zustand store to manage the cart state
  cart: [],
  // Initial state for loading status, true indicating loading
  isLoading: true,
  // Initial state for the cart item count, set to 0
  counter: 0,

  // Function to fetch the current cart
  getCart: async (wixClient) => {
    try {
      // Fetch the current cart using the provided Wix client
      const cart = await wixClient.currentCart.getCurrentCart();

      // Update the state with the fetched cart data
      set({
        cart: cart || [],
        isLoading: false,
        counter: cart?.lineItems.length || 0,
      });
    } catch (error) {
      console.log(error);
    }
  },

  // Function to add an item to the cart
  addItem: async (wixClient, productId, variantId, quantity) => {
    // Set loading status to true while adding an item
    set((state) => ({ ...state, isLoading: true }));

    // Add item to the current cart using the provided Wix client
    const response = await wixClient.currentCart.addToCurrentCart({
      lineItems: [
        {
          catalogReference: {
            // App ID from environment variables
            appId: process.env.NEXT_PUBLIC_WIX_APP_ID,
            // ID of the product to add
            catalogItemId: productId,
            // Include variant ID if it exists
            ...(variantId && { options: { variantId } }),
          },
          // Quantity of the item to add
          quantity: quantity,
        },
      ],
    });

    // Update the state with the new cart data
    set({
      // Set cart to the updated cart data
      cart: response.cart,
      // Set counter to the updated number of items in the cart
      counter: response.cart?.lineItems.length,
      // Set loading status to false
      isLoading: false,
    });
  },

  // Function to remove an item from the cart
  removeItem: async (wixClient, itemId) => {
    // Set loading status to true while removing an item
    set((state) => ({ ...state, isLoading: true }));

    // Remove item from the current cart using the provided Wix client
    const response = await wixClient.currentCart.removeLineItemsFromCurrentCart(
      [itemId]
    );

    // Update the state with the new cart data
    set({
      cart: response.cart,
      counter: response.cart?.lineItems.length,
      isLoading: false,
    });
  },
}));
