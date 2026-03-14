import { requireUser } from "@/lib/auth-utils";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { UpdateProfileForm } from "@/components/settings/update-profile-form";
import { ChangePasswordForm } from "@/components/settings/change-password-form";
import { WeeklyReportToggle } from "@/components/settings/weekly-report-toggle";
import { ApiKeysSection } from "@/components/settings/api-keys-section";
import { getUserPreferences } from "@/server/queries/onboarding";
import { getApiKeys } from "@/server/queries/api-keys";
import { AnimatedLayout } from "@/components/shared/animated-layout";
import { PageHeader } from "@/components/shared/page-header";

export default async function SettingsPage() {
  const user = await requireUser();
  const [prefs, apiKeys] = await Promise.all([
    getUserPreferences(user.id),
    getApiKeys(user.id),
  ]);

  return (
    <AnimatedLayout>
    <div className="space-y-6">
      <PageHeader title="Settings" description="Manage your account" />

      <Card>
        <CardHeader>
          <CardTitle>Profile</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
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
          <UpdateProfileForm currentName={user.name ?? ""} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Change Password</CardTitle>
        </CardHeader>
        <CardContent>
          <ChangePasswordForm />
        </CardContent>
      </Card>
      <Card>
        <CardHeader>
          <CardTitle>Notifications</CardTitle>
        </CardHeader>
        <CardContent>
          <WeeklyReportToggle enabled={prefs?.weeklyReportEnabled ?? true} />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>API Keys</CardTitle>
        </CardHeader>
        <CardContent>
          <ApiKeysSection keys={apiKeys} />
        </CardContent>
      </Card>
    </div>
    </AnimatedLayout>
  );
}
