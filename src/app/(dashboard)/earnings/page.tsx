import { requireUser } from "@/lib/auth-utils";
import { getEarnings, getEarningsSummary } from "@/server/queries/earnings";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { AddEarningForm } from "@/components/earnings/add-earning-form";
import { DeleteEarningButton } from "@/components/earnings/delete-earning-button";
import { PaginationControls } from "@/components/ui/pagination-controls";
import { EarningFilters } from "@/components/earnings/earning-filters";
import { ExportEarningsButton } from "@/components/earnings/export-button";
import { Calendar, DollarSign, Trophy } from "lucide-react";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";

export default async function EarningsPage({
  searchParams,
}: {
  searchParams: Promise<{ page?: string; search?: string; network?: string }>;
}) {
  const user = await requireUser();
  const params = await searchParams;
  const page = Math.max(1, parseInt(params.page ?? "1", 10) || 1);
  const filters = {
    search: params.search || undefined,
    network: params.network || undefined,
  };
  const [{ data: earningsList, totalPages }, summary] = await Promise.all([
    getEarnings(user.id, page, 20, filters),
    getEarningsSummary(user.id),
  ]);

  return (
    <AnimatedLayout>
    <div className="space-y-6">
      <PageHeader
        title="Earnings Tracker"
        description="Track your affiliate earnings by network and period"
        action={<ExportEarningsButton />}
      />

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              This Month
            </CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              ${parseFloat(summary.thisMonth).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              All Time
            </CardTitle>
            <DollarSign className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold font-mono tabular-nums">
              ${parseFloat(summary.allTime).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-muted-foreground">
              Top Network
            </CardTitle>
            <Trophy className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {summary.topNetwork?.network ?? "N/A"}
            </div>
            {summary.topNetwork && (
              <p className="text-sm text-muted-foreground font-mono tabular-nums">
                ${parseFloat(summary.topNetwork.total).toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AddEarningForm />

      <EarningFilters />

      <Card>
        <CardHeader>
          <CardTitle>Earnings History</CardTitle>
        </CardHeader>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Period</TableHead>
                <TableHead>Network</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Notes</TableHead>
                <TableHead></TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {earningsList.map((earning) => (
                <TableRow key={earning.id}>
                  <TableCell className="font-medium">
                    {earning.period}
                  </TableCell>
                  <TableCell>{earning.networkName}</TableCell>
                  <TableCell>
                    ${parseFloat(earning.amount).toFixed(2)}
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {earning.notes ?? "-"}
                  </TableCell>
                  <TableCell>
                    <DeleteEarningButton earningId={earning.id} />
                  </TableCell>
                </TableRow>
              ))}
              {earningsList.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="py-16 text-center">
                    <div className="flex flex-col items-center">
                      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                        <DollarSign className="h-6 w-6 text-muted-foreground" />
                      </div>
                      <p className="mt-4 text-sm font-medium">No earnings recorded yet</p>
                      <p className="mt-1 text-sm text-muted-foreground">Add your first entry above to start tracking.</p>
                    </div>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <PaginationControls currentPage={page} totalPages={totalPages} />
    </div>
    </AnimatedLayout>
  );
}
