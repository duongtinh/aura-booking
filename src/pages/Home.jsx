import { useState, useEffect } from "react";
import { getStores } from "@/lib/api";
import StoreCard from "@/components/StoreCard";
import { Loader2 } from "lucide-react";

const filters = [
  { key: "All", label: "All Services" },
  { key: "Spa", label: "Spa & Wellness" },
  { key: "Hair", label: "Hair Studios" },
];

export default function Home() {
  const [stores, setStores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [active, setActive] = useState("All");

  useEffect(() => {
    getStores()
      .then((data) => setStores(data))
      .finally(() => setLoading(false));
  }, []);

  const visible =
    active === "All" ? stores : stores.filter((s) => s.category === active);

  return (
    <div>
      {/* Hero */}
      <section className="border-b border-border bg-gradient-to-b from-secondary to-background">
        <div className="mx-auto max-w-7xl px-4 py-14 text-center sm:px-6 sm:py-20 lg:px-8">
          <p className="text-xs font-medium uppercase tracking-[0.25em] text-primary">
            Curated sanctuaries
          </p>
          <h1 className="mx-auto mt-4 max-w-3xl font-display text-4xl font-light leading-tight text-foreground sm:text-5xl lg:text-6xl">
            Book your moment of <span className="italic text-primary">beauty</span>
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base text-muted-foreground">
            Discover handpicked spas and hair studios. Reserve in seconds —
            guest checkout, no account required.
          </p>
        </div>
      </section>

      {/* Filter + grid */}
      <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
        {/* Capsule filter bar */}
        <div className="flex justify-center">
          <div className="inline-flex items-center gap-1 rounded-full border border-border bg-card p-1.5 shadow-[0_8px_30px_-18px_rgba(42,36,33,0.18)]">
            {filters.map((f) => (
              <button
                key={f.key}
                onClick={() => setActive(f.key)}
                className={
                  "rounded-full px-4 py-2 text-sm font-medium transition-all sm:px-6 " +
                  (active === f.key
                    ? "bg-primary text-primary-foreground shadow-sm"
                    : "text-muted-foreground hover:text-foreground")
                }
              >
                {f.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="flex justify-center py-24">
            <Loader2 className="h-7 w-7 animate-spin text-primary" />
          </div>
        ) : (
          <div className="mt-10 grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {visible.map((store) => (
              <StoreCard key={store.id} store={store} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}