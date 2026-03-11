import type { Metadata } from "next";
import Link from "next/link";
import { Check, Github, Link2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Pricing",
  description:
    "AffiliateOS pricing — free self-hosted, free cloud tier, and affordable Pro plan for serious affiliate marketers.",
};

const plans = [
  {
    name: "Self-Hosted",
    price: "Free",
    period: "forever",
    description: "Full power on your own infrastructure. Open-source.",
    features: [
      "Unlimited URLs & scans",
      "All 10+ affiliate networks",
      "Earnings tracker with charts",
      "FTC disclosure generator",
      "Daily auto-scans (Vercel Cron)",
      "Email alerts for broken links",
      "CSV export",
      "OAuth login (GitHub, Google)",
      "Dark mode",
      "Full source code access",
    ],
    cta: "View on GitHub",
    ctaHref: "https://github.com/JPB-777/creator-affiliate-os",
    ctaExternal: true,
    highlight: false,
  },
  {
    name: "Cloud Free",
    price: "$0",
    period: "/mo",
    description: "Hosted for you. No setup, no maintenance. Just scan.",
    features: [
      "Unlimited URLs & scans",
      "Daily auto-scans",
      "All 10+ affiliate networks",
      "Earnings tracker with charts",
      "FTC disclosure generator",
      "Email alerts for broken links",
      "CSV export",
      "OAuth login (GitHub, Google)",
      "Dark mode",
    ],
    cta: "Get started free",
    ctaHref: "/sign-up",
    ctaExternal: false,
    highlight: true,
  },
  {
    name: "Cloud Pro",
    price: "$9",
    period: "/mo",
    description: "Extra features for power users. Coming soon.",
    features: [
      "Everything in Cloud Free",
      "Priority support",
      "Advanced analytics",
      "Team collaboration",
      "API access",
    ],
    cta: "Coming soon",
    ctaHref: "#",
    ctaExternal: false,
    highlight: false,
    disabled: true,
  },
];

const comparisons = [
  { feature: "Affiliate link detection", selfHosted: "10+ networks", cloudFree: "10+ networks", cloudPro: "10+ networks" },
  { feature: "Link health checks", selfHosted: "Unlimited", cloudFree: "Unlimited", cloudPro: "Unlimited" },
  { feature: "Tracked URLs", selfHosted: "Unlimited", cloudFree: "Unlimited", cloudPro: "Unlimited" },
  { feature: "Auto-scan frequency", selfHosted: "Daily", cloudFree: "Daily", cloudPro: "Daily" },
  { feature: "Earnings tracker", selfHosted: "Yes", cloudFree: "Yes", cloudPro: "Yes" },
  { feature: "FTC disclosures", selfHosted: "Yes", cloudFree: "Yes", cloudPro: "Yes" },
  { feature: "Email alerts", selfHosted: "Yes", cloudFree: "Yes", cloudPro: "Yes" },
  { feature: "CSV export", selfHosted: "Yes", cloudFree: "Yes", cloudPro: "Yes" },
  { feature: "OAuth (GitHub/Google)", selfHosted: "Yes", cloudFree: "Yes", cloudPro: "Yes" },
  { feature: "Hosting", selfHosted: "You manage", cloudFree: "We manage", cloudPro: "We manage" },
  { feature: "Support", selfHosted: "Community", cloudFree: "Community", cloudPro: "Priority" },
];

export default function PricingPage() {
  return (
    <div className="flex min-h-screen flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 border-b bg-background/80 backdrop-blur-sm">
        <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4">
          <Link href="/" className="flex items-center gap-2">
            <div className="flex h-7 w-7 items-center justify-center rounded-md bg-primary">
              <Link2 className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="text-lg font-bold">AffiliateOS</span>
          </Link>
          <div className="flex items-center gap-2">
            <Link
              href="/sign-in"
              className="inline-flex h-8 items-center rounded-lg px-3 text-sm font-medium hover:bg-muted"
            >
              Sign in
            </Link>
            <Link
              href="/sign-up"
              className="inline-flex h-8 items-center rounded-lg bg-primary px-3 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Get started free
            </Link>
          </div>
        </div>
      </header>

      {/* Hero */}
      <section className="mx-auto max-w-6xl px-4 pb-12 pt-16 text-center md:pt-20">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl lg:text-5xl">
          Simple, transparent pricing
        </h1>
        <p className="mx-auto mt-4 max-w-lg text-lg text-muted-foreground">
          Start free. Self-host for full control, or let us handle everything.
          Upgrade only when you need more.
        </p>
      </section>

      {/* Plans */}
      <section className="mx-auto w-full max-w-6xl px-4 pb-16">
        <div className="grid gap-6 md:grid-cols-3">
          {plans.map((plan) => (
            <div
              key={plan.name}
              className={`relative flex flex-col rounded-xl border bg-card p-6 ${
                plan.highlight ? "border-2 border-primary" : ""
              }`}
            >
              {plan.highlight && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                  Most popular
                </div>
              )}
              <div>
                <h2 className="text-lg font-semibold">{plan.name}</h2>
                <div className="mt-2 flex items-baseline gap-1">
                  <span className="text-4xl font-bold">{plan.price}</span>
                  <span className="text-sm text-muted-foreground">
                    {plan.period}
                  </span>
                </div>
                <p className="mt-2 text-sm text-muted-foreground">
                  {plan.description}
                </p>
              </div>

              <ul className="mt-6 flex-1 space-y-2.5">
                {plan.features.map((feature) => (
                  <li
                    key={feature}
                    className="flex items-start gap-2 text-sm"
                  >
                    <Check
                      className={`mt-0.5 h-4 w-4 shrink-0 ${
                        plan.highlight
                          ? "text-primary"
                          : "text-muted-foreground"
                      }`}
                    />
                    {feature}
                  </li>
                ))}
              </ul>

              {plan.ctaExternal ? (
                <a
                  href={plan.ctaHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border hover:bg-muted"
                  }`}
                >
                  <Github className="h-4 w-4" />
                  {plan.cta}
                </a>
              ) : plan.disabled ? (
                <div className="mt-6 inline-flex h-10 w-full items-center justify-center rounded-lg border text-sm font-medium text-muted-foreground">
                  {plan.cta}
                </div>
              ) : (
                <Link
                  href={plan.ctaHref}
                  className={`mt-6 inline-flex h-10 w-full items-center justify-center gap-2 rounded-lg text-sm font-medium ${
                    plan.highlight
                      ? "bg-primary text-primary-foreground hover:bg-primary/90"
                      : "border hover:bg-muted"
                  }`}
                >
                  {plan.cta}
                  {plan.highlight && <ArrowRight className="h-4 w-4" />}
                </Link>
              )}
            </div>
          ))}
        </div>
      </section>

      {/* Feature comparison table */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-4xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Compare plans
          </h2>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b text-left">
                  <th className="pb-3 pr-4 font-semibold">Feature</th>
                  <th className="pb-3 px-4 font-semibold">Self-Hosted</th>
                  <th className="pb-3 px-4 font-semibold">Cloud Free</th>
                  <th className="pb-3 pl-4 font-semibold">Cloud Pro</th>
                </tr>
              </thead>
              <tbody>
                {comparisons.map((row) => (
                  <tr key={row.feature} className="border-b">
                    <td className="py-3 pr-4 text-muted-foreground">
                      {row.feature}
                    </td>
                    <td className="py-3 px-4">{row.selfHosted}</td>
                    <td className="py-3 px-4">{row.cloudFree}</td>
                    <td className="py-3 pl-4">{row.cloudPro}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-8 text-center text-2xl font-bold">
            Pricing FAQ
          </h2>
          <div className="space-y-6">
            <div>
              <h3 className="mb-1 font-semibold">
                Is the cloud free plan really unlimited?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. The cloud free plan currently has no URL limits. We may
                introduce usage tiers in the future as Pro launches, but
                existing users will be grandfathered.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">
                Can I switch between self-hosted and cloud?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. The self-hosted version uses the same codebase. You can
                start with cloud and migrate to self-hosted anytime (or vice
                versa). Data export via CSV makes migration easy.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">
                Is the self-hosted version really unlimited?
              </h3>
              <p className="text-sm text-muted-foreground">
                Yes. When you self-host, there are no artificial limits. The
                only constraints are your server resources. It&apos;s the full
                product.
              </p>
            </div>
            <div>
              <h3 className="mb-1 font-semibold">
                Do you offer refunds?
              </h3>
              <p className="text-sm text-muted-foreground">
                The Pro plan is billed monthly with no contract. Cancel anytime.
                If you&apos;re not satisfied within the first 14 days, we&apos;ll
                refund you — no questions asked.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold">
            Ready to find your broken affiliate links?
          </h2>
          <p className="mx-auto mt-3 max-w-md text-muted-foreground">
            Scan your first URL in under 60 seconds. No credit card required.
          </p>
          <Link
            href="/sign-up"
            className="mt-6 inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
          >
            Start scanning free
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Link2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">AffiliateOS</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <a
              href="https://github.com/JPB-777/creator-affiliate-os"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AffiliateOS. Open-source under BSL 1.1.
          </p>
        </div>
      </footer>
    </div>
  );
}
