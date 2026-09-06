import { Outlet, Link, useLocation } from "react-router-dom";
import { Sparkles, ShieldCheck } from "lucide-react";

export default function Layout() {
  const location = useLocation();
  const isAdmin = location.pathname.startsWith("/admin");

  return (
    <div className="min-h-screen bg-background text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-40 border-b border-border bg-background/85 backdrop-blur-md">
        <div className="mx-auto flex h-16 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center gap-2.5">
            <span className="flex h-9 w-9 items-center justify-center rounded-full bg-primary text-primary-foreground">
              <Sparkles className="h-4 w-4" strokeWidth={1.75} />
            </span>
            <span className="font-display text-xl font-medium tracking-tight text-foreground sm:text-2xl">
              AURA <span className="italic text-primary">Beauty</span> Marketplace
            </span>
          </Link>

          <Link
            to={isAdmin ? "/" : "/admin"}
            className="inline-flex items-center gap-2 rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-foreground transition-colors hover:border-primary hover:text-primary"
          >
            <ShieldCheck className="h-4 w-4" strokeWidth={1.75} />
            {isAdmin ? "Back to Marketplace" : "Admin Portal"}
          </Link>
        </div>
      </header>

      <main>
        <Outlet />
      </main>

      <footer className="border-t border-border bg-background">
        <div className="mx-auto max-w-7xl px-4 py-8 text-center sm:px-6 lg:px-8">
          <p className="font-display text-lg italic text-muted-foreground">
            AURA Beauty Marketplace
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            A demo booking experience · Guest checkout, no account needed.
          </p>
        </div>
      </footer>
    </div>
  );
}