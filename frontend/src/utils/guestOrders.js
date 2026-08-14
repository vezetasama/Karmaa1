export const getGuestOrderIds = () => {
  try {
    const raw = localStorage.getItem('karma_guest_order_ids');
    return raw ? JSON.parse(raw) : [];
  } catch (e) {
    return [];
  }
};

export const saveGuestOrderId = (orderId) => {
  if (!orderId) return;
  try {
    const existing = getGuestOrderIds();
    if (!existing.includes(orderId)) {
      const updated = [orderId, ...existing];
      localStorage.setItem('karma_guest_order_ids', JSON.stringify(updated));
    }
  } catch (e) {
    console.error('Failed to save guest order ID', e);
  }
};
