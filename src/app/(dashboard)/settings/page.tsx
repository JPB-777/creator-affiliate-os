import { requireUser } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default async function SettingsPage() {
  const user = await requireUser();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Settings</h1>
        <p className="text-muted-foreground">Manage your account</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-3">
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Name
            </span>
            <p>{user.name}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Email
            </span>
            <p>{user.email}</p>
          </div>
          <div>
            <span className="text-sm font-medium text-muted-foreground">
              Member since
            </span>
            <p>{new Date(user.createdAt).toLocaleDateString()}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
