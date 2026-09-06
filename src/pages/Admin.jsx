import { useState, useEffect, useCallback } from "react";
import { getBookings, updateBookingStatus } from "@/lib/api";
import { Loader2, Check, X, Inbox } from "lucide-react";

const statusStyles = {
  Pending: "bg-[#D9822B]/12 text-[#D9822B]",
  Approved: "bg-[#4E7C59]/12 text-[#4E7C59]",
  Cancelled: "bg-muted text-muted-foreground",
};

export default function Admin() {
  const [bookings, setBookings] = useState([]);
  const [loading, setLoading] = useState(true);
  const [updatingId, setUpdatingId] = useState(null);

  const load = useCallback(() => {
    setLoading(true);
    getBookings()
      .then((data) => setBookings(data))
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  async function handleUpdate(id, status) {
    setUpdatingId(id);
    try {
      await updateBookingStatus(id, status);
      await load();
    } finally {
      setUpdatingId(null);
    }
  }

  return (
    <div className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Merchant dashboard
          </p>
          <h1 className="mt-2 font-display text-3xl font-medium text-foreground sm:text-4xl">
            Appointment management
          </h1>
        </div>
        <button
          onClick={load}
          className="inline-flex items-center gap-2 rounded-full border border-border px-4 py-2 text-sm font-medium text-foreground hover:border-primary hover:text-primary"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <div className="flex justify-center py-24">
          <Loader2 className="h-7 w-7 animate-spin text-primary" />
        </div>
      ) : bookings.length === 0 ? (
        <div className="mt-10 flex flex-col items-center rounded-2xl border border-dashed border-border bg-card py-20 text-center">
          <Inbox className="h-10 w-10 text-muted-foreground" strokeWidth={1.25} />
          <p className="mt-4 font-display text-xl text-foreground">No appointments yet</p>
          <p className="mt-1 text-sm text-muted-foreground">
            New guest bookings will appear here for approval.
          </p>
        </div>
      ) : (
        <div className="mt-8 overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_30px_-12px_rgba(42,36,33,0.12)]">
          {/* Desktop table */}
          <div className="hidden overflow-x-auto lg:block">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-secondary/50 text-left">
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Booking ID</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Customer</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Store</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Service / Staff</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Date & Time</th>
                  <th className="px-5 py-3.5 text-xs font-semibold uppercase tracking-wider text-muted-foreground">Status</th>
                  <th className="px-5 py-3.5 text-right text-xs font-semibold uppercase tracking-wider text-muted-foreground">Actions</th>
                </tr>
              </thead>
              <tbody>
                {bookings.map((b) => (
                  <tr key={b.id} className="border-b border-border last:border-0 hover:bg-secondary/30">
                    <td className="px-5 py-4">
                      <span className="font-mono text-xs font-semibold text-primary">{b.id}</span>
                    </td>
                    <td className="px-5 py-4">
                      <p className="font-medium text-foreground">{b.customerName}</p>
                      <p className="text-xs text-muted-foreground">{b.customerPhone}</p>
                    </td>
                    <td className="px-5 py-4 text-foreground">{b.storeName}</td>
                    <td className="px-5 py-4">
                      <p className="text-foreground">{b.serviceName}</p>
                      <p className="text-xs text-muted-foreground">{b.staffName}</p>
                    </td>
                    <td className="px-5 py-4 text-foreground">
                      {b.date}
                      <span className="text-muted-foreground"> · {b.time}</span>
                    </td>
                    <td className="px-5 py-4">
                      <span className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " + (statusStyles[b.status] || statusStyles.Pending)}>
                        {b.status}
                      </span>
                    </td>
                    <td className="px-5 py-4 text-right">
                      {b.status === "Pending" ? (
                        <div className="inline-flex items-center gap-2">
                          <button
                            onClick={() => handleUpdate(b.id, "Approved")}
                            disabled={updatingId === b.id}
                            className="inline-flex items-center gap-1.5 rounded-full bg-[#4E7C59] px-3.5 py-1.5 text-xs font-semibold text-white transition-opacity hover:opacity-90 disabled:opacity-50"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Approve
                          </button>
                          <button
                            onClick={() => handleUpdate(b.id, "Cancelled")}
                            disabled={updatingId === b.id}
                            className="inline-flex items-center gap-1.5 rounded-full border border-[#b3413a] bg-transparent px-3.5 py-1.5 text-xs font-semibold text-[#b3413a] transition-colors hover:bg-[#b3413a] hover:text-white disabled:opacity-50"
                          >
                            <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                            Cancel
                          </button>
                        </div>
                      ) : (
                        <span className="text-xs text-muted-foreground">—</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Mobile cards */}
          <div className="divide-y divide-border lg:hidden">
            {bookings.map((b) => (
              <div key={b.id} className="p-5">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs font-semibold text-primary">{b.id}</span>
                  <span className={"inline-flex items-center rounded-full px-3 py-1 text-xs font-semibold " + (statusStyles[b.status] || statusStyles.Pending)}>
                    {b.status}
                  </span>
                </div>
                <p className="mt-3 font-display text-lg text-foreground">{b.customerName}</p>
                <p className="text-sm text-muted-foreground">{b.customerPhone}</p>
                <dl className="mt-3 space-y-1 text-sm">
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Store</dt>
                    <dd className="text-right text-foreground">{b.storeName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Service</dt>
                    <dd className="text-right text-foreground">{b.serviceName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">Staff</dt>
                    <dd className="text-right text-foreground">{b.staffName}</dd>
                  </div>
                  <div className="flex justify-between gap-3">
                    <dt className="text-muted-foreground">When</dt>
                    <dd className="text-right text-foreground">{b.date} · {b.time}</dd>
                  </div>
                </dl>
                {b.status === "Pending" && (
                  <div className="mt-4 flex gap-2">
                    <button
                      onClick={() => handleUpdate(b.id, "Approved")}
                      disabled={updatingId === b.id}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full bg-[#4E7C59] px-3 py-2 text-xs font-semibold text-white disabled:opacity-50"
                    >
                      <Check className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Approve
                    </button>
                    <button
                      onClick={() => handleUpdate(b.id, "Cancelled")}
                      disabled={updatingId === b.id}
                      className="inline-flex flex-1 items-center justify-center gap-1.5 rounded-full border border-[#b3413a] px-3 py-2 text-xs font-semibold text-[#b3413a] disabled:opacity-50"
                    >
                      <X className="h-3.5 w-3.5" strokeWidth={2.5} />
                      Cancel
                    </button>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}