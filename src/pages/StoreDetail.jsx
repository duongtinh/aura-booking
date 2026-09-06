import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getStores, createBooking, formatVND } from "@/lib/api";
import { Image } from "@/components/ui/image";
import { getStoreImage } from "@/lib/storeImages";
import {
  ArrowLeft,
  MapPin,
  Star,
  Clock,
  CheckCircle2,
  Loader2,
  User,
  Phone,
  CalendarDays,
  Store as StoreIcon,
  Scissors,
} from "lucide-react";

const todayStr = () => new Date().toISOString().slice(0, 10);

export default function StoreDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [store, setStore] = useState(null);
  const [loading, setLoading] = useState(true);

  const [serviceId, setServiceId] = useState(null);
  const [slot, setSlot] = useState(null);
  const [date, setDate] = useState(todayStr());
  const [staff, setStaff] = useState("");
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");

  const [submitting, setSubmitting] = useState(false);
  const [confirmed, setConfirmed] = useState(null);

  useEffect(() => {
    getStores()
      .then((data) => {
        const s = data.find((x) => x.id === id);
        setStore(s);
        if (s) setStaff(s.staff[0] || "");
      })
      .finally(() => setLoading(false));
  }, [id]);

  const canSubmit =
    serviceId && slot && date && staff && name.trim() && phone.trim();

  async function handleConfirm() {
    if (!canSubmit || !store) return;
    const service = store.services.find((s) => s.id === serviceId);
    setSubmitting(true);
    try {
      const booking = await createBooking({
        customerName: name,
        customerPhone: phone,
        storeId: store.id,
        storeName: store.name,
        serviceName: service.name,
        staffName: staff,
        date,
        time: slot,
      });
      setConfirmed(booking);
    } finally {
      setSubmitting(false);
    }
  }

  if (loading) {
    return (
      <div className="flex justify-center py-32">
        <Loader2 className="h-7 w-7 animate-spin text-primary" />
      </div>
    );
  }

  if (!store) {
    return (
      <div className="mx-auto max-w-3xl px-4 py-24 text-center sm:px-6">
        <p className="font-display text-2xl text-foreground">Store not found.</p>
        <button
          onClick={() => navigate("/")}
          className="mt-6 inline-flex items-center gap-2 rounded-full border border-border px-5 py-2.5 text-sm font-medium hover:border-primary"
        >
          <ArrowLeft className="h-4 w-4" /> Back to marketplace
        </button>
      </div>
    );
  }

  // ---- Success screen ----
  if (confirmed) {
    const rows = [
      { icon: StoreIcon, label: "Store", value: confirmed.storeName },
      { icon: User, label: "Customer", value: confirmed.customerName },
      { icon: Phone, label: "Phone", value: confirmed.customerPhone },
      { icon: Scissors, label: "Service", value: confirmed.serviceName },
      { icon: User, label: "Staff", value: confirmed.staffName },
      { icon: CalendarDays, label: "Date & Time", value: `${confirmed.date} · ${confirmed.time}` },
    ];
    return (
      <div className="mx-auto max-w-2xl px-4 py-12 sm:px-6">
        <div className="overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_30px_-12px_rgba(42,36,33,0.12)]">
          <div className="flex flex-col items-center px-6 py-10 text-center">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#4E7C59]/10">
              <CheckCircle2 className="h-9 w-9 text-[#4E7C59]" strokeWidth={1.5} />
            </div>
            <h2 className="mt-5 font-display text-3xl font-medium text-foreground">
              Booking confirmed
            </h2>
            <p className="mt-2 text-sm text-muted-foreground">
              Thank you, {confirmed.customerName}. We've reserved your appointment.
            </p>
            <div className="mt-4 inline-flex items-center rounded-full border border-border bg-secondary px-5 py-2">
              <span className="text-xs uppercase tracking-widest text-muted-foreground">
                Booking ID
              </span>
              <span className="ml-3 font-mono text-base font-semibold text-primary">
                {confirmed.id}
              </span>
            </div>
          </div>

          <div className="border-t border-border px-6 py-6">
            <table className="w-full text-sm">
              <tbody>
                {rows.map((r) => (
                  <tr key={r.label} className="border-b border-border last:border-0">
                    <td className="py-3 align-top">
                      <span className="inline-flex items-center gap-2 text-muted-foreground">
                        <r.icon className="h-4 w-4" strokeWidth={1.75} />
                        {r.label}
                      </span>
                    </td>
                    <td className="py-3 text-right font-medium text-foreground">
                      {r.value}
                    </td>
                  </tr>
                ))}
                <tr className="border-b border-border last:border-0">
                  <td className="py-3 align-top">
                    <span className="inline-flex items-center gap-2 text-muted-foreground">
                      <span className="inline-flex h-4 w-4 items-center justify-center rounded-full bg-[#D9822B]/15 text-[10px] font-bold text-[#D9822B]">
                        •
                      </span>
                      Status
                    </span>
                  </td>
                  <td className="py-3 text-right">
                    <span className="inline-flex items-center rounded-full bg-[#D9822B]/12 px-3 py-1 text-xs font-semibold text-[#D9822B]">
                      {confirmed.status}
                    </span>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex flex-col gap-3 border-t border-border px-6 py-5 sm:flex-row sm:justify-center">
            <button
              onClick={() => navigate("/")}
              className="inline-flex items-center justify-center gap-2 rounded-full bg-primary px-6 py-3 text-sm font-semibold text-primary-foreground hover:bg-[#8a5d49]"
            >
              Back to marketplace
            </button>
            <button
              onClick={() => navigate("/admin")}
              className="inline-flex items-center justify-center gap-2 rounded-full border border-border px-6 py-3 text-sm font-medium hover:border-primary"
            >
              View in admin portal
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ---- Booking page ----
  return (
    <div>
      {/* Cover */}
      <div className="relative h-56 w-full overflow-hidden sm:h-72">
        <Image
          src={getStoreImage(store.id)}
          alt={store.name}
          fittingType="fill"
          className="h-full w-full"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-background via-background/40 to-transparent" />
        <div className="absolute left-4 top-4 sm:left-6 sm:top-6">
          <button
            onClick={() => navigate("/")}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-background/90 px-4 py-2 text-sm font-medium text-foreground backdrop-blur-sm transition-colors hover:border-primary hover:text-primary"
          >
            <ArrowLeft className="h-4 w-4" strokeWidth={2} />
            Back
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="-mt-10 relative z-10 rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_-12px_rgba(42,36,33,0.16)] sm:p-8">
          <div className="flex flex-wrap items-start justify-between gap-4">
            <div>
              <span className="inline-flex items-center rounded-full border border-border bg-secondary px-3 py-1 text-xs font-medium text-primary">
                {store.category === "Spa" ? "Spa & Wellness" : "Hair Studios"}
              </span>
              <h1 className="mt-3 font-display text-3xl font-medium text-foreground sm:text-4xl">
                {store.name}
              </h1>
              <p className="mt-2 flex items-center gap-1.5 text-sm text-muted-foreground">
                <MapPin className="h-4 w-4" strokeWidth={1.75} />
                {store.address}
              </p>
            </div>
            <div className="inline-flex items-center gap-1.5 rounded-full border border-border bg-background px-4 py-2">
              <Star className="h-4 w-4 fill-[#D9822B] text-[#D9822B]" />
              <span className="font-semibold text-foreground">{store.rating.toFixed(1)}</span>
            </div>
          </div>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted-foreground">
            {store.description}
          </p>
        </div>

        {/* Two columns */}
        <div className="mt-8 grid grid-cols-1 gap-6 lg:grid-cols-2 lg:gap-8 pb-16">
          {/* Left: service + time */}
          <div className="space-y-8">
            <section>
              <h2 className="font-display text-2xl font-medium text-foreground">
                Choose a service
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Select one treatment for your appointment.
              </p>
              <div className="mt-4 space-y-3">
                {store.services.map((s) => {
                  const selected = serviceId === s.id;
                  return (
                    <button
                      key={s.id}
                      onClick={() => setServiceId(s.id)}
                      className={
                        "flex w-full items-center justify-between rounded-2xl border-2 p-4 text-left transition-all " +
                        (selected
                          ? "border-primary bg-[#F4EBE6] shadow-[0_0_0_4px_rgba(158,107,85,0.10)]"
                          : "border-border bg-card hover:border-primary/40")
                      }
                    >
                      <div className="flex items-start gap-3">
                        <span
                          className={
                            "mt-0.5 flex h-5 w-5 shrink-0 items-center justify-center rounded-full border-2 transition-colors " +
                            (selected ? "border-primary bg-primary" : "border-border")
                          }
                        >
                          {selected && (
                            <span className="h-2 w-2 rounded-full bg-primary-foreground" />
                          )}
                        </span>
                        <div>
                          <p className="font-medium text-foreground">{s.name}</p>
                          <p className="mt-0.5 flex items-center gap-1.5 text-xs text-muted-foreground">
                            <Clock className="h-3.5 w-3.5" strokeWidth={1.75} />
                            {s.duration}
                          </p>
                        </div>
                      </div>
                      <span className="ml-4 shrink-0 font-display text-lg font-semibold text-primary">
                        {formatVND(s.price)}
                      </span>
                    </button>
                  );
                })}
              </div>
            </section>

            <section>
              <h2 className="font-display text-2xl font-medium text-foreground">
                Pick a date & time
              </h2>
              <div className="mt-4">
                <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Date
                </label>
                <input
                  type="date"
                  value={date}
                  min={todayStr()}
                  onChange={(e) => setDate(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-input bg-card px-4 py-2.5 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                />
              </div>
              <p className="mt-5 text-xs font-medium uppercase tracking-wider text-muted-foreground">
                Available slots
              </p>
              <div className="mt-2 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {store.slots.map((t) => {
                  const selected = slot === t;
                  return (
                    <button
                      key={t}
                      onClick={() => setSlot(t)}
                      className={
                        "rounded-xl border-2 py-3 text-sm font-semibold transition-all " +
                        (selected
                          ? "border-primary bg-primary text-primary-foreground shadow-[0_0_0_4px_rgba(158,107,85,0.10)]"
                          : "border-border bg-card text-foreground hover:border-primary/40")
                      }
                    >
                      {t}
                    </button>
                  );
                })}
              </div>
            </section>
          </div>

          {/* Right: contact form */}
          <div>
            <div className="rounded-2xl border border-border bg-card p-6 shadow-[0_8px_30px_-12px_rgba(42,36,33,0.12)] sm:p-7">
              <h2 className="font-display text-2xl font-medium text-foreground">
                Your details
              </h2>
              <p className="mt-1 text-sm text-muted-foreground">
                Guest checkout — just your name and phone number.
              </p>

              <div className="mt-6 space-y-5">
                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Full name
                  </label>
                  <div className="relative mt-1.5">
                    <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Nguyen Van A"
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Phone number
                  </label>
                  <div className="relative mt-1.5">
                    <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" strokeWidth={1.75} />
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="e.g. 0901 234 567"
                      className="w-full rounded-xl border border-input bg-background py-3 pl-10 pr-4 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </div>

                <div>
                  <label className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                    Preferred staff
                  </label>
                  <select
                    value={staff}
                    onChange={(e) => setStaff(e.target.value)}
                    className="mt-1.5 w-full rounded-xl border border-input bg-background px-4 py-3 text-sm text-foreground outline-none focus:border-primary focus:ring-2 focus:ring-primary/20"
                  >
                    {store.staff.map((p) => (
                      <option key={p} value={p}>
                        {p}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Summary */}
              <div className="mt-6 rounded-xl border border-border bg-secondary/60 p-4">
                <p className="text-xs font-medium uppercase tracking-wider text-muted-foreground">
                  Summary
                </p>
                <dl className="mt-2 space-y-1.5 text-sm">
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Service</dt>
                    <dd className="font-medium text-foreground">
                      {serviceId
                        ? store.services.find((s) => s.id === serviceId)?.name
                        : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Date & time</dt>
                    <dd className="font-medium text-foreground">
                      {date && slot ? `${date} · ${slot}` : "—"}
                    </dd>
                  </div>
                  <div className="flex justify-between">
                    <dt className="text-muted-foreground">Staff</dt>
                    <dd className="font-medium text-foreground">{staff || "—"}</dd>
                  </div>
                  <div className="flex justify-between border-t border-border pt-2">
                    <dt className="text-muted-foreground">Total</dt>
                    <dd className="font-display text-lg font-semibold text-primary">
                      {serviceId
                        ? formatVND(store.services.find((s) => s.id === serviceId).price)
                        : "—"}
                    </dd>
                  </div>
                </dl>
              </div>

              <button
                onClick={handleConfirm}
                disabled={!canSubmit || submitting}
                className="mt-6 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-6 py-3.5 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#8a5d49] disabled:cursor-not-allowed disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    Confirming…
                  </>
                ) : (
                  "Confirm Booking"
                )}
              </button>
              {!canSubmit && (
                <p className="mt-3 text-center text-xs text-muted-foreground">
                  Select a service and time slot to continue.
                </p>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}