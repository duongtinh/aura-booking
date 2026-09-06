import { base44 } from "@/api/base44Client";

// Thin client over the `beautyApi` backend function. Each call dispatches via
// an `action` field; the function holds the in-memory catalog and bookings.

export async function getStores() {
  const res = await base44.functions.invoke("beautyApi", { action: "getStores" });
  return res.data.stores;
}

export async function createBooking(payload) {
  const res = await base44.functions.invoke("beautyApi", {
    action: "createBooking",
    ...payload,
  });
  return res.data.booking;
}

export async function getBookings() {
  const res = await base44.functions.invoke("beautyApi", { action: "getBookings" });
  return res.data.bookings;
}

export async function updateBookingStatus(id, status) {
  const res = await base44.functions.invoke("beautyApi", {
    action: "updateBooking",
    id,
    status,
  });
  return res.data.booking;
}

export function formatVND(amount) {
  return new Intl.NumberFormat("vi-VN").format(amount) + " VND";
}