"use client";

import { useState, useRef } from "react";
import { addEarning } from "@/server/actions/earnings";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

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
  const [network, setNetwork] = useState("");
  const formRef = useRef<HTMLFormElement>(null);

  const now = new Date();
  const defaultPeriod = `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}`;

  async function handleSubmit(formData: FormData) {
    if (!network) return;
    formData.set("networkName", network);
    setLoading(true);
    try {
      await addEarning(formData);
      toast.success("Earning added");
      setNetwork("");
      formRef.current?.reset();
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
        <form ref={formRef} action={handleSubmit} className="flex flex-wrap items-end gap-3">
          <Select value={network} onValueChange={(v) => setNetwork(v ?? "")} required>
            <SelectTrigger className="w-[200px]">
              <SelectValue placeholder="Select network" />
            </SelectTrigger>
            <SelectContent>
              {NETWORKS.map((n) => (
                <SelectItem key={n} value={n}>
                  {n}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <Button type="submit" disabled={loading || !network}>
            {loading ? "Adding..." : "Add"}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
}
