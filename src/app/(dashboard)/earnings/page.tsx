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

export default async function EarningsPage() {
  const user = await requireUser();
  const [earningsList, summary] = await Promise.all([
    getEarnings(user.id),
    getEarningsSummary(user.id),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Earnings Tracker</h1>
        <p className="text-muted-foreground">
          Track your affiliate earnings by network and period
        </p>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              This Month
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(summary.thisMonth).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              All Time
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              ${parseFloat(summary.allTime).toFixed(2)}
            </div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm text-muted-foreground">
              Top Network
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-lg font-bold">
              {summary.topNetwork?.network ?? "N/A"}
            </div>
            {summary.topNetwork && (
              <p className="text-sm text-muted-foreground">
                ${parseFloat(summary.topNetwork.total).toFixed(2)}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      <AddEarningForm />

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
                  <TableCell
                    colSpan={5}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No earnings recorded yet. Add your first entry above.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
