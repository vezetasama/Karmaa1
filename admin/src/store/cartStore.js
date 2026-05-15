import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      
      // Toast state
      toast: null,

      addItem: (product, selectedPackage, gameInfo) => {
        const items = get().items;
        const existingIndex = items.findIndex(
          (item) =>
            item.product._id === product._id &&
            item.selectedPackage.label === selectedPackage.label
        );

        if (existingIndex >= 0) {
          const updated = [...items];
          updated[existingIndex].quantity += 1;
          set({ items: updated });
        } else {
          set({
            items: [
              ...items,
              {
                id: Date.now().toString(),
                product,
                selectedPackage,
                gameInfo,
                quantity: 1,
              },
            ],
          });
        }
        get().showToast('Added to cart!', 'success');
      },

      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
        get().showToast('Removed from cart', 'info');
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return;
        const updated = get().items.map((item) =>
          item.id === id ? { ...item, quantity } : item
        );
        set({ items: updated });
      },

      clearCart: () => set({ items: [] }),

      getTotal: () => {
        return get().items.reduce(
          (sum, item) => sum + item.selectedPackage.price * item.quantity,
          0
        );
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0);
      },

      showToast: (message, type = 'info') => {
        set({ toast: { message, type, id: Date.now() } });
        setTimeout(() => set({ toast: null }), 3000);
      },
    }),
    {
      name: 'karma-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
);
