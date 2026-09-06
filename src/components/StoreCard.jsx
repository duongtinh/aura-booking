import { Link } from "react-router-dom";
import { MapPin, Star, ArrowRight } from "lucide-react";
import { Image } from "@/components/ui/image";
import { getStoreImage } from "@/lib/storeImages";

const categoryLabel = {
  Spa: "Spa & Wellness",
  Hair: "Hair Studios",
};

export default function StoreCard({ store }) {
  return (
    <div className="group flex flex-col overflow-hidden rounded-2xl border border-border bg-card shadow-[0_8px_30px_-12px_rgba(42,36,33,0.12)] transition-all duration-300 hover:-translate-y-1 hover:shadow-[0_20px_40px_-16px_rgba(158,107,85,0.22)]">
      <div className="relative aspect-[16/9] overflow-hidden rounded-t-2xl">
        <Image
          src={getStoreImage(store.id)}
          alt={store.name}
          fittingType="fill"
          className="h-full w-full transition-transform duration-700 group-hover:scale-105"
        />
        <span className="absolute left-4 top-4 inline-flex items-center rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-medium text-foreground backdrop-blur-sm">
          {categoryLabel[store.category] || store.category}
        </span>
        <span className="absolute right-4 top-4 inline-flex items-center gap-1.5 rounded-full border border-border bg-background/90 px-3 py-1 text-xs font-semibold text-foreground backdrop-blur-sm">
          <Star className="h-3.5 w-3.5 fill-[#D9822B] text-[#D9822B]" />
          {store.rating.toFixed(1)}
        </span>
      </div>

      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-display text-2xl font-medium leading-tight text-foreground">
          {store.name}
        </h3>
        <p className="mt-2 flex items-start gap-1.5 text-sm text-muted-foreground">
          <MapPin className="mt-0.5 h-4 w-4 shrink-0" strokeWidth={1.75} />
          {store.address}
        </p>
        <p className="mt-3 text-sm leading-relaxed text-muted-foreground line-clamp-2">
          {store.description}
        </p>

        <Link
          to={`/store/${store.id}`}
          className="mt-5 inline-flex w-full items-center justify-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-semibold text-primary-foreground transition-all hover:bg-[#8a5d49]"
        >
          Book Appointment
          <ArrowRight className="h-4 w-4" strokeWidth={2} />
        </Link>
      </div>
    </div>
  );
}