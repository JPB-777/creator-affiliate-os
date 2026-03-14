import { requireUser } from "@/lib/auth-utils";
import { getUserPreferences } from "@/server/queries/onboarding";
import { redirect } from "next/navigation";
import { OnboardingWizard } from "@/components/onboarding/onboarding-wizard";

export default async function OnboardingPage() {
  const user = await requireUser();
  const prefs = await getUserPreferences(user.id);

  // Already completed onboarding — go to dashboard
  if (prefs?.onboardingCompletedAt) {
    redirect("/dashboard");
  }

  const state = prefs?.onboardingState ?? { currentStep: 0, completedSteps: [] };

  return (
    <OnboardingWizard
      userName={user.name}
      completedSteps={state.completedSteps}
      urlAdded={state.urlAdded}
    />
  );
}
