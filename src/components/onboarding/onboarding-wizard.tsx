"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { addUrl } from "@/server/actions/urls";
import { saveOnboardingStep, completeOnboarding, skipOnboarding } from "@/server/actions/onboarding";
import { toast } from "sonner";
import {
  Rocket,
  Globe,
  ScanSearch,
  DollarSign,
  CheckCircle2,
  ArrowRight,
  ArrowLeft,
  Loader2,
  SkipForward,
  Link2,
} from "lucide-react";

interface OnboardingWizardProps {
  userName: string;
  completedSteps: string[];
  urlAdded?: string;
}

const STEPS = ["welcome", "add-url", "scan-results", "first-earning", "complete"] as const;

export function OnboardingWizard({ userName, completedSteps }: OnboardingWizardProps) {
  const router = useRouter();
  const [isPending, startTransition] = useTransition();

  // Determine starting step based on completed steps
  const initialStep = completedSteps.length === 0
    ? 0
    : Math.min(completedSteps.length, STEPS.length - 1);
  const [currentStep, setCurrentStep] = useState(initialStep);

  const [url, setUrl] = useState("");
  const [platform, setPlatform] = useState("blog");
  const [scanResult, setScanResult] = useState<{
    title?: string | null;
    totalLinks?: number;
    id?: string;
  } | null>(null);

  const step = STEPS[currentStep];

  function goNext() {
    if (currentStep < STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  }

  function goBack() {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  }

  function handleAddUrl() {
    if (!url.trim()) {
      toast.error("Please enter a URL");
      return;
    }
    startTransition(async () => {
      try {
        const formData = new FormData();
        formData.set("url", url.trim());
        formData.set("platform", platform);
        const result = await addUrl(formData);
        setScanResult({ title: result.title, totalLinks: result.totalLinks ?? 0, id: result.id });
        await saveOnboardingStep("add-url", { urlAdded: result.id });
        toast.success("URL added and scanned!");
        goNext();
      } catch {
        toast.error("Failed to add URL. Please try again.");
      }
    });
  }

  function handleSkipEarning() {
    startTransition(async () => {
      await saveOnboardingStep("first-earning");
      goNext();
    });
  }

  function handleComplete() {
    startTransition(async () => {
      await completeOnboarding();
      router.push("/dashboard");
      router.refresh();
    });
  }

  function handleSkipAll() {
    startTransition(async () => {
      await skipOnboarding();
      router.push("/dashboard");
      router.refresh();
    });
  }

  return (
    <div className="mx-auto max-w-2xl py-8">
      {/* Progress bar */}
      <div className="mb-8">
        <div className="flex items-center justify-between mb-2">
          {STEPS.map((s, i) => (
            <div
              key={s}
              className={`flex h-2 flex-1 rounded-full mx-0.5 transition-colors ${
                i <= currentStep ? "bg-primary" : "bg-muted"
              }`}
            />
          ))}
        </div>
        <p className="text-center text-xs text-muted-foreground">
          Step {currentStep + 1} of {STEPS.length}
        </p>
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={step}
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -20 }}
          transition={{ duration: 0.2 }}
        >
          <Card>
            <CardContent className="p-8">
              {step === "welcome" && (
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                    <Rocket className="h-8 w-8 text-primary" />
                  </div>
                  <h1 className="text-2xl font-bold">Welcome, {userName}!</h1>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Let&apos;s set up your affiliate link management in just a few steps.
                    You&apos;ll add your first URL, scan it for affiliate links, and optionally
                    log your first earning.
                  </p>
                  <div className="flex gap-3 justify-center pt-4">
                    <Button onClick={() => { startTransition(async () => { await saveOnboardingStep("welcome"); goNext(); }); }} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Get Started
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === "add-url" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-primary/10">
                      <Globe className="h-8 w-8 text-primary" />
                    </div>
                    <h2 className="text-xl font-bold">Add Your First URL</h2>
                    <p className="text-muted-foreground text-sm">
                      Enter a URL from your content that contains affiliate links.
                      We&apos;ll scan it automatically.
                    </p>
                  </div>
                  <div className="space-y-4">
                    <div className="space-y-2">
                      <Label htmlFor="url">URL</Label>
                      <Input
                        id="url"
                        placeholder="https://myblog.com/best-cameras-2026"
                        value={url}
                        onChange={(e) => setUrl(e.target.value)}
                        disabled={isPending}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="platform">Platform</Label>
                      <Select value={platform} onValueChange={(v) => setPlatform(v ?? "blog")} disabled={isPending}>
                        <SelectTrigger id="platform">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="blog">Blog Post</SelectItem>
                          <SelectItem value="youtube">YouTube</SelectItem>
                          <SelectItem value="newsletter">Newsletter</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="other">Other</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={goBack} disabled={isPending}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={handleAddUrl} disabled={isPending || !url.trim()}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <ScanSearch className="h-4 w-4 mr-2" />}
                      Scan URL
                    </Button>
                  </div>
                </div>
              )}

              {step === "scan-results" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                      <ScanSearch className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-xl font-bold">Scan Complete!</h2>
                    <p className="text-muted-foreground text-sm">
                      We scanned your URL and found the following:
                    </p>
                  </div>
                  {scanResult && (
                    <div className="rounded-lg border p-4 space-y-2">
                      <p className="font-medium truncate">
                        {scanResult.title || url}
                      </p>
                      <div className="flex items-center gap-2 text-sm text-muted-foreground">
                        <Link2 className="h-4 w-4" />
                        <span>{scanResult.totalLinks ?? 0} affiliate links found</span>
                      </div>
                    </div>
                  )}
                  <p className="text-sm text-muted-foreground text-center">
                    You can view full scan details on the URL detail page after onboarding.
                  </p>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={goBack} disabled={isPending}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <Button onClick={() => { startTransition(async () => { await saveOnboardingStep("scan-results"); goNext(); }); }} disabled={isPending}>
                      {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                      Continue
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                  </div>
                </div>
              )}

              {step === "first-earning" && (
                <div className="space-y-6">
                  <div className="text-center space-y-2">
                    <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                      <DollarSign className="h-8 w-8 text-success" />
                    </div>
                    <h2 className="text-xl font-bold">Track Your Earnings</h2>
                    <p className="text-muted-foreground text-sm">
                      You can log affiliate earnings to track your revenue over time.
                      This step is optional — you can always add earnings later from the Earnings page.
                    </p>
                  </div>
                  <div className="flex justify-between pt-2">
                    <Button variant="ghost" onClick={goBack} disabled={isPending}>
                      <ArrowLeft className="h-4 w-4 mr-2" />
                      Back
                    </Button>
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleSkipEarning} disabled={isPending}>
                        <SkipForward className="h-4 w-4 mr-2" />
                        Skip for now
                      </Button>
                    </div>
                  </div>
                </div>
              )}

              {step === "complete" && (
                <div className="text-center space-y-4">
                  <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-2xl bg-success/10">
                    <CheckCircle2 className="h-8 w-8 text-success" />
                  </div>
                  <h2 className="text-2xl font-bold">You&apos;re All Set!</h2>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Your AffiliateOS workspace is ready. Head to the dashboard to see your
                    stats, manage links, and grow your affiliate revenue.
                  </p>
                  <Button onClick={handleComplete} disabled={isPending} size="lg" className="mt-4">
                    {isPending ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : null}
                    Go to Dashboard
                    <ArrowRight className="h-4 w-4 ml-2" />
                  </Button>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </AnimatePresence>

      {/* Skip all button */}
      {step !== "complete" && (
        <div className="mt-4 text-center">
          <Button variant="link" className="text-muted-foreground text-xs" onClick={handleSkipAll} disabled={isPending}>
            Skip onboarding
          </Button>
        </div>
      )}
    </div>
  );
}
