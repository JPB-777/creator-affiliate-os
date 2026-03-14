import { Skeleton } from "@/components/ui/skeleton";

export default function OnboardingLoading() {
  return (
    <div className="mx-auto max-w-2xl space-y-6 py-8">
      <Skeleton className="h-10 w-64 mx-auto" />
      <Skeleton className="h-4 w-96 mx-auto" />
      <Skeleton className="h-64 w-full rounded-xl" />
      <div className="flex justify-between">
        <Skeleton className="h-10 w-24" />
        <Skeleton className="h-10 w-24" />
      </div>
    </div>
  );
}
