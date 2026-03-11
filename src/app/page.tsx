import Link from "next/link";
import {
  Search,
  AlertTriangle,
  DollarSign,
  Shield,
  BarChart3,
  Zap,
  ArrowRight,
  Check,
  Link2,
  FileText,
  RefreshCw,
  Download,
  Github,
} from "lucide-react";

const networks = [
  "Amazon Associates",
  "ShareASale",
  "CJ Affiliate",
  "Impact",
  "Rakuten",
  "Awin",
  "ClickBank",
  "Partnerize",
  "FlexOffers",
  "Skimlinks",
];

const features = [
  {
    icon: Search,
    title: "Scan Any URL",
    description:
      "Paste a URL and instantly detect every affiliate link across 10+ networks. No setup, no browser extension — just results.",
  },
  {
    icon: AlertTriangle,
    title: "Catch Broken Links",
    description:
      "Find affiliate links returning 404s, redirects, or timeouts. Each broken link is a commission you're silently losing.",
  },
  {
    icon: DollarSign,
    title: "Track Earnings",
    description:
      "Log your affiliate revenue by network and period. See monthly trends and spot which content actually earns.",
  },
  {
    icon: Shield,
    title: "FTC Disclosures",
    description:
      "Generate compliant disclosure text for blogs, YouTube, social media, email, and podcasts in one click.",
  },
  {
    icon: BarChart3,
    title: "Dashboard Analytics",
    description:
      "See your top-performing content, network distribution, scan history, and link health — all in one view.",
  },
  {
    icon: RefreshCw,
    title: "Auto-Scan Daily",
    description:
      "Set it and forget it. AffiliateOS re-scans your URLs every day and alerts you when links break.",
  },
];

const moreFeatures = [
  { icon: Link2, text: "Bulk import up to 20 URLs at once" },
  { icon: Download, text: "Export links & earnings as CSV" },
  { icon: FileText, text: "Tag and categorize your content" },
  { icon: Zap, text: "Replace broken links inline" },
];

const faqs = [
  {
    q: "What affiliate networks do you support?",
    a: "AffiliateOS detects links from Amazon Associates, ShareASale, CJ Affiliate, Impact, Rakuten, Awin, ClickBank, Partnerize, FlexOffers, Skimlinks, and any link with common affiliate parameters.",
  },
  {
    q: "Is AffiliateOS free?",
    a: "The self-hosted version is completely free and open-source. We also offer a managed cloud version with a generous free tier so you don't have to worry about hosting.",
  },
  {
    q: "Do I need to install anything?",
    a: "No. AffiliateOS is a web app — just sign up and start scanning. If you prefer self-hosting, you can deploy with Docker or Vercel + Neon in minutes.",
  },
  {
    q: "How does the scanner work?",
    a: "You paste a URL, and AffiliateOS fetches the page, extracts all links, identifies which ones are affiliate links using network-specific patterns, then checks each affiliate link's HTTP status to flag broken, redirected, or timed-out links.",
  },
  {
    q: "Is my data private?",
    a: "Yes. All data is isolated per user account. AffiliateOS is open-source, so you can verify exactly what happens with your data. Self-hosters keep everything on their own infrastructure.",
  },
  {
    q: "Can I use this with any website, not just WordPress?",
    a: "Absolutely. AffiliateOS works with any publicly accessible URL — WordPress, Squarespace, Ghost, custom sites, or anything with a public page.",
  },
];

export default function LandingPage() {
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
          <nav className="hidden items-center gap-6 text-sm md:flex">
            <a href="#features" className="text-muted-foreground hover:text-foreground">
              Features
            </a>
            <a href="#how-it-works" className="text-muted-foreground hover:text-foreground">
              How it works
            </a>
            <Link href="/pricing" className="text-muted-foreground hover:text-foreground">
              Pricing
            </Link>
            <a href="#faq" className="text-muted-foreground hover:text-foreground">
              FAQ
            </a>
          </nav>
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
      <section className="mx-auto max-w-6xl px-4 pb-16 pt-20 md:pt-28">
        <div className="mx-auto max-w-3xl text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full border bg-muted/50 px-3 py-1 text-xs font-medium text-muted-foreground">
            <Github className="h-3 w-3" />
            Open-source &middot; Self-hostable &middot; Free tier
          </div>
          <h1 className="text-4xl font-bold tracking-tight sm:text-5xl lg:text-6xl">
            Your affiliate links,
            <br />
            <span className="text-primary">under control.</span>
          </h1>
          <p className="mx-auto mt-5 max-w-2xl text-lg text-muted-foreground sm:text-xl">
            Scan your content for affiliate links. Catch broken ones before they
            cost you commissions. Track earnings across networks. Stay
            FTC-compliant.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start scanning free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/JPB-777/creator-affiliate-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-medium hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              View on GitHub
            </a>
          </div>
        </div>

        {/* Social proof placeholder */}
        <div className="mx-auto mt-12 max-w-xl text-center">
          <p className="text-xs uppercase tracking-wider text-muted-foreground">
            Detects affiliate links from
          </p>
          <div className="mt-3 flex flex-wrap justify-center gap-x-4 gap-y-1">
            {networks.map((name) => (
              <span
                key={name}
                className="text-xs font-medium text-muted-foreground/70"
              >
                {name}
              </span>
            ))}
          </div>
        </div>
      </section>

      {/* How it works */}
      <section id="how-it-works" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            How it works
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            Three steps. Under a minute. No setup required.
          </p>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: "1",
                title: "Paste your URL",
                description:
                  "Drop any blog post, article, or page URL. AffiliateOS fetches it and extracts every link.",
              },
              {
                step: "2",
                title: "See what's broken",
                description:
                  "Instantly see which affiliate links are healthy, broken, redirected, or timing out. Across 10+ networks.",
              },
              {
                step: "3",
                title: "Fix & track",
                description:
                  "Replace broken links, track your earnings by network, and generate FTC disclosures. All from one dashboard.",
              },
            ].map((item) => (
              <div key={item.step} className="text-center">
                <div className="mx-auto mb-4 flex h-10 w-10 items-center justify-center rounded-full bg-primary text-lg font-bold text-primary-foreground">
                  {item.step}
                </div>
                <h3 className="mb-2 text-lg font-semibold">{item.title}</h3>
                <p className="text-sm text-muted-foreground">
                  {item.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Features */}
      <section id="features" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            Everything you need to manage affiliate links
          </h2>
          <p className="mx-auto mb-12 max-w-lg text-center text-muted-foreground">
            Stop juggling spreadsheets and network dashboards. One tool for your
            entire affiliate workflow.
          </p>
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {features.map((feature) => (
              <div key={feature.title} className="rounded-xl border bg-card p-6">
                <div className="mb-3 flex h-9 w-9 items-center justify-center rounded-lg bg-muted">
                  <feature.icon className="h-5 w-5 text-foreground" />
                </div>
                <h3 className="mb-1 font-semibold">{feature.title}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {feature.description}
                </p>
              </div>
            ))}
          </div>

          {/* Additional features */}
          <div className="mx-auto mt-10 grid max-w-2xl grid-cols-2 gap-4 sm:grid-cols-4">
            {moreFeatures.map((f) => (
              <div
                key={f.text}
                className="flex flex-col items-center gap-2 text-center"
              >
                <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                  <f.icon className="h-4 w-4 text-muted-foreground" />
                </div>
                <span className="text-xs text-muted-foreground">{f.text}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Pain point / value section */}
      <section className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-6xl px-4">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="mb-4 text-2xl font-bold sm:text-3xl">
              Every broken affiliate link is a commission you&apos;ll never see
            </h2>
            <p className="text-muted-foreground">
              Networks change their URLs. Programs shut down. Links rot over
              time. If you have 50+ articles with affiliate links, chances are
              some are already broken — and you don&apos;t know which ones.
            </p>
            <p className="mt-4 text-muted-foreground">
              AffiliateOS scans your content, finds exactly which affiliate
              links are dead, and helps you fix them before you lose more
              revenue.
            </p>
            <Link
              href="/sign-up"
              className="mt-8 inline-flex h-10 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Find your broken links
              <ArrowRight className="h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* Pricing preview */}
      <section id="pricing" className="py-16">
        <div className="mx-auto max-w-6xl px-4">
          <h2 className="mb-2 text-center text-2xl font-bold sm:text-3xl">
            Simple, transparent pricing
          </h2>
          <p className="mx-auto mb-10 max-w-lg text-center text-muted-foreground">
            Start free. Upgrade when you need more.
          </p>
          <div className="mx-auto grid max-w-4xl gap-6 md:grid-cols-3">
            {/* Self-hosted */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold">Self-Hosted</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">Free</span>
                <span className="text-sm text-muted-foreground"> forever</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Deploy on your own infrastructure
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Unlimited URLs & scans",
                  "All 10+ networks",
                  "Earnings tracker",
                  "FTC disclosures",
                  "Full source code",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
              <a
                href="https://github.com/JPB-777/creator-affiliate-os"
                target="_blank"
                rel="noopener noreferrer"
                className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium hover:bg-muted"
              >
                View on GitHub
              </a>
            </div>

            {/* Cloud Free */}
            <div className="relative rounded-xl border-2 border-primary bg-card p-6">
              <div className="absolute -top-3 left-1/2 -translate-x-1/2 rounded-full bg-primary px-3 py-0.5 text-xs font-medium text-primary-foreground">
                Popular
              </div>
              <h3 className="font-semibold">Cloud Free</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">$0</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                Hosted for you, no setup needed
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Unlimited URLs & scans",
                  "Daily auto-scans",
                  "All 10+ networks",
                  "Earnings tracker",
                  "FTC disclosures",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-primary" />
                    {item}
                  </li>
                ))}
              </ul>
              <Link
                href="/sign-up"
                className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-lg bg-primary text-sm font-medium text-primary-foreground hover:bg-primary/90"
              >
                Get started free
              </Link>
            </div>

            {/* Cloud Pro */}
            <div className="rounded-xl border bg-card p-6">
              <h3 className="font-semibold">Cloud Pro</h3>
              <div className="mt-2">
                <span className="text-3xl font-bold">$9</span>
                <span className="text-sm text-muted-foreground">/mo</span>
              </div>
              <p className="mt-2 text-xs text-muted-foreground">
                For creators serious about affiliate revenue
              </p>
              <ul className="mt-5 space-y-2">
                {[
                  "Everything in Free",
                  "Priority support",
                  "Advanced analytics",
                  "Team collaboration",
                  "API access",
                ].map((item) => (
                  <li key={item} className="flex items-start gap-2 text-sm">
                    <Check className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    {item}
                  </li>
                ))}
              </ul>
              <div className="mt-6 inline-flex h-9 w-full items-center justify-center rounded-lg border text-sm font-medium text-muted-foreground">
                Coming soon
              </div>
            </div>
          </div>
          <p className="mt-6 text-center text-xs text-muted-foreground">
            All plans include dark mode, OAuth login, and full link health monitoring.
          </p>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="border-t bg-muted/30 py-16">
        <div className="mx-auto max-w-3xl px-4">
          <h2 className="mb-10 text-center text-2xl font-bold sm:text-3xl">
            Frequently asked questions
          </h2>
          <div className="space-y-6">
            {faqs.map((faq) => (
              <div key={faq.q}>
                <h3 className="mb-1 font-semibold">{faq.q}</h3>
                <p className="text-sm leading-relaxed text-muted-foreground">
                  {faq.a}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-16">
        <div className="mx-auto max-w-6xl px-4 text-center">
          <h2 className="text-2xl font-bold sm:text-3xl">
            Stop losing commissions on broken links
          </h2>
          <p className="mx-auto mt-3 max-w-lg text-muted-foreground">
            Scan your first URL in under 60 seconds. Free forever on the
            self-hosted plan, or get started with the cloud free tier.
          </p>
          <div className="mt-8 flex flex-col items-center justify-center gap-3 sm:flex-row">
            <Link
              href="/sign-up"
              className="inline-flex h-11 items-center gap-2 rounded-lg bg-primary px-5 text-sm font-medium text-primary-foreground hover:bg-primary/90"
            >
              Start scanning free
              <ArrowRight className="h-4 w-4" />
            </Link>
            <a
              href="https://github.com/JPB-777/creator-affiliate-os"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex h-11 items-center gap-2 rounded-lg border px-5 text-sm font-medium hover:bg-muted"
            >
              <Github className="h-4 w-4" />
              Star on GitHub
            </a>
          </div>
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
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <a href="#faq" className="hover:text-foreground">
              FAQ
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AffiliateOS. Open-source under BSL 1.1.
          </p>
        </div>
      </footer>
    </div>
  );
}
