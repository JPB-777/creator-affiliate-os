import type { Metadata } from "next";
import Link from "next/link";
import { Link2, ArrowRight } from "lucide-react";

export const metadata: Metadata = {
  title: "Blog",
  description:
    "Tips, guides, and best practices for managing affiliate links, maximizing commissions, and staying FTC-compliant.",
};

const posts = [
  {
    slug: "how-to-find-broken-affiliate-links",
    title: "How to Find Broken Affiliate Links (Before They Cost You Money)",
    description:
      "Broken affiliate links silently drain your commissions. Learn how to detect them, why they break, and how to fix them fast.",
    date: "2026-03-11",
    readTime: "6 min read",
  },
];

export default function BlogPage() {
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

      {/* Blog listing */}
      <section className="mx-auto w-full max-w-3xl px-4 pb-16 pt-16">
        <h1 className="text-3xl font-bold tracking-tight sm:text-4xl">Blog</h1>
        <p className="mt-2 text-muted-foreground">
          Guides and tips for managing your affiliate links effectively.
        </p>

        <div className="mt-10 space-y-8">
          {posts.map((post) => (
            <article key={post.slug} className="group">
              <Link href={`/blog/${post.slug}`} className="block">
                <div className="flex items-center gap-3 text-xs text-muted-foreground">
                  <time dateTime={post.date}>
                    {new Date(post.date).toLocaleDateString("en-US", {
                      year: "numeric",
                      month: "long",
                      day: "numeric",
                    })}
                  </time>
                  <span>&middot;</span>
                  <span>{post.readTime}</span>
                </div>
                <h2 className="mt-2 text-xl font-semibold group-hover:text-primary">
                  {post.title}
                </h2>
                <p className="mt-2 text-sm text-muted-foreground">
                  {post.description}
                </p>
                <span className="mt-3 inline-flex items-center gap-1 text-sm font-medium text-primary">
                  Read more <ArrowRight className="h-3 w-3" />
                </span>
              </Link>
            </article>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="mt-auto border-t py-8">
        <div className="mx-auto flex max-w-6xl flex-col items-center justify-between gap-4 px-4 sm:flex-row">
          <div className="flex items-center gap-2">
            <div className="flex h-6 w-6 items-center justify-center rounded bg-primary">
              <Link2 className="h-3 w-3 text-primary-foreground" />
            </div>
            <span className="text-sm font-semibold">AffiliateOS</span>
          </div>
          <nav className="flex gap-6 text-sm text-muted-foreground">
            <Link href="/" className="hover:text-foreground">
              Home
            </Link>
            <Link href="/pricing" className="hover:text-foreground">
              Pricing
            </Link>
            <a
              href="https://github.com/JPB-777/creator-affiliate-os"
              target="_blank"
              rel="noopener noreferrer"
              className="hover:text-foreground"
            >
              GitHub
            </a>
          </nav>
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} AffiliateOS
          </p>
        </div>
      </footer>
    </div>
  );
}
