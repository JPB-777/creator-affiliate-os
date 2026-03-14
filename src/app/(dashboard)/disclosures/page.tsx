"use client";

import { useState } from "react";
import { generateDisclosure, CONTENT_TYPES, type ContentType } from "@/lib/disclosures";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";

const NETWORKS = [
  "Amazon Associates",
  "ShareASale",
  "Commission Junction (CJ)",
  "Impact",
  "Rakuten Advertising",
  "Awin",
  "ClickBank",
  "Partnerize",
  "FlexOffers",
  "Skimlinks",
];

export default function DisclosuresPage() {
  const [contentType, setContentType] = useState<ContentType>("blog");
  const [selectedNetworks, setSelectedNetworks] = useState<string[]>([]);
  const [copied, setCopied] = useState(false);

  function toggleNetwork(network: string) {
    setSelectedNetworks((prev) =>
      prev.includes(network)
        ? prev.filter((n) => n !== network)
        : [...prev, network]
    );
  }

  const disclosure = generateDisclosure({
    contentType,
    networks: selectedNetworks,
  });

  async function copyToClipboard() {
    await navigator.clipboard.writeText(disclosure);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <AnimatedLayout>
    <div className="space-y-6">
      <PageHeader
        title="Disclosure Generator"
        description="Generate FTC-compliant disclosure text for your content"
      />

      <div className="grid gap-6 md:grid-cols-2">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Content Type</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {CONTENT_TYPES.map((type) => (
                  <Button
                    key={type.value}
                    variant={contentType === type.value ? "default" : "outline"}
                    size="sm"
                    onClick={() => setContentType(type.value)}
                  >
                    {type.label}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-base">
                Affiliate Networks Used
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {NETWORKS.map((network) => (
                  <Badge
                    key={network}
                    variant={
                      selectedNetworks.includes(network)
                        ? "default"
                        : "outline"
                    }
                    className="cursor-pointer"
                    onClick={() => toggleNetwork(network)}
                  >
                    {network}
                  </Badge>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Generated Disclosure</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="min-h-[120px] rounded-md border bg-muted/50 p-4 text-sm">
              {disclosure}
            </div>
            <Button onClick={copyToClipboard} className="w-full">
              {copied ? "Copied!" : "Copy to Clipboard"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
    </AnimatedLayout>
  );
}
