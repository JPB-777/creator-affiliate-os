"use client";

import { useState } from "react";
import { addEarning } from "@/server/actions/earnings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
  "Other",
];

export function AddEarningForm() {
  const [loading, setLoading] = useState(false);

  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  async function handleSubmit(formData: FormData) {
    setLoading(true);
    try {
      await addEarning(formData);
    } finally {
      setLoading(false);
    }
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Add Earning</CardTitle>
      </CardHeader>
      <CardContent>
        <form action={handleSubmit} className="flex flex-wrap gap-3">
          <select
            name="networkName"
            required
            className="rounded-md border bg-background px-3 py-2 text-sm"
          >
            <option value="">Select network</option>
            {NETWORKS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
          <Input
            name="amount"
            type="number"
            step="0.01"
            min="0"
            placeholder="Amount ($)"
            required
            className="w-32"
          />
          <Input
            name="period"
            type="month"
            defaultValue={defaultPeriod}
            required
            className="w-40"
          />
          <Input
            name="notes"
            placeholder="Notes (optional)"
            className="w-48"
          />
          <Button type="submit" disabled={loading}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
