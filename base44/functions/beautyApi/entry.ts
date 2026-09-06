// AURA Beauty Marketplace — in-memory demo backend.
// A single function holds the mock store catalog and the bookings array in
// module scope so every action (create / list / update) shares the same state.
// The frontend dispatches via an `action` field on the payload.

const stores = [
  {
    id: "s1",
    name: "Golden Rose Spa",
    category: "Spa",
    address: "123 Nguyen Trai, District 1",
    rating: 4.8,
    description: "A serene sanctuary of warm plaster and soft candlelight, devoted to restorative skin and body rituals.",
    services: [
      { id: "sv1", name: "Intensive Facial Care", price: 350000, duration: "60 min" },
      { id: "sv2", name: "Hot Stone Body Massage", price: 500000, duration: "75 min" }
    ],
    staff: ["Ms. Linh", "Ms. Mai"],
    slots: ["09:00", "10:30", "14:00", "15:30"]
  },
  {
    id: "s2",
    name: "The Barbershop King",
    category: "Hair",
    address: "456 Le Van Sy, District 3",
    rating: 4.9,
    description: "A refined grooming studio where vintage leather meets modern craft — precision cuts and bespoke color.",
    services: [
      { id: "sv3", name: "6-Step Haircut Combo", price: 150000, duration: "45 min" },
      { id: "sv4", name: "Fashion Hair Dyeing", price: 400000, duration: "120 min" }
    ],
    staff: ["Mr. Tuan", "Mr. Huy"],
    slots: ["08:30", "10:00", "13:30", "15:00"]
  }
];

// In-memory bookings store (persists for the lifetime of the function isolate).
const bookings = [];

function makeId() {
  return "BK" + Math.floor(1000 + Math.random() * 9000);
}

export default async function (req: Request): Promise<Response> {
  try {
    let body: any = {};
    try {
      body = await req.json();
    } catch (_) {
      body = {};
    }
    const action = body?.action;

    // GET /api/stores — return the full catalog
    if (action === "getStores") {
      return Response.json({ stores });
    }

    // POST /api/bookings — create a new appointment
    if (action === "createBooking") {
      const {
        customerName,
        customerPhone,
        storeId,
        storeName,
        serviceName,
        staffName,
        date,
        time
      } = body;

      if (!customerName || !customerPhone || !storeId || !serviceName || !staffName || !date || !time) {
        return Response.json(
          { error: "Missing required booking fields." },
          { status: 400 }
        );
      }

      const booking = {
        id: makeId(),
        customerName: String(customerName).trim(),
        customerPhone: String(customerPhone).trim(),
        storeId,
        storeName,
        serviceName,
        staffName,
        date,
        time,
        status: "Pending",
        createdAt: new Date().toISOString()
      };
      bookings.push(booking);
      return Response.json({ booking }, { status: 201 });
    }

    // GET /api/admin/bookings — list all bookings
    if (action === "getBookings") {
      // newest first
      const sorted = [...bookings].sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
      return Response.json({ bookings: sorted });
    }

    // PUT /api/admin/bookings/:id — update a booking status
    if (action === "updateBooking") {
      const { id, status } = body;
      if (!id || !status) {
        return Response.json({ error: "Booking id and status are required." }, { status: 400 });
      }
      if (!["Approved", "Cancelled"].includes(status)) {
        return Response.json({ error: "Invalid status value." }, { status: 400 });
      }
      const found = bookings.find((b) => b.id === id);
      if (!found) {
        return Response.json({ error: "Booking not found." }, { status: 404 });
      }
      found.status = status;
      return Response.json({ booking: found });
    }

    return Response.json({ error: "Unknown action." }, { status: 400 });
  } catch (error) {
    return Response.json({ error: error.message }, { status: 500 });
  }
}