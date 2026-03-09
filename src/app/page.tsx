import Link from "next/link";

const features = [
  {
    title: "Affiliate Link Scanner",
    description:
      "Scan your blog posts and pages to automatically detect affiliate links from 10+ networks.",
  },
  {
    title: "Broken Link Detection",
    description:
      "Find broken affiliate links that are costing you commissions and fix them fast.",
  },
  {
    title: "Earnings Tracker",
    description:
      "Track your affiliate earnings by network and period in one central dashboard.",
  },
  {
    title: "Disclosure Generator",
    description:
      "Generate FTC-compliant disclosures for blogs, YouTube, social media, and more.",
  },
  {
    title: "Link Analytics",
    description:
      "See which affiliate networks you use most, track scan history, and monitor link health.",
  },
];

export default function LandingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="border-b">
        <div className="mx-auto flex h-14 max-w-5xl items-center justify-between px-4">
          <span className="text-lg font-bold">AffiliateOS</span>
          <div className="flex gap-3">
            <Link
              href="/sign-in"
              className="inline-flex h-8 items-center rounded-lg px-2.5 text-sm font-medium hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-2.5 text-sm font-medium text-primary-foreground"
            >
              Get Started
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-3xl px-4 py-24 text-center">
        <h1 className="text-4xl font-bold tracking-tight sm:text-5xl">
          Your affiliate links,
          <br />
          <span className="text-primary">under control.</span>
        </h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">
          Scan your content for affiliate links, catch broken ones before they
          cost you money, track earnings, and stay FTC-compliant.
        </p>
        <div className="mt-8 flex justify-center gap-3">
          <Link
            href="/sign-up"
            className="inline-flex h-9 items-center rounded-lg bg-primary px-4 text-sm font-medium text-primary-foreground"
          >
            Start for free
          </Link>
        </div>
      </section>

      {/* Features */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-5xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Everything you need to manage affiliate links
          </h2>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-lg border bg-card p-6">
                <h3 className="font-semibold">{feature.title}</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-6 text-center text-sm text-muted-foreground">
        AffiliateOS
      </footer>
    </div>
  );
}
